import { chromium } from 'playwright';

const BASE = 'http://localhost:8817/index.html';
const OUT = process.env.SMOKE_OUT || '/tmp';

// CHROME_PATH lets this run against a preinstalled browser; omit it and
// Playwright uses whatever it downloaded itself.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
});
const page = await ctx.newPage();

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`); });
page.on('pageerror', e => errors.push(`PAGEERROR: ${e.message}\n${e.stack?.split('\n').slice(0,4).join('\n')}`));
page.on('requestfailed', r => errors.push(`REQFAIL: ${r.url()} — ${r.failure()?.errorText}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);

// Dismiss the welcome sheet if present.
const welcome = page.locator('.sheet-actions .btn--primary');
if (await welcome.count()) { await welcome.first().click(); await page.waitForTimeout(500); }

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
}

// --- TODAY -----------------------------------------------------------------
await shot('01-today');
const title = await page.locator('.hdr-title').first().textContent();
console.log('Today header:', title);
const cards = await page.locator('.xcard').count();
console.log('Exercise cards:', cards);
const loadShown = await page.locator('.loadbar-num').first().textContent().catch(() => null);
console.log('First computed load:', loadShown);

// Log a set: tap the first check button on a real strength card.
const mainSet = page.locator('.xcard').filter({ hasText: 'Back Squat' }).first();
if (await mainSet.count()) {
  await mainSet.locator('.checkbtn').first().click();
  await page.waitForTimeout(400);
  const done = await mainSet.locator('.setrow.is-done').count();
  console.log('Set marked done:', done > 0);
  const restVisible = await page.locator('.rest-bar.in').count();
  console.log('Rest timer appeared:', restVisible > 0);
  const ringText = await page.locator('.hdr-ring text').first().textContent();
  console.log('Header ring after log:', ringText);
  await shot('02-set-logged');
}

// Open an exercise detail sheet.
await page.locator('.xcard').filter({ hasText: 'Back Squat' }).first().locator('.xcard-head').click();
await page.waitForTimeout(500);
console.log('Detail sheet cues:', await page.locator('.sheet .cues li').count());
await shot('03-detail');
await page.locator('.sheet-actions .btn').first().click();
await page.waitForTimeout(400);

// --- OTHER TABS ------------------------------------------------------------
for (const [tab, name] of [['Plan','04-plan'], ['Progress','05-progress'], ['Fuel','06-fuel'], ['More','07-settings']]) {
  await page.locator('.tab', { hasText: tab }).click();
  await page.waitForTimeout(600);
  await shot(name);
  console.log(`${tab} rendered:`, await page.locator('.hdr-title').first().textContent());
}

// Expand a block in Plan.
await page.locator('.tab', { hasText: 'Plan' }).click();
await page.waitForTimeout(400);
await page.locator('.blockcard-head').nth(2).click();
await page.waitForTimeout(400);
console.log('Block 3 sessions listed:', await page.locator('.sesspill').count());
await shot('08-plan-expanded');

// Log a metric in Progress.
await page.locator('.tab', { hasText: 'Progress' }).click();
await page.waitForTimeout(400);
await page.selectOption('.card--log .sel', 'approach');
await page.fill('.card--log .num--wide', '30');
await page.locator('.card--log .btn--primary').click();
await page.waitForTimeout(600);
await page.selectOption('.card--log .sel', 'bodyweight');
await page.fill('.card--log .num--wide', '190');
await page.locator('.card--log .btn--primary').click();
await page.waitForTimeout(600);
console.log('Hero metric shown:', await page.locator('.hero-num').first().textContent().catch(()=>'none'));
await shot('09-progress-logged');

// Settings: 3RM -> max conversion
await page.locator('.tab', { hasText: 'More' }).click();
await page.waitForTimeout(400);
await page.locator('.linkbtn', { hasText: 'from 3RM' }).first().click();
await page.waitForTimeout(500);
await page.fill('.sheet .num--wide', '275');
await page.locator('.sheet-actions .btn--primary').click();
await page.waitForTimeout(700);
const newMax = await page.locator('.maxrow .num').first().inputValue();
console.log('Squat max after 275x3:', newMax, '(expect ~303)');
await shot('10-settings');

// Exercise library
await page.locator('.btn', { hasText: 'Browse all movements' }).click();
await page.waitForTimeout(600);
console.log('Library items:', await page.locator('.libitem').count());
await shot('11-library');
await page.locator('.sheet-actions .btn').first().click();
await page.waitForTimeout(300);

// --- PERSISTENCE ------------------------------------------------------------
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(900);
const persisted = await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('atn.state.v1'));
  return { maxes: s.maxes, metrics: Object.keys(s.metrics), loggedSets: Object.keys(s.logs).length };
});
console.log('Persisted:', JSON.stringify(persisted));

// --- Walk every week/day to smoke out prescription errors -------------------
const walk = await page.evaluate(async () => {
  const prog = await import('./js/data/program.js');
  const store = await import('./js/store.js');
  const { ex } = await import('./js/data/exercises.js');
  const issues = [];
  let sessions = 0, items = 0;
  for (let w = 1; w <= prog.TOTAL_WEEKS; w++) {
    const wib = prog.weekInBlock(w);
    for (const s of prog.weekSessions(w)) {
      sessions++;
      if (!s.id || !s.name || !s.sections?.length) issues.push(`wk${w} d${s.day}: malformed session`);
      for (const sec of s.sections) {
        for (const it of sec.items) {
          items++;
          const def = ex(it.ex);
          if (!def || def.name === it.ex) issues.push(`wk${w} ${s.id}: unknown exercise "${it.ex}"`);
          if (!def.cues?.length) issues.push(`${it.ex}: no cues`);
          if (!def.why) issues.push(`${it.ex}: no rationale`);
          const sets = prog.atWeek(it.sets, wib);
          if (sets == null || sets <= 0) issues.push(`wk${w} ${s.id} ${it.ex}: bad sets ${sets}`);
          if (it.pct) {
            const L = store.targetLoad(it, wib);
            if (!L || L <= 0) issues.push(`wk${w} ${s.id} ${it.ex}: pct item resolved to load ${L}`);
          }
        }
      }
      const mins = prog.sessionMinutes(s, wib);
      if (!(mins > 5 && mins < 180)) issues.push(`wk${w} ${s.id}: implausible duration ${mins}m`);
    }
  }
  // Gaining-phase specific checks.
  for (let w = 1; w <= prog.TOTAL_WEEKS; w++) {
    const pat = prog.weeklySetsByPattern(w);
    for (const [k, v] of Object.entries(pat)) {
      if (!Number.isFinite(v) || v < 0) issues.push(`wk${w}: pattern ${k} = ${v}`);
    }
    if (!prog.isTestWeek(w) && !prog.isDeloadWeek(w)) {
      for (const key of ['squat', 'hinge', 'push', 'pull']) {
        if ((pat[key] || 0) < 6) issues.push(`wk${w}: only ${pat[key] || 0} ${key} sets — too little for hypertrophy`);
      }
    }
    // Every loading week must still contain jump work. The test week measures
    // jumps instead of training them, so it is exempt.
    if (!prog.isTestWeek(w) && (pat.plyo || 0) < 2) {
      issues.push(`wk${w}: only ${pat.plyo || 0} jump sets — athleticism unprotected`);
    }
  }

  return { sessions, items, issues };
});
console.log(`\nWalked ${walk.sessions} sessions / ${walk.items} prescribed items`);
console.log('Data issues:', walk.issues.length ? walk.issues.slice(0, 25) : 'none');

console.log('\n=== JS ERRORS ===');
console.log(errors.length ? errors.join('\n---\n') : 'none');

await browser.close();

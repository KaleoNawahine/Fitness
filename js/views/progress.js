import { h, clear, lineChart, barChart, ring, sparkline, numberInput, toast, sheet, fmtNum, fmtDate } from '../ui.js';
import * as store from '../store.js';
import { METRICS, MAX_LIFTS, TOTAL_WEEKS, blockForWeek, weeklySetsByPattern } from '../data/program.js';
import { computeTargets, projectedWeight, weeksToGoal, surplusAdvice } from '../data/nutrition.js';

const KEY_LIFTS = [
  { ex: 'back_squat', ref: 'squat', name: 'Back Squat' },
  { ex: 'trap_dl', ref: 'trapbar', name: 'Trap Bar Deadlift' },
  { ex: 'bench', ref: 'bench', name: 'Bench Press' },
  { ex: 'ohp', ref: 'ohp', name: 'Overhead Press' }
];

const SIZE_METRICS = ['waist', 'chest', 'arm', 'thigh'];
const ATHLETIC_METRICS = ['approach', 'block', 'broad', 'agility'];

const PATTERN_LABELS = {
  squat: 'Squat', hinge: 'Hinge', push: 'Push', pull: 'Pull',
  lunge: 'Lunge', calf: 'Calves', core: 'Core', plyo: 'Jumps', cod: 'Agility'
};

export function render(root, nav) {
  clear(root);
  const cw = store.currentWeek();
  root.style.setProperty('--accent', blockForWeek(cw).color);

  const profile = store.get().profile;
  const t = computeTargets(profile);
  const st = store.streak();
  const adh = store.adherence();
  const overall = store.overallProgress();

  root.append(
    h('header', { class: 'hdr' },
      h('div', { class: 'hdr-top' },
        h('div', null,
          h('h1', { class: 'hdr-title', text: 'Progress' }),
          h('p', { class: 'hdr-sub', text: 'The receipts. Numbers, not vibes.' })
        )
      )
    )
  );

  const body = h('div', { class: 'stack' });
  root.append(body);

  /* ------------------------------------------------------------- top row */
  body.append(
    h('div', { class: 'statgrid' },
      stat('Streak', st ? `${st}` : '0', st === 1 ? 'day' : 'days'),
      stat('Program', `${overall.pct}%`, `${overall.done}/${overall.total} sessions`),
      stat('28-day', `${adh.pct}%`, `${adh.done} sessions`),
      stat('Tonnage', fmtNum(store.totalTonnage()), 'lb lifted')
    )
  );

  /* --------------------------------------------------- headline: bodyweight */
  body.append(bodyweightHero(profile, t));

  /* ------------------------------------------------------- log a metric */
  body.append(logCard(root, nav));

  /* -------------------------------------------------------- measurements */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'The tape' }),
      h('p', { class: 'muted', text: 'The number that matters is the ratio between these. Chest, arm and thigh climbing while the waist holds flat is a clean gain — measure cold, every two weeks.' }),
      h('div', { class: 'measuregrid' },
        SIZE_METRICS.map(k => metricTile(k, root, nav))
      )
    )
  );

  /* ---------------------------------------------------- athletic retention */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Still an athlete?' }),
      h('p', { class: 'muted', text: 'These are the guardrails on the gaining phase. Holding them steady while you add 10 lb means the weight is muscle; watching them slide means it is not.' }),
      h('div', { class: 'metricgrid' },
        ATHLETIC_METRICS.map(k => metricTile(k, root, nav))
      )
    )
  );

  /* ------------------------------------------------------------ strength */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Estimated 1RM' }),
      h('p', { class: 'muted', text: 'Calculated from every set you log. On a gaining phase these should climb steadily — muscle you cannot load eventually stops growing.' }),
      h('div', { class: 'stack-sm' },
        KEY_LIFTS.map(l => {
          const series = store.e1rmSeries(l.ex);
          const cur = store.get().maxes[l.ref];
          const best = series.length ? Math.max(...series.map(p => p.v)) : null;
          return h('div', { class: 'liftrow' },
            h('div', { class: 'liftrow-main' },
              h('span', { class: 'liftrow-name', text: l.name }),
              h('span', { class: 'liftrow-sub', text: best ? `best logged e1RM ${best} lb` : 'no sets logged yet' })
            ),
            series.length > 1
              ? sparkline(series.map(p => p.v), blockForWeek(cw).color)
              : h('span', { class: 'spark-empty', text: '—' }),
            h('span', { class: 'liftrow-val', text: `${cur}` })
          );
        })
      )
    )
  );

  /* --------------------------------------------------- weekly hard sets */
  const patterns = weeklySetsByPattern(cw);
  const patternRows = Object.entries(patterns)
    .filter(([p]) => PATTERN_LABELS[p])
    .sort((a, b) => b[1] - a[1])
    .map(([p, v]) => ({ label: PATTERN_LABELS[p], v, display: `${v} sets` }));
  if (patternRows.length) {
    body.append(
      h('div', { class: 'card' },
        h('h2', { class: 'sect-title', text: `Week ${cw} hard sets` }),
        h('p', { class: 'muted', text: 'Weekly set count per movement pattern — the number that actually drives growth. Ten to twenty per pattern is the productive range; the optional Pump day and the warm-up work are not counted.' }),
        barChart(patternRows)
      )
    );
  }

  /* ------------------------------------------------------------- volume */
  const byWeek = store.tonnageByWeek();
  const weeks = Object.keys(byWeek).map(Number).sort((a, b) => a - b);
  if (weeks.length) {
    body.append(
      h('div', { class: 'card' },
        h('h2', { class: 'sect-title', text: 'Weekly tonnage' }),
        h('p', { class: 'muted', text: 'Total weight moved. Expect this to dip on every fourth week — that is the deload working.' }),
        barChart(weeks.map(w => ({ label: `Wk ${w}`, v: byWeek[w], display: `${fmtNum(byWeek[w])} lb` })))
      )
    );
  }

  /* --------------------------------------------------------- all metrics */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Full history' }),
      h('div', { class: 'stack-sm' },
        Object.entries(METRICS).map(([k, m]) => {
          const series = store.metricSeries(k);
          return h('button', {
            class: 'rowbtn',
            onclick: () => openMetricSheet(k, m, root, nav)
          },
            h('span', { class: 'rowbtn-main' },
              h('strong', { text: m.name }),
              h('span', { class: 'muted', text: series.length ? `${series.length} entries · latest ${series[series.length - 1].v} ${m.unit}` : 'no entries' })
            ),
            h('span', { class: 'rowbtn-chev', text: '›' })
          );
        })
      )
    )
  );

  body.append(h('div', { class: 'spacer' }));
}

/* ----------------------------------------------------------------- pieces */

function bodyweightHero(profile, t) {
  const bw = store.metricSeries('bodyweight');
  const trend = store.weightTrend(28);
  const goalW = profile.goalWeight;

  if (!bw.length) {
    return h('div', { class: 'card card--hero' },
      h('span', { class: 'hero-cap', text: 'Body weight' }),
      h('p', { class: 'muted', text: `Log your weight below to start tracking. Target is ${goalW} lb, and the app will tell you whether you are getting there at the right speed.` })
    );
  }

  const last = bw[bw.length - 1];
  const first = bw[0];
  const gained = last.v - first.v;
  const avg = store.metricAvg('bodyweight', 7);
  const toGo = goalW ? +(goalW - last.v).toFixed(1) : null;
  const advice = surplusAdvice(trend ? trend.perWeek : null, t.targetRate);

  return h('div', { class: 'card card--hero' },
    h('span', { class: 'hero-cap', text: `Body weight — target ${goalW} lb` }),
    h('div', { class: 'hero-row' },
      h('span', { class: 'hero-num', text: `${last.v}` }),
      h('span', { class: 'hero-unit', text: 'lb' }),
      bw.length > 1 ? h('span', {
        class: `hero-delta ${gained >= 0 ? 'up' : 'down'}`,
        text: `${gained >= 0 ? '+' : ''}${gained.toFixed(1)} since week 1`
      }) : null
    ),
    h('div', { class: 'kvlist' },
      avg ? kv('7-entry average', `${avg} lb`) : null,
      trend ? kv('Current rate', `${trend.perWeek >= 0 ? '+' : ''}${trend.perWeek} lb / week (target ${t.targetRate > 0 ? '+' : ''}${t.targetRate})`) : null,
      toGo != null && toGo > 0 ? kv('To go', `${toGo} lb · about ${weeksToGoal(last.v, goalW, t.targetRate) ?? '—'} weeks`) : null,
      toGo != null && toGo <= 0 ? kv('Target', 'reached') : null
    ),
    lineChart(bw.map((p, idx) => ({ x: idx, y: p.v })), { hgt: 130, target: goalW, yUnit: ' lb' }),
    h('p', { class: `advice-line advice-line--sm tone-${advice.tone}`, text: advice.headline })
  );
}

function stat(cap, val, sub) {
  return h('div', { class: 'stat' },
    h('span', { class: 'stat-cap', text: cap }),
    h('span', { class: 'stat-val', text: val }),
    h('span', { class: 'stat-sub', text: sub })
  );
}

function kv(k, v) {
  if (!v) return null;
  return h('div', { class: 'kv' },
    h('span', { class: 'kv-k', text: k }),
    h('span', { class: 'kv-v', text: v })
  );
}

function metricTile(key, root, nav) {
  const m = METRICS[key];
  const series = store.metricSeries(key);
  const last = series.length ? series[series.length - 1] : null;
  const firstV = series.length ? series[0].v : null;

  let deltaGood = null, deltaText = null;
  if (series.length > 1) {
    const raw = last.v - firstV;
    deltaText = `${raw >= 0 ? '+' : ''}${raw.toFixed(1)}`;
    if (m.better === 'higher') deltaGood = raw >= 0;
    else if (m.better === 'lower') deltaGood = raw <= 0;
    else deltaGood = Math.abs(raw) < 0.75; // "flat" — small change is the win
  }

  return h('button', {
    class: 'mtile',
    onclick: () => openMetricSheet(key, m, root, nav)
  },
    h('span', { class: 'mtile-cap', text: m.name }),
    h('span', { class: 'mtile-val' },
      last ? `${last.v}` : '—',
      h('span', { class: 'mtile-unit', text: m.unit })
    ),
    series.length > 1
      ? sparkline(series.map(p => p.v), 'currentColor', 64, 20)
      : h('span', { class: 'spark-empty', text: 'tap to log' }),
    deltaText ? h('span', {
      class: `mtile-delta ${deltaGood ? 'up' : 'down'}`,
      text: deltaText
    }) : null
  );
}

function logCard(root, nav) {
  const keys = Object.keys(METRICS);
  const sel = h('select', { class: 'sel' }, keys.map(k => h('option', { value: k, text: `${METRICS[k].name} (${METRICS[k].unit})` })));
  const val = numberInput({ placeholder: 'value', class: 'num num--wide' });
  const dateIn = h('input', { type: 'date', class: 'num num--date', value: store.todayISO() });

  return h('div', { class: 'card card--log' },
    h('h2', { class: 'sect-title', text: 'Log a measurement' }),
    h('div', { class: 'logrow' }, sel, val, dateIn,
      h('button', {
        class: 'btn btn--primary',
        onclick: () => {
          const v = parseFloat(val.value);
          if (!Number.isFinite(v)) { toast('Enter a number', 'warn'); return; }
          store.logMetric(sel.value, v, dateIn.value || undefined);
          if (sel.value === 'bodyweight') store.update(s => { s.profile.weightLb = v; });
          toast(`${METRICS[sel.value].name} logged`);
          render(root, nav);
        }
      }, 'Log')
    ),
    h('p', { class: 'muted', text: 'Weigh in at least three times a week — the app needs several points across at least ten days before it will trust a trend. Approach and block jump are touch height minus your standing reach.' })
  );
}

function openMetricSheet(key, m, root, nav) {
  const series = store.metricSeries(key);
  const body = h('div', { class: 'detail' },
    m.note ? h('p', { class: 'muted', text: m.note }) : null,
    series.length
      ? lineChart(series.map((p, idx) => ({ x: idx, y: p.v })), {
          hgt: 140, target: m.target ?? null, yUnit: ` ${m.unit}`
        })
      : h('p', { class: 'muted', text: 'Nothing logged for this yet.' }),
    series.length ? h('div', { class: 'hist' },
      h('h4', { text: 'Entries' }),
      [...series].reverse().map(p => h('div', { class: 'hist-row' },
        h('span', { class: 'hist-wk', text: fmtDate(p.d) }),
        h('span', { class: 'hist-load', text: `${p.v} ${m.unit}` }),
        h('button', {
          class: 'linkbtn',
          onclick: () => { store.deleteMetric(key, p.d); toast('Deleted'); render(root, nav); }
        }, 'delete')
      ))
    ) : null
  );
  sheet(m.name, body, [{ label: 'Close', kind: 'primary' }]);
}

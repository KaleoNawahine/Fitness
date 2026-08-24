import { h, clear, toast, sheet, restTimer, numberInput, ring, confirmSheet } from '../ui.js';
import * as store from '../store.js';
import { ex } from '../data/exercises.js';
import {
  blockForWeek, weekInBlock, weekSessions, sessionFor, dayLabel, atWeek,
  isDeloadWeek, isTestWeek, sessionMinutes, sessionVolume, METRICS, MAX_LIFTS, TOTAL_WEEKS
} from '../data/program.js';

let openWeek = null;
let openDay = null;

export function setTarget(week, day) {
  openWeek = week;
  openDay = day;
}

export function render(root, nav) {
  const week = openWeek ?? store.currentWeek();
  const day = openDay ?? store.suggestedDay();
  openWeek = week; openDay = day;

  const block = blockForWeek(week);
  const wib = weekInBlock(week);
  const session = sessionFor(week, day);
  const log = store.getLog(week, day);

  clear(root);
  root.style.setProperty('--accent', block.color);

  if (!session) {
    root.append(h('div', { class: 'pad' }, h('p', { class: 'muted', text: 'No session scheduled.' })));
    return;
  }

  /* ------------------------------------------------------------- header */
  root.append(
    h('header', { class: 'hdr' },
      h('div', { class: 'hdr-top' },
        h('div', null,
          h('div', { class: 'hdr-kicker' },
            h('span', { class: 'chip chip--block', text: `Block ${block.n} · ${block.name}` }),
            isDeloadWeek(week) && !isTestWeek(week) ? h('span', { class: 'chip chip--warn', text: 'Deload' }) : null,
            isTestWeek(week) ? h('span', { class: 'chip chip--good', text: 'Test Week' }) : null
          ),
          h('h1', { class: 'hdr-title', text: session.name }),
          h('p', { class: 'hdr-sub', text: `Week ${week} of ${TOTAL_WEEKS} · ${dayLabel(day)} · ${sessionMinutes(session, wib)} min · ${sessionVolume(session, wib)} working sets` })
        ),
        sessionRing(week, day, session, wib)
      ),
      dayStrip(week, day, nav)
    )
  );

  /* -------------------------------------------------------------- brief */
  const body = h('div', { class: 'stack' });
  root.append(body);

  body.append(
    h('div', { class: 'card card--brief' },
      h('p', { class: 'focus', text: session.focus }),
      h('p', { class: 'brief', text: session.brief })
    )
  );

  if (log?.done) {
    body.append(
      h('div', { class: 'banner banner--good' },
        h('span', { text: `Logged ${log.date ? 'on ' + log.date : ''}. Nice work.` }),
        h('button', {
          class: 'btn btn--ghost btn--sm',
          onclick: () => { store.reopenSession(week, day); render(root, nav); }
        }, 'Reopen')
      )
    );
  }

  /* ----------------------------------------------------------- sections */
  session.sections.forEach((sec, si) => {
    body.append(renderSection(sec, si, { week, day, session, wib, root, nav }));
  });

  /* ------------------------------------------------------------- finish */
  body.append(
    h('div', { class: 'card' },
      h('label', { class: 'field-label', text: 'Session notes' }),
      h('textarea', {
        class: 'ta', rows: 3, placeholder: 'How did it feel? Anything hurt? Jump feel snappy?',
        value: log?.notes || '',
        onchange: e => store.update(s => {
          const l = store.ensureLog(week, day);
          l.notes = e.target.value;
        })
      }),
      h('button', {
        class: 'btn btn--primary btn--big',
        onclick: () => finish(week, day, root, nav)
      }, log?.done ? 'Update session' : 'Finish session')
    )
  );

  body.append(h('div', { class: 'spacer' }));
}

/* --------------------------------------------------------------- pieces */

function sessionRing(week, day, session, wib) {
  const log = store.getLog(week, day);
  const total = countSets(session, wib);
  const done = Object.values(log?.sets || {}).filter(s => s.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return h('div', { class: 'hdr-ring' },
    ring(pct, { size: 60, stroke: 5, label: `${pct}` }),
    h('span', { class: 'hdr-ring-cap', text: `${done}/${total} sets` })
  );
}

/** Prep and recovery work is checked off once per movement, not once per set. */
function isSupportSection(name) {
  return /prep|recovery|down-regulate|flow|tissue/i.test(name);
}

function countSets(session, wib) {
  let n = 0;
  for (const sec of session.sections) {
    const support = isSupportSection(sec.name);
    for (const it of sec.items) n += support ? 1 : (atWeek(it.sets, wib) || 1);
  }
  return n;
}

function dayStrip(week, day, nav) {
  const sessions = weekSessions(week);
  return h('div', { class: 'daystrip' },
    h('button', {
      class: 'daystrip-nav', 'aria-label': 'Previous week',
      disabled: week <= 1,
      onclick: () => { setTarget(Math.max(1, week - 1), null); store.setWeek(Math.max(1, week - 1)); nav('today'); }
    }, '‹'),
    h('div', { class: 'daystrip-days' },
      sessions.map(s => {
        const l = store.getLog(week, s.day);
        return h('button', {
          class: `dpill ${s.day === day ? 'is-active' : ''} ${l?.done ? 'is-done' : ''} ${s.optional ? 'is-opt' : ''}`,
          onclick: () => { setTarget(week, s.day); nav('today'); }
        },
          h('span', { class: 'dpill-day', text: dayLabel(s.day) }),
          h('span', { class: 'dpill-dot' })
        );
      })
    ),
    h('button', {
      class: 'daystrip-nav', 'aria-label': 'Next week',
      disabled: week >= TOTAL_WEEKS,
      onclick: () => { const w = Math.min(TOTAL_WEEKS, week + 1); setTarget(w, null); store.setWeek(w); nav('today'); }
    }, '›')
  );
}

function renderSection(sec, si, ctx) {
  const isPrep = isSupportSection(sec.name);
  return h('section', { class: `sect ${isPrep ? 'sect--prep' : ''}` },
    h('div', { class: 'sect-head' },
      h('h2', { class: 'sect-title', text: sec.name }),
      sec.notes ? h('p', { class: 'sect-note', text: sec.notes }) : null
    ),
    sec.items.map((item, ii) => exerciseCard(item, `${si}-${ii}`, ctx, sec))
  );
}

function exerciseCard(item, idx, ctx, sec) {
  const { week, day, session, wib, root, nav } = ctx;
  const def = ex(item.ex);
  const sets = atWeek(item.sets, wib) || 1;
  const reps = atWeek(item.reps, wib);
  const rpe = atWeek(item.rpe, wib);
  const target = store.targetLoad(item, wib);
  const isVariant = sec.notes && /pick one/i.test(sec.notes);
  const variantOff = isVariant && isSuppressedVariant(item.ex);

  const card = h('article', { class: `xcard ${variantOff ? 'is-dim' : ''}` });

  /* title row */
  const meta = [];
  if (sets && reps) meta.push(`${sets} × ${reps}`);
  else if (reps) meta.push(String(reps));
  if (item.tempo) meta.push(`tempo ${item.tempo}`);
  if (item.pct) meta.push(`${Math.round(atWeek(item.pct, wib) * (item.pctOf || 1) * 100)}%`);
  if (rpe) meta.push(`RPE ${rpe}`);
  if (item.rest) meta.push(`${item.rest >= 60 ? (item.rest / 60).toFixed(item.rest % 60 ? 1 : 0) + ' min' : item.rest + ' s'} rest`);

  card.append(
    h('div', { class: 'xcard-head', onclick: () => openDetail(item, def, ctx) },
      h('div', { class: 'xcard-title-wrap' },
        h('h3', { class: 'xcard-title' },
          def.name,
          item.pair ? h('span', { class: 'pairtag', text: `pair ${item.pair}` }) : null
        ),
        h('p', { class: 'xcard-meta', text: meta.join(' · ') })
      ),
      h('button', { class: 'info-btn', 'aria-label': 'How to do this', text: '?' })
    )
  );

  if (item.note) card.append(h('p', { class: 'xcard-note', text: item.note }));

  /* load guidance */
  if (target) {
    const ramp = store.warmupRamp(target, store.get().prefs.plateInc);
    card.append(
      h('div', { class: 'loadbar' },
        h('div', { class: 'loadbar-main' },
          h('span', { class: 'loadbar-num', text: `${target}` }),
          h('span', { class: 'loadbar-unit', text: 'lb' })
        ),
        ramp.length ? h('div', { class: 'loadbar-ramp' },
          h('span', { class: 'ramp-cap', text: 'Warm up' }),
          ramp.map(r => h('span', { class: 'ramp-step', text: `${r.weight}×${r.reps}` }))
        ) : null
      )
    );
  } else if (rpe && def.loadType === 'rpe') {
    const sug = store.suggestLoad(item, item.ex, week, day);
    if (sug) {
      card.append(
        h('div', { class: 'loadbar loadbar--sug' },
          h('div', { class: 'loadbar-main' },
            h('span', { class: 'loadbar-num', text: `${sug.suggested}` }),
            h('span', { class: 'loadbar-unit', text: 'lb' })
          ),
          h('span', { class: 'loadbar-hint', text: `last time ${sug.last.w} lb × ${sug.last.r || '?'}${sug.last.rpe ? ` @ RPE ${sug.last.rpe}` : ''}` })
        )
      );
    }
  }

  /* metric / max capture on test days */
  if (item.metric) card.append(metricCapture(item.metric, root, nav));
  if (item.maxRef) card.append(maxCapture(item.maxRef, root, nav));

  /* set rows — support work gets a single "done" row */
  const support = isSupportSection(sec.name);
  const rows = h('div', { class: 'sets' });
  const needsLoad = !support && ['pct', 'rpe', 'bw'].includes(def.loadType);
  const rowCount = support ? 1 : sets;
  for (let n = 1; n <= rowCount; n++) {
    rows.append(setRow({
      item, def, n, idx, target, reps, rpe, needsLoad, ctx,
      staticText: support ? (sets > 1 ? `${sets} × ${reps}` : String(reps || 'done')) : null
    }));
  }
  card.append(rows);

  if (isVariant) {
    card.append(h('button', {
      class: 'btn btn--ghost btn--sm',
      onclick: () => { chooseVariant(item.ex); render(root, nav); }
    }, variantOff ? 'Use this variation instead' : 'This is my pick'));
  }

  return card;
}

function isSuppressedVariant(exId) {
  const pref = store.get().prefs.cleanVariant;
  if (exId === 'hang_clean') return pref !== 'hang_clean';
  if (exId === 'jump_shrug') return pref !== 'jump_shrug';
  return false;
}

function chooseVariant(exId) {
  if (exId === 'hang_clean' || exId === 'jump_shrug') {
    store.update(s => { s.prefs.cleanVariant = exId; });
    toast(`Using ${ex(exId).name} for the rest of the program.`);
  }
}

function setRow({ item, def, n, idx, target, reps, rpe, needsLoad, ctx, staticText }) {
  const { week, day, session } = ctx;
  const key = store.setKeyFor(session.id, item.ex, idx, n);
  const log = store.getLog(week, day);
  const data = log?.sets?.[key] || {};

  const wIn = numberInput({
    placeholder: target ? String(target) : (data.w ? String(data.w) : '—'),
    value: data.w ?? '',
    'aria-label': 'Weight',
    oninput: e => store.logSet(week, day, key, { w: num(e.target.value) })
  });
  const rIn = numberInput({
    placeholder: typeof reps === 'number' ? String(reps) : String(reps || '').replace(/[^\d]/g, '') || '—',
    value: data.r ?? '',
    'aria-label': 'Reps',
    oninput: e => store.logSet(week, day, key, { r: num(e.target.value) })
  });
  const rpeIn = numberInput({
    placeholder: rpe ? String(rpe) : 'RPE',
    value: data.rpe ?? '',
    'aria-label': 'RPE',
    class: 'num num--rpe',
    oninput: e => store.logSet(week, day, key, { rpe: num(e.target.value) })
  });

  const row = h('div', { class: `setrow ${data.done ? 'is-done' : ''}` },
    h('span', { class: 'setno', text: String(n) }),
    needsLoad
      ? h('div', { class: 'setfield' }, wIn, h('span', { class: 'setunit', text: 'lb' }))
      : h('div', { class: 'setfield setfield--wide' }, h('span', { class: 'setstatic', text: staticText ?? String(reps || '') })),
    needsLoad ? h('div', { class: 'setfield' }, rIn, h('span', { class: 'setunit', text: 'reps' })) : null,
    needsLoad ? h('div', { class: 'setfield setfield--rpe' }, rpeIn) : null,
    h('button', {
      class: 'checkbtn', 'aria-label': `Complete set ${n}`,
      onclick: () => {
        const nowDone = !data.done;
        const patch = { done: nowDone };
        if (nowDone) {
          if (needsLoad && !wIn.value && target) { patch.w = target; wIn.value = target; }
          if (needsLoad && !rIn.value) {
            const r = typeof reps === 'number' ? reps : parseInt(String(reps).match(/\d+/)?.[0] || '', 10);
            if (r) { patch.r = r; rIn.value = r; }
          }
        }
        store.logSet(week, day, key, patch);
        row.classList.toggle('is-done', nowDone);
        data.done = nowDone;
        if (nowDone && item.rest && store.get().prefs.autoRest) {
          restTimer.start(item.rest);
        }
        refreshRing(ctx);
      }
    }, h('span', { class: 'checkmark', html: '&#10003;' }))
  );
  return row;
}

function refreshRing(ctx) {
  const hdr = document.querySelector('.hdr-ring');
  if (!hdr) return;
  const { week, day, session, wib } = ctx;
  clear(hdr);
  const fresh = sessionRing(week, day, session, wib);
  while (fresh.firstChild) hdr.append(fresh.firstChild);
}

/* --------------------------------------------------------- detail sheet */
function openDetail(item, def, ctx) {
  const { wib } = ctx;
  const body = h('div', { class: 'detail' },
    h('p', { class: 'detail-why', text: def.why }),
    h('h4', { text: 'How to do it' }),
    h('ol', { class: 'cues' }, def.cues.map(c => h('li', { text: c }))),
    item.tempo ? h('p', { class: 'detail-tempo' },
      h('strong', { text: `Tempo ${item.tempo}: ` }),
      `${item.tempo.split('-')[0]} s lowering, ${item.tempo.split('-')[1]} s pause at the bottom, ${item.tempo.split('-')[2]} s driving up.`
    ) : null,
    item.rest ? h('p', { class: 'muted', text: `Rest ${item.rest} seconds between sets.` }) : null,
    historyFor(item.ex)
  );
  sheet(def.name, body, [{ label: 'Got it', kind: 'primary' }]);
}

function historyFor(exId) {
  const s = store.get();
  const rows = [];
  for (const [k, log] of Object.entries(s.logs)) {
    const [w, d] = k.split(':').map(Number);
    const hits = Object.entries(log.sets || {})
      .filter(([sk, sv]) => sk.split('|')[1] === exId && sv.done && sv.w);
    if (!hits.length) continue;
    const top = hits.reduce((a, b) => (b[1].w > a[1].w ? b : a));
    rows.push({ w, d, weight: top[1].w, reps: top[1].r, date: log.date });
  }
  rows.sort((a, b) => b.w - a.w || b.d - a.d);
  if (!rows.length) return h('p', { class: 'muted', text: 'No history for this movement yet.' });
  return h('div', { class: 'hist' },
    h('h4', { text: 'Your history (top set)' }),
    rows.slice(0, 8).map(r => h('div', { class: 'hist-row' },
      h('span', { class: 'hist-wk', text: `Wk ${r.w} ${dayLabel(r.d)}` }),
      h('span', { class: 'hist-load', text: `${r.weight} lb × ${r.reps || '?'}` }),
      r.reps ? h('span', { class: 'hist-e1', text: `e1RM ${store.e1rm(r.weight, r.reps)}` }) : null
    ))
  );
}

/* ------------------------------------------------------ metric capture */
function metricCapture(metricKey, root, nav) {
  const m = METRICS[metricKey];
  if (!m) return null;
  const latest = store.latestMetric(metricKey);
  const input = numberInput({
    placeholder: latest ? String(latest.v) : m.unit,
    class: 'num num--wide'
  });
  return h('div', { class: 'capture' },
    h('span', { class: 'capture-label', text: `Log ${m.name} (${m.unit})` }),
    input,
    h('button', {
      class: 'btn btn--sm btn--primary',
      onclick: () => {
        const v = num(input.value);
        if (v == null) { toast('Enter a number first', 'warn'); return; }
        store.logMetric(metricKey, v);
        toast(`${m.name}: ${v} ${m.unit} logged`);
        input.value = '';
      }
    }, 'Save')
  );
}

function maxCapture(ref, root, nav) {
  const m = MAX_LIFTS[ref];
  if (!m) return null;
  const cur = store.get().maxes[ref];
  const input = numberInput({ placeholder: '3RM weight', class: 'num num--wide' });
  return h('div', { class: 'capture' },
    h('span', { class: 'capture-label', text: `${m.name} 3RM → est. 1RM (now ${cur})` }),
    input,
    h('button', {
      class: 'btn btn--sm btn--primary',
      onclick: () => {
        const v = num(input.value);
        if (v == null) { toast('Enter the weight you hit for 3', 'warn'); return; }
        const est = store.e1rm(v, 3);
        store.applyMax(ref, est);
        toast(`${m.name} max set to ${est} lb. Every percentage just updated.`);
        input.value = '';
        if (root && nav) nav('today');
      }
    }, 'Set max')
  );
}

/* ---------------------------------------------------------------- finish */
function finish(week, day, root, nav) {
  store.finishSession(week, day);
  restTimer.stop();

  const stale = store.staleMaxes();
  const advanced = store.maybeAdvanceWeek();

  if (stale.length) {
    const body = h('div', null,
      h('p', { class: 'muted', text: 'Your logged sets imply you are stronger than the maxes driving your percentages. Update them so the loads keep up?' }),
      h('div', { class: 'stack-sm' },
        stale.map(st => h('div', { class: 'stalerow' },
          h('span', { text: MAX_LIFTS[st.ref]?.name || st.ref }),
          h('span', { class: 'stale-nums', text: `${st.current} → ${st.implied} lb` })
        ))
      )
    );
    sheet('Nice — time to level up', body, [
      { label: 'Not yet' },
      {
        label: 'Update maxes', kind: 'primary',
        onClick: () => {
          stale.forEach(st => store.applyMax(st.ref, st.implied));
          toast('Maxes updated. Loads recalculated.');
          nav('today');
        }
      }
    ]);
  } else {
    toast(advanced ? `Week ${week} complete. Week ${week + 1} unlocked.` : 'Session logged. Go eat.', 'ok');
  }

  if (advanced) setTarget(store.currentWeek(), null);
  render(root, nav);
}

function num(v) {
  if (v === '' || v == null) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

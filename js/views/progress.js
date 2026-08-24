import { h, clear, lineChart, barChart, ring, sparkline, numberInput, toast, sheet, fmtNum, fmtDate } from '../ui.js';
import * as store from '../store.js';
import { METRICS, MAX_LIFTS, TOTAL_WEEKS, blockForWeek } from '../data/program.js';
import { computeTargets, projectedWeight } from '../data/nutrition.js';

const KEY_LIFTS = [
  { ex: 'back_squat', ref: 'squat', name: 'Back Squat' },
  { ex: 'trap_dl', ref: 'trapbar', name: 'Trap Bar Deadlift' },
  { ex: 'bench', ref: 'bench', name: 'Bench Press' },
  { ex: 'ohp', ref: 'ohp', name: 'Overhead Press' }
];

const HERO_METRICS = ['approach', 'block', 'broad', 'agility'];

export function render(root, nav) {
  clear(root);
  const cw = store.currentWeek();
  root.style.setProperty('--accent', blockForWeek(cw).color);

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

  /* -------------------------------------------------------- headline jump */
  const approach = store.metricSeries('approach');
  const first = approach[0], last = approach[approach.length - 1];
  if (approach.length) {
    const delta = last.v - first.v;
    body.append(
      h('div', { class: 'card card--hero' },
        h('span', { class: 'hero-cap', text: 'Approach jump' }),
        h('div', { class: 'hero-row' },
          h('span', { class: 'hero-num', text: `${last.v}` }),
          h('span', { class: 'hero-unit', text: 'in' }),
          approach.length > 1 ? h('span', {
            class: `hero-delta ${delta >= 0 ? 'up' : 'down'}`,
            text: `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} since week 1`
          }) : null
        ),
        lineChart(approach.map((p, idx) => ({ x: idx, y: p.v })), { hgt: 130, yUnit: '"' })
      )
    );
  }

  /* ------------------------------------------------------- log a metric */
  body.append(logCard(root, nav));

  /* ---------------------------------------------------- performance grid */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Athletic tests' }),
      h('div', { class: 'metricgrid' },
        HERO_METRICS.map(k => metricTile(k, root, nav))
      )
    )
  );

  /* ------------------------------------------------------------ strength */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Estimated 1RM' }),
      h('p', { class: 'muted', text: 'Calculated from every set you log, so it moves without you having to test.' }),
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
              ? sparkline(series.map(p => p.v), blockForWeek(store.currentWeek()).color)
              : h('span', { class: 'spark-empty', text: '—' }),
            h('span', { class: 'liftrow-val', text: `${cur}` })
          );
        })
      )
    )
  );

  /* ----------------------------------------------------------- body comp */
  const bw = store.metricSeries('bodyweight');
  const waist = store.metricSeries('waist');
  const targets = computeTargets(store.get().profile);
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Body composition' }),
      bw.length
        ? h('div', null,
            h('div', { class: 'bc-row' },
              h('div', null,
                h('span', { class: 'bc-num', text: `${bw[bw.length - 1].v}` }),
                h('span', { class: 'bc-unit', text: 'lb' }),
                h('span', { class: 'bc-cap', text: `7-entry avg ${store.metricAvg('bodyweight', 7)} lb` })
              ),
              waist.length ? h('div', null,
                h('span', { class: 'bc-num', text: `${waist[waist.length - 1].v}` }),
                h('span', { class: 'bc-unit', text: 'in' }),
                h('span', { class: 'bc-cap', text: 'waist' })
              ) : null
            ),
            lineChart(bw.map((p, idx) => ({ x: idx, y: p.v })), { hgt: 120, target: 181, yUnit: ' lb' })
          )
        : h('p', { class: 'muted', text: 'Log your weight to see the trend. Same time, same conditions, every time.' }),
      h('p', { class: 'note-inline', text: `Projection at the current plan: about ${projectedWeight(store.get().profile.weightLb, 16, targets.deficitPerWeek)} lb by week 16, with strength holding or climbing. Weight will barely move some weeks — watch the waist and the photos instead.` })
    )
  );

  /* ------------------------------------------------------------- volume */
  const byWeek = store.tonnageByWeek();
  const weeks = Object.keys(byWeek).map(Number).sort((a, b) => a - b);
  if (weeks.length) {
    body.append(
      h('div', { class: 'card' },
        h('h2', { class: 'sect-title', text: 'Weekly tonnage' }),
        h('p', { class: 'muted', text: 'Total weight moved. Expect this to dip on deload weeks — that is the plan working.' }),
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

function stat(cap, val, sub) {
  return h('div', { class: 'stat' },
    h('span', { class: 'stat-cap', text: cap }),
    h('span', { class: 'stat-val', text: val }),
    h('span', { class: 'stat-sub', text: sub })
  );
}

function metricTile(key, root, nav) {
  const m = METRICS[key];
  const series = store.metricSeries(key);
  const last = series.length ? series[series.length - 1] : null;
  const firstV = series.length ? series[0].v : null;
  let delta = null;
  if (series.length > 1) {
    const raw = last.v - firstV;
    delta = m.better === 'lower' ? -raw : raw;
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
    delta != null ? h('span', {
      class: `mtile-delta ${delta >= 0 ? 'up' : 'down'}`,
      text: `${delta >= 0 ? '▲' : '▼'} ${Math.abs(last.v - firstV).toFixed(1)}`
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
    h('p', { class: 'muted', text: 'Approach and block jump are touch height minus your standing reach. Log the reach once, then just the difference.' })
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

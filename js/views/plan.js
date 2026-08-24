import { h, clear, ring, sheet } from '../ui.js';
import * as store from '../store.js';
import {
  BLOCKS, PHASES, TOTAL_WEEKS, weekSessions, dayLabel, weekInBlock, isDeloadWeek, isTestWeek,
  sessionMinutes, blockForWeek, TEST_DAY_A, TEST_DAY_B
} from '../data/program.js';
import { setTarget } from './today.js';

let expanded = null;

export function render(root, nav) {
  const cw = store.currentWeek();
  if (expanded == null) expanded = blockForWeek(cw).n;

  clear(root);
  const overall = store.overallProgress();
  const block = blockForWeek(cw);
  root.style.setProperty('--accent', block.color);

  root.append(
    h('header', { class: 'hdr' },
      h('div', { class: 'hdr-top' },
        h('div', null,
          h('h1', { class: 'hdr-title', text: 'Frame' }),
          h('p', { class: 'hdr-sub', text: `${TOTAL_WEEKS}-week lean-mass plan · ${overall.done} of ${overall.total} sessions logged` })
        ),
        h('div', { class: 'hdr-ring' },
          ring(overall.pct, { size: 60, stroke: 5, label: `${overall.pct}` }),
          h('span', { class: 'hdr-ring-cap', text: 'complete' })
        )
      )
    )
  );

  const body = h('div', { class: 'stack' });
  root.append(body);

  /* ------------------------------------------------------- the big idea */
  body.append(
    h('div', { class: 'card card--brief' },
      h('p', { class: 'focus', text: 'The plan in one paragraph' }),
      h('p', { class: 'brief', text: 'Six four-week blocks that take you from 190 to a lean 200. Volume builds the muscle in the first phase, load raises the ceiling in the second, and the third pushes both before a taper and a full retest. Every block loads for three weeks and unloads on the fourth. A Wednesday jump session runs the whole way through so the ten pounds you add makes you a better athlete rather than a heavier one.' })
    ),
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Three phases' }),
      h('div', { class: 'phaserow' },
        PHASES.map(ph => h('div', { class: 'phase' },
          h('span', { class: 'phase-weeks', text: `Weeks ${ph.weeks}` }),
          h('strong', { class: 'phase-name', text: ph.name }),
          h('span', { class: 'phase-detail', text: ph.detail })
        ))
      )
    )
  );

  /* ---------------------------------------------------------- the blocks */
  for (const b of BLOCKS) {
    const isOpen = expanded === b.n;
    const done = b.weeks.reduce((acc, w) => acc + store.weekProgress(w).done, 0);
    const total = b.weeks.reduce((acc, w) => acc + store.weekProgress(w).total, 0);
    const pct = total ? Math.round((done / total) * 100) : 0;

    const card = h('section', { class: `blockcard ${isOpen ? 'is-open' : ''}`, style: { '--bc': b.color } });
    card.append(
      h('button', {
        class: 'blockcard-head',
        onclick: () => { expanded = isOpen ? null : b.n; render(root, nav); }
      },
        h('span', { class: 'blockcard-n', text: String(b.n) }),
        h('span', { class: 'blockcard-titles' },
          h('span', { class: 'blockcard-name', text: b.name }),
          h('span', { class: 'blockcard-tag', text: `${b.tagline} · weeks ${b.weeks[0]}–${b.weeks[3]}` })
        ),
        h('span', { class: 'blockcard-pct' },
          h('span', { class: 'blockcard-bar' }, h('span', { class: 'blockcard-fill', style: { width: `${pct}%` } })),
          h('span', { class: 'blockcard-num', text: `${pct}%` })
        ),
        h('span', { class: 'blockcard-chev', text: isOpen ? '▾' : '▸' })
      )
    );

    if (isOpen) {
      const inner = h('div', { class: 'blockcard-body' });
      inner.append(h('p', { class: 'blockcard-goal', text: b.goal }));
      inner.append(h('p', { class: 'blockcard-detail', text: b.detail }));

      for (const w of b.weeks) {
        const wp = store.weekProgress(w);
        const wib = weekInBlock(w);
        const isCurrent = w === cw;
        const tags = [];
        if (isTestWeek(w)) tags.push(h('span', { class: 'chip chip--good', text: 'Test' }));
        else if (isDeloadWeek(w)) tags.push(h('span', { class: 'chip chip--warn', text: 'Deload' }));
        if (isCurrent) tags.push(h('span', { class: 'chip chip--now', text: 'Current' }));

        inner.append(
          h('div', { class: `weekrow ${isCurrent ? 'is-current' : ''}` },
            h('div', { class: 'weekrow-head' },
              h('span', { class: 'weekrow-n', text: `Week ${w}` }),
              tags,
              h('span', { class: 'weekrow-count', text: `${wp.done}/${wp.total}` }),
              !isCurrent ? h('button', {
                class: 'btn btn--ghost btn--xs',
                onclick: () => { store.setWeek(w); setTarget(w, null); nav('today'); }
              }, 'Jump here') : null
            ),
            h('div', { class: 'weekrow-days' },
              weekSessions(w).map(s => {
                const l = store.getLog(w, s.day);
                return h('button', {
                  class: `sesspill ${l?.done ? 'is-done' : ''} ${s.optional ? 'is-opt' : ''}`,
                  onclick: () => { store.setWeek(w); setTarget(w, s.day); nav('today'); }
                },
                  h('span', { class: 'sesspill-day', text: dayLabel(s.day) }),
                  h('span', { class: 'sesspill-name', text: s.name }),
                  h('span', { class: 'sesspill-min', text: `${sessionMinutes(s, wib)}m` })
                );
              })
            )
          )
        );
      }
      card.append(inner);
    }
    body.append(card);
  }

  /* ------------------------------------------------------- test battery */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'The test battery' }),
      h('p', { class: 'muted', text: 'Run this before week 1 to set your baseline, then again at weeks 8, 16 and 24. Same order, same conditions, every time — otherwise the numbers are noise.' }),
      h('div', { class: 'stack-sm' },
        [TEST_DAY_A, TEST_DAY_B].map(t => h('button', {
          class: 'rowbtn',
          onclick: () => { setTarget(store.currentWeek(), t.day); nav('today'); }
        },
          h('span', { class: 'rowbtn-main' },
            h('strong', { text: t.name.replace('Test Battery — ', '') }),
            h('span', { class: 'muted', text: t.focus })
          ),
          h('span', { class: 'rowbtn-chev', text: '›' })
        ))
      ),
      h('button', {
        class: 'btn btn--ghost',
        onclick: () => showBaselineGuide()
      }, 'How to run a baseline test')
    )
  );

  /* -------------------------------------------------------- principles */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Rules that make this work' }),
      h('div', { class: 'principles' },
        PRINCIPLES.map(p => h('div', { class: 'principle' },
          h('h4', { text: p.t }),
          h('p', { text: p.d })
        ))
      )
    )
  );

  body.append(h('div', { class: 'spacer' }));
}

function showBaselineGuide() {
  sheet('Running your baseline', h('div', { class: 'detail' },
    h('p', { text: 'Do this on a fresh day before you start week 1. It takes about 70 minutes across two sessions, and it is the difference between "I think I got better" and knowing exactly how much.' }),
    h('h4', { text: 'Session 1 — performance' }),
    h('ol', { class: 'cues' },
      h('li', { text: 'Measure standing reach first: flat feet, one arm up, mark the highest point you can touch. Every jump number is relative to this.' }),
      h('li', { text: 'Knee-to-wall ankle test both sides. Under 10 cm and your mobility is limiting your jump.' }),
      h('li', { text: 'Approach jump, block jump, broad jump. Three attempts each, full rest, best one counts.' }),
      h('li', { text: '5-10-5 agility, timed, two runs each direction.' }),
      h('li', { text: 'Weight, waist at the navel, and three photos in the same light and the same shorts.' })
    ),
    h('h4', { text: 'Session 2 — strength (48 hours later)' }),
    h('ol', { class: 'cues' },
      h('li', { text: 'Work up in singles and doubles to a hard-but-clean 3-rep max in the back squat.' }),
      h('li', { text: 'Same for trap bar deadlift, bench press, and overhead press.' }),
      h('li', { text: 'One all-out set of pull-ups.' }),
      h('li', { text: 'Enter each 3RM in the app and it converts to an estimated 1RM, which drives every percentage in the program.' })
    ),
    h('p', { class: 'muted', text: 'If you are not confident testing a 3RM, estimate conservatively in Settings and let the auto-progression find the real number over the first two weeks. It will.' })
  ), [{ label: 'Close', kind: 'primary' }]);
}

const PRINCIPLES = [
  { t: 'Progressive overload is the whole program', d: 'Every session, try to beat the log — one more rep, or five more pounds at the same reps. Muscle grows in response to doing more than last time, and nothing else in this plan matters as much.' },
  { t: 'Take the last set close to failure', d: 'On isolation work, the final set should have nothing left in it. On the big compounds, leave one or two reps — a missed squat costs more than the extra rep is worth.' },
  { t: 'Full range beats heavy partials', d: 'You have long limbs, which means long ranges of motion and more growth per rep. Load what you can control all the way down, not what looks impressive at the top.' },
  { t: 'Eat like it is part of training', d: 'You cannot build ten pounds of muscle out of nothing. Missing the surplus for a week undoes that week of training more thoroughly than skipping a session would.' },
  { t: 'Jumps stay in — every week', d: 'The Wednesday session is short and never gets cut. It is the difference between adding athletic weight and just getting heavier.' },
  { t: 'Deload weeks are not optional', d: 'Week 4 of each block is where the previous three weeks turn into muscle. Skipping it is how people stall in block 3 and quit in block 5.' },
  { t: 'Log every set', d: 'Beating the log is only possible if there is a log. Thirty seconds of typing is what turns this from a workout list into a program that progresses.' },
  { t: 'Drop the Pump day, never the main five', d: 'When the week gets busy or the court took a lot out of you, Saturday is what goes. The five main sessions are the program.' },
  { t: 'Sleep eight hours', d: 'In a surplus, short sleep shifts what you gain toward fat regardless of your macros. It is the cheapest anabolic available and the easiest to waste.' }
];


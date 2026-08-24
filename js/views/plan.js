import { h, clear, ring, sheet } from '../ui.js';
import * as store from '../store.js';
import {
  BLOCKS, TOTAL_WEEKS, weekSessions, dayLabel, weekInBlock, isDeloadWeek, isTestWeek,
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
          h('h1', { class: 'hdr-title', text: 'Above the Net' }),
          h('p', { class: 'hdr-sub', text: `16-week block plan · ${overall.done} of ${overall.total} sessions logged` })
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
      h('p', { class: 'brief', text: 'Four four-week blocks, each one building on the last. You start by making your tissue tolerant, then you get strong, then you teach that strength to move fast, then you sharpen it and test it. Every block loads for three weeks and unloads on the fourth, which is where the adaptation actually shows up. Week 16 re-runs the same measurements as week 0 so the progress is a number, not a feeling.' })
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
      h('p', { class: 'muted', text: 'Run this before week 1 to set your baseline, again after week 8, and again in week 16. Same order, same conditions, every time — otherwise the numbers are noise.' }),
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
  { t: 'Jumps come first, always', d: 'Plyometrics and max jumps go at the front of a session while your nervous system is fresh. A tired jump trains you to jump tired.' },
  { t: 'Quality is the rep target', d: 'On any jump or sprint, the set ends when output drops — not when you hit the prescribed number. Chasing reps on power work makes you slower.' },
  { t: 'Never skip the durability block', d: 'The five minutes of calves, tibs, adductors and cuff work at the end of each session is what keeps you on the court. It is the least fun and the most important part.' },
  { t: 'Two hard days on the court, not five', d: 'This program assumes 2-3 volleyball sessions a week. If you play more, drop the Wednesday conditioning and cut the Saturday finisher first.' },
  { t: 'Deload weeks are not optional', d: 'Week 4 of each block is where the previous three weeks actually turn into adaptation. Skipping it is how people plateau in week 9.' },
  { t: 'Log every set', d: 'The app cannot suggest loads it has never seen. Thirty seconds of logging is what turns this from a workout list into a program that progresses.' },
  { t: 'Something hurts — change it, do not push it', d: 'Sharp joint pain means swap the movement, not tough it out. Tendon soreness that fades in the warm-up is fine; pain that gets worse as you go is not.' },
  { t: 'Sleep is part of the program', d: 'Eight hours minimum. Below seven, your jump height, reaction time, and injury risk all get measurably worse and no amount of training makes up for it.' }
];

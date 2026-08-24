import { h, clear, ring, toast, sheet, numberInput } from '../ui.js';
import * as store from '../store.js';
import { computeTargets, projectedWeight, RULES, SUPPLEMENTS, MEAL_TEMPLATE } from '../data/nutrition.js';
import { blockForWeek, weekSessions, TOTAL_WEEKS } from '../data/program.js';

export function render(root, nav) {
  clear(root);
  const cw = store.currentWeek();
  root.style.setProperty('--accent', blockForWeek(cw).color);

  const profile = store.get().profile;
  const t = computeTargets(profile);
  const todayIdx = store.todayDayIndex();
  const isTrainingDay = weekSessions(cw).some(s => s.day === todayIdx && !s.optional);
  const target = isTrainingDay ? t.train : t.rest;

  root.append(
    h('header', { class: 'hdr' },
      h('div', { class: 'hdr-top' },
        h('div', null,
          h('h1', { class: 'hdr-title', text: 'Fuel' }),
          h('p', { class: 'hdr-sub', text: `${isTrainingDay ? 'Training day' : 'Rest day'} targets · recalculated from your ${profile.weightLb} lb bodyweight` })
        )
      )
    )
  );

  const body = h('div', { class: 'stack' });
  root.append(body);

  /* --------------------------------------------------------- today's numbers */
  body.append(
    h('div', { class: 'card card--hero' },
      h('span', { class: 'hero-cap', text: isTrainingDay ? "Today — training day" : 'Today — rest day' }),
      h('div', { class: 'hero-row' },
        h('span', { class: 'hero-num', text: `${target.kcal}` }),
        h('span', { class: 'hero-unit', text: 'kcal' })
      ),
      h('div', { class: 'macrogrid' },
        macro('Protein', target.protein, 'g', '#4f8ff7'),
        macro('Carbs', target.carb, 'g', '#f7a84f'),
        macro('Fat', target.fat, 'g', '#e5484d')
      ),
      h('p', { class: 'note-inline', text: isTrainingDay
        ? 'Training days sit just under maintenance so nothing about your performance suffers. Carbs stay high on purpose — a max jump is powered almost entirely by stored glycogen.'
        : 'Rest days carry the deficit. You are not fueling a session, so this is where the fat loss comes from without ever costing you a jump.' })
    )
  );

  /* ------------------------------------------------------------- both days */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'The whole week' }),
      h('div', { class: 'daycols' },
        dayCol('Training days ×5', t.train, true),
        dayCol('Rest days ×2', t.rest, false)
      ),
      h('div', { class: 'kvlist' },
        kv('Maintenance (TDEE)', `${t.tdee} kcal`),
        kv('Weekly average', `${t.weeklyAvg} kcal`),
        kv('Weekly deficit', `${t.deficitPerWeek} kcal ≈ ${(t.deficitPerWeek / 3500).toFixed(1)} lb of fat`),
        kv('Water floor', `${t.water} oz + 20–30 oz per hour on court`),
        kv('Fiber', `${t.fiber} g`),
        kv('Sodium', t.sodium)
      ),
      h('p', { class: 'note-inline', text: `At this rate you should land near ${projectedWeight(profile.weightLb, TOTAL_WEEKS, t.deficitPerWeek)} lb by week 16 — visibly leaner, same or better strength. That is deliberately slow. Faster cuts cost vertical inches.` })
    )
  );

  /* ------------------------------------------------------------ meal plan */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'A day that hits the numbers' }),
      h('p', { class: 'muted', text: 'One worked example, not a rule. Swap foods freely — just keep protein per meal and total carbs where they are.' }),
      h('div', { class: 'meals' },
        MEAL_TEMPLATE.map(m => h('div', { class: 'meal' },
          h('div', { class: 'meal-head' },
            h('strong', { text: m.when }),
            h('span', { class: 'meal-kcal', text: m.kcal })
          ),
          h('p', { class: 'meal-what', text: m.what }),
          h('span', { class: 'meal-macro', text: m.macro })
        ))
      )
    )
  );

  /* ---------------------------------------------------------------- rules */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'How to actually eat for this' }),
      h('div', { class: 'principles' },
        RULES.map(r => h('div', { class: 'principle' },
          h('h4', { text: r.t }),
          h('p', { text: r.d })
        ))
      )
    )
  );

  /* ---------------------------------------------------------- supplements */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Supplements, honestly' }),
      h('div', { class: 'stack-sm' },
        ['Worth it', 'Situational', 'Skip'].map(tier => h('div', { class: 'supptier' },
          h('span', { class: `chip chip--${tier === 'Worth it' ? 'good' : tier === 'Skip' ? 'bad' : 'warn'}`, text: tier }),
          SUPPLEMENTS.filter(s => s.tier === tier).map(s => h('div', { class: 'supp' },
            h('strong', { text: s.n }),
            h('p', { text: s.d })
          ))
        ))
      )
    )
  );

  /* ----------------------------------------------------------- calibrate */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'Recalibrate' }),
      h('p', { class: 'muted', text: 'These numbers come from your bodyweight, height, age, and how much you train. Update them and everything above recalculates.' }),
      h('button', { class: 'btn btn--ghost', onclick: () => openCalibrate(root, nav) }, 'Adjust my inputs')
    )
  );

  body.append(h('div', { class: 'spacer' }));
}

function macro(name, val, unit, color) {
  return h('div', { class: 'macro', style: { '--mc': color } },
    h('span', { class: 'macro-val' }, `${val}`, h('span', { class: 'macro-unit', text: unit })),
    h('span', { class: 'macro-name', text: name }),
    h('span', { class: 'macro-bar' })
  );
}

function dayCol(title, m, isTrain) {
  return h('div', { class: `daycol ${isTrain ? 'is-train' : ''}` },
    h('span', { class: 'daycol-title', text: title }),
    h('span', { class: 'daycol-kcal', text: `${m.kcal} kcal` }),
    h('div', { class: 'daycol-macros' },
      h('span', { text: `${m.protein}p` }),
      h('span', { text: `${m.carb}c` }),
      h('span', { text: `${m.fat}f` })
    )
  );
}

function kv(k, v) {
  return h('div', { class: 'kv' },
    h('span', { class: 'kv-k', text: k }),
    h('span', { class: 'kv-v', text: v })
  );
}

function openCalibrate(root, nav) {
  const p = store.get().profile;
  const wt = numberInput({ value: p.weightLb, class: 'num num--wide' });
  const ht = numberInput({ value: p.heightIn, class: 'num num--wide' });
  const age = numberInput({ value: p.age, class: 'num num--wide' });
  const act = h('select', { class: 'sel' },
    [
      { v: 1.55, l: 'Lifting only, mostly desk-bound' },
      { v: 1.7, l: 'Lifting 5× + volleyball 2–3× (default)' },
      { v: 1.85, l: 'Lifting 5× + volleyball 4–5×' },
      { v: 2.0, l: 'Two-a-days / tournament weeks' }
    ].map(o => h('option', { value: o.v, text: o.l, selected: Math.abs(o.v - p.activity) < 0.01 }))
  );

  sheet('Your inputs', h('div', { class: 'formstack' },
    field('Bodyweight (lb)', wt),
    field('Height (in)', ht),
    field('Age', age),
    field('Activity level', act)
  ), [
    { label: 'Cancel' },
    {
      label: 'Save', kind: 'primary',
      onClick: () => {
        store.update(s => {
          s.profile.weightLb = parseFloat(wt.value) || s.profile.weightLb;
          s.profile.heightIn = parseFloat(ht.value) || s.profile.heightIn;
          s.profile.age = parseInt(age.value, 10) || s.profile.age;
          s.profile.activity = parseFloat(act.value) || s.profile.activity;
        });
        toast('Targets recalculated');
        render(root, nav);
      }
    }
  ]);
}

function field(label, input) {
  return h('label', { class: 'field' },
    h('span', { class: 'field-label', text: label }),
    input
  );
}

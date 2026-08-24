import { h, clear, toast, sheet, numberInput } from '../ui.js';
import * as store from '../store.js';
import {
  computeTargets, projectedWeight, weeksToGoal, surplusAdvice,
  GOALS, RULES, SUPPLEMENTS, MEAL_TEMPLATE, SHAKE
} from '../data/nutrition.js';
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
          h('p', { class: 'hdr-sub', text: `${t.goalName} · ${isTrainingDay ? 'training day' : 'rest day'} · from your ${profile.weightLb} lb bodyweight` })
        )
      )
    )
  );

  const body = h('div', { class: 'stack' });
  root.append(body);

  /* ------------------------------------------------------- today's numbers */
  body.append(
    h('div', { class: 'card card--hero' },
      h('span', { class: 'hero-cap', text: isTrainingDay ? 'Today — training day' : 'Today — rest day' }),
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
        ? 'Training days carry the bigger surplus, because that is the food you can actually put to use. Most of the extra should arrive as carbs around your session.'
        : 'Rest days sit much closer to maintenance. You are not fuelling a session, so there is no reason to eat like you are.' })
    )
  );

  /* --------------------------------------------------------- the rate check */
  body.append(rateCard(t, root, nav));

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
        kv('Weekly surplus', `${t.weeklyDelta > 0 ? '+' : ''}${t.weeklyDelta} kcal ≈ ${(t.weeklyDelta / 3500).toFixed(2)} lb`),
        kv('Target rate', `${t.targetRate > 0 ? '+' : ''}${t.targetRate} lb / week`),
        kv('Water floor', `${t.water} oz + 20–30 oz per hour on court`),
        kv('Fiber', `${t.fiber} g`),
        kv('Sodium', t.sodium)
      ),
      goalProjection(profile, t)
    )
  );

  /* --------------------------------------------------------------- the shake */
  body.append(
    h('div', { class: 'card card--shake' },
      h('h2', { class: 'sect-title', text: SHAKE.name }),
      h('p', { class: 'muted', text: SHAKE.note }),
      h('ul', { class: 'shakelist' }, SHAKE.items.map(x => h('li', { text: x }))),
      h('span', { class: 'meal-macro', text: SHAKE.macro })
    )
  );

  /* ------------------------------------------------------------ meal plan */
  body.append(
    h('div', { class: 'card' },
      h('h2', { class: 'sect-title', text: 'A day that hits the numbers' }),
      h('p', { class: 'muted', text: 'One worked example on a training day, not a rule. Swap foods freely — keep the protein per feeding and the total carbs where they are.' }),
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
      h('p', { class: 'muted', text: 'Everything above is derived from your bodyweight, height, age, training load and goal. Change any of them and the whole plan recalculates.' }),
      h('button', { class: 'btn btn--ghost', onclick: () => openCalibrate(root, nav) }, 'Adjust my inputs')
    )
  );

  body.append(h('div', { class: 'spacer' }));
}

/* ----------------------------------------------------------------- pieces */

function rateCard(t, root, nav) {
  const trend = store.weightTrend(28);
  const advice = surplusAdvice(trend ? trend.perWeek : null, t.targetRate);

  return h('div', { class: `card card--advice is-${advice.tone}` },
    h('div', { class: 'advice-head' },
      h('span', { class: 'hero-cap', text: 'Am I eating the right amount?' }),
      trend ? h('span', { class: 'chip', text: `${trend.n} weigh-ins · ${trend.spanDays} days` }) : null
    ),
    h('p', { class: 'advice-line', text: advice.headline }),
    h('p', { class: 'muted', text: advice.detail }),
    advice.kcalDelta ? h('p', { class: 'note-inline', text:
      `That works out to about ${t.train.kcal + advice.kcalDelta} kcal on training days instead of ${t.train.kcal}. Adjust, hold it for two weeks, then look again.` }) : null,
    h('button', {
      class: 'btn btn--ghost btn--sm',
      onclick: () => nav('progress')
    }, 'Log a weigh-in')
  );
}

function goalProjection(profile, t) {
  const goalW = profile.goalWeight;
  if (!goalW || !t.targetRate) return null;
  const weeks = weeksToGoal(profile.weightLb, goalW, t.targetRate);
  if (weeks == null) return null;
  if (weeks === 0) {
    return h('p', { class: 'note-inline', text: `You are at your ${goalW} lb target. Switch the goal to "Maintain" to hold here, or "Lean out" to sharpen up at this weight.` });
  }
  return h('p', { class: 'note-inline', text:
    `At ${t.targetRate} lb a week, ${profile.weightLb} to ${goalW} lb is about ${weeks} weeks — roughly ${(weeks / 4.35).toFixed(1)} months. The program runs ${TOTAL_WEEKS} weeks, so it is built to land right about there.` });
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
  const gw = numberInput({ value: p.goalWeight, class: 'num num--wide' });
  const ht = numberInput({ value: p.heightIn, class: 'num num--wide' });
  const age = numberInput({ value: p.age, class: 'num num--wide' });
  const goal = h('select', { class: 'sel' },
    Object.entries(GOALS).map(([k, g]) => h('option', {
      value: k, text: `${g.name} (${g.rate > 0 ? '+' : ''}${g.rate} lb/wk)`, selected: p.goal === k
    }))
  );
  const act = h('select', { class: 'sel' },
    [
      { v: 1.55, l: 'Lifting only, mostly desk-bound' },
      { v: 1.7, l: 'Lifting 5–6× + volleyball 2–3× (default)' },
      { v: 1.85, l: 'Lifting 5–6× + volleyball 4–5×' },
      { v: 2.0, l: 'Two-a-days / tournament weeks' }
    ].map(o => h('option', { value: o.v, text: o.l, selected: Math.abs(o.v - p.activity) < 0.01 }))
  );

  sheet('Your inputs', h('div', { class: 'formstack' },
    field('Goal', goal),
    h('p', { class: 'muted', text: Object.values(GOALS).map(g => `${g.name}: ${g.blurb}`).join('\n') }),
    field('Bodyweight (lb)', wt),
    field('Target weight (lb)', gw),
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
          s.profile.goalWeight = parseFloat(gw.value) || s.profile.goalWeight;
          s.profile.heightIn = parseFloat(ht.value) || s.profile.heightIn;
          s.profile.age = parseInt(age.value, 10) || s.profile.age;
          s.profile.activity = parseFloat(act.value) || s.profile.activity;
          s.profile.goal = goal.value;
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

/**
 * "FRAME" — a 24-week lean-mass program for a 6'3" volleyball player going
 * from 190 lb to a lean 200 lb.
 *
 * Why 24 weeks: a trained lifter adds roughly 0.3-0.5 lb of mostly-lean weight
 * per week before the surplus starts turning into fat instead of muscle. Ten
 * pounds at that rate is about six months. Anything faster is mostly water,
 * glycogen and fat, and it would cost the jump we spent the last plan building.
 *
 * Structure: 6 four-week blocks (3 loading weeks, 1 deload) grouped into three
 * 8-week phases. Volume drives the first phase, load drives the second, and the
 * third pushes both before a final taper and retest in week 24.
 *
 * A Wednesday jump session runs the whole way through at maintenance dose. It
 * is not there to add inches — it is there so that carrying 10 extra pounds
 * does not cost you the explosiveness you already have.
 *
 * Prescriptions resolve per week-in-block (0..3); see `atWeek`.
 */

import { ex } from './exercises.js';

/* Percent-of-max prescriptions reference these tested lifts. */
export const MAX_LIFTS = {
  squat:   { name: 'Back Squat',        unit: 'lb' },
  trapbar: { name: 'Trap Bar Deadlift', unit: 'lb' },
  bench:   { name: 'Bench Press',       unit: 'lb' },
  ohp:     { name: 'Overhead Press',    unit: 'lb' },
  clean:   { name: 'Hang Power Clean',  unit: 'lb' }
};

export const METRICS = {
  bodyweight: { name: 'Body Weight',    unit: 'lb', better: 'higher', target: 202,
                note: 'Weigh in the same way every time: morning, after the bathroom, before food. Watch the weekly average, never a single day.' },
  waist:      { name: 'Waist (navel)',  unit: 'in', better: 'flat', target: 32,
                note: 'The single most important number on a gaining phase. If this climbs faster than your arms and chest, the surplus is too big.' },
  chest:      { name: 'Chest',          unit: 'in', better: 'higher' },
  arm:        { name: 'Arm (flexed)',   unit: 'in', better: 'higher' },
  thigh:      { name: 'Thigh',          unit: 'in', better: 'higher' },
  reach:      { name: 'Standing Reach', unit: 'in', better: 'flat' },
  approach:   { name: 'Approach Jump',  unit: 'in', better: 'higher',
                note: 'Touch height minus standing reach. Holding this steady while you add 10 lb is a win; gaining is a bonus.' },
  block:      { name: 'Block Jump',     unit: 'in', better: 'higher' },
  broad:      { name: 'Broad Jump',     unit: 'in', better: 'higher' },
  agility:    { name: '5-10-5 Agility', unit: 's',  better: 'lower' },
  pullups:    { name: 'Max Pull-Ups',   unit: 'reps', better: 'higher',
                note: 'Expect this to dip slightly as you gain weight. If it holds, the weight you added is muscle.' },
  ankle:      { name: 'Ankle (knee-to-wall)', unit: 'cm', better: 'higher', target: 10 }
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* Shorthand builders ------------------------------------------------------ */
const S = (name, notes, items) => ({ name, notes, items });
const i = (exId, o = {}) => ({ ex: exId, ...o });

/* ------------------------------------------------------- shared sections */
const PREP_LOWER = S('Movement Prep', '8 minutes. Cheap, and it is what lets you load deep ranges safely.', [
  i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
  i('ankle_rock', { sets: 2, reps: '8 ea side' }),
  i('hip_90_90', { sets: 1, reps: '10 switches' }),
  i('world_greatest', { sets: 1, reps: '5 ea side' }),
  i('pogo_prep', { sets: 2, reps: '15 contacts' })
]);

const PREP_UPPER = S('Movement Prep', '6 minutes. Shoulder prep is the price of admission for a hitter.', [
  i('cat_cow', { sets: 1, reps: '8 + 5 ea side' }),
  i('scap_pushup', { sets: 2, reps: '10' }),
  i('band_pullapart', { sets: 2, reps: '15' }),
  i('wall_slide', { sets: 2, reps: '10' })
]);

const PREP_JUMP = S('Movement Prep', 'Be genuinely warm before you jump. 10 minutes minimum.', [
  i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
  i('world_greatest', { sets: 1, reps: '5 ea side' }),
  i('ankle_rock', { sets: 2, reps: '8 ea side' }),
  i('adductor_rock', { sets: 1, reps: '8 ea side' }),
  i('pogo_prep', { sets: 2, reps: '20 contacts' }),
  i('snap_down', { sets: 2, reps: '5' })
]);

const ARMOR_SHOULDER = S('Shoulder Armor', '5 minutes, every upper day. This is what keeps you swinging at 40.', [
  i('facepull', { sets: 3, reps: '15', rpe: 6, rest: 45 }),
  i('ext_rotation', { sets: 2, reps: '12 ea', rpe: 6, rest: 45, note: 'Light. 3 seconds on the way down.' }),
  i('prone_ytw', { sets: 2, reps: '5 of each letter', rpe: 6, rest: 45 })
]);

const NECK = i('neck_iso', { sets: 1, reps: '10 s x 4 directions' });

/* ========================================================================
   LOADING SCHEMES — one per block, resolved by role.
   ===================================================================== */
const SCHEMES = {
  1: {
    label: 'Technique and volume tolerance',
    primary:   { sets: [3, 4, 4, 2], reps: '8-10',  rpe: [7, 7.5, 8, 6],     rest: 180 },
    secondary: { sets: [3, 3, 4, 2], reps: '10-12', rpe: [7, 8, 8, 6],       rest: 120 },
    accessory: { sets: [2, 3, 3, 2], reps: '12',    rpe: [8, 8, 8.5, 6],     rest: 90 },
    isolation: { sets: [2, 3, 3, 2], reps: '12-15', rpe: [8, 9, 9, 7],       rest: 60 },
    calf:      { sets: [3, 4, 4, 2], reps: '12-15', rpe: [8, 8.5, 9, 7],     rest: 60 },
    core:      { sets: [2, 3, 3, 2], reps: '12',    rpe: [8, 8, 8.5, 6],     rest: 60 },
    plyo:      { sets: [2, 3, 3, 2], reps: '3',                              rest: 90 }
  },
  2: {
    label: 'Peak volume — the most sets you will do',
    primary:   { sets: [4, 4, 5, 2], reps: '8-10',  rpe: [8, 8, 8.5, 6],     rest: 180 },
    secondary: { sets: [4, 4, 4, 2], reps: '10-12', rpe: [8, 8.5, 9, 6],     rest: 120 },
    accessory: { sets: [3, 3, 4, 2], reps: '12-15', rpe: [8.5, 9, 9, 6],     rest: 75 },
    isolation: { sets: [3, 3, 4, 2], reps: '15',    rpe: [9, 9, 9.5, 7],     rest: 50 },
    calf:      { sets: [4, 4, 5, 2], reps: '12-15', rpe: [8.5, 9, 9, 7],     rest: 60 },
    core:      { sets: [3, 3, 4, 2], reps: '12-15', rpe: [8.5, 9, 9, 6],     rest: 55 },
    plyo:      { sets: [2, 3, 3, 2], reps: '3',                              rest: 90 }
  },
  3: {
    label: 'Heavier — strength drives the next growth phase',
    primary:   { sets: [4, 4, 5, 2], reps: [5, 5, 4, 5], pct: [0.78, 0.82, 0.86, 0.70], rpe: [8, 8.5, 9, 6], rest: 210 },
    secondary: { sets: [3, 4, 4, 2], reps: '8',     rpe: [8, 8.5, 9, 6],     rest: 150 },
    accessory: { sets: [3, 3, 3, 2], reps: '10-12', rpe: [8, 8.5, 9, 6],     rest: 90 },
    isolation: { sets: [3, 3, 3, 2], reps: '12-15', rpe: [8.5, 9, 9, 7],     rest: 60 },
    calf:      { sets: [3, 4, 4, 2], reps: '10-12', rpe: [8.5, 9, 9, 7],     rest: 75 },
    core:      { sets: [3, 3, 3, 2], reps: '12',    rpe: [8, 8.5, 9, 6],     rest: 60 },
    plyo:      { sets: [3, 3, 3, 2], reps: '3',                              rest: 100 }
  },
  4: {
    label: 'Volume again, at the loads you just built',
    primary:   { sets: [4, 4, 5, 2], reps: '6-8',   pct: [0.72, 0.76, 0.80, 0.65], rpe: [8, 8.5, 9, 6], rest: 195 },
    secondary: { sets: [4, 4, 4, 2], reps: '10',    rpe: [8, 8.5, 9, 6],     rest: 135 },
    accessory: { sets: [3, 4, 4, 2], reps: '12',    rpe: [8.5, 9, 9, 6],     rest: 80 },
    isolation: { sets: [3, 3, 4, 2], reps: '15',    rpe: [9, 9, 9.5, 7],     rest: 55 },
    calf:      { sets: [4, 4, 5, 2], reps: '12-15', rpe: [9, 9, 9.5, 7],     rest: 60 },
    core:      { sets: [3, 3, 4, 2], reps: '12-15', rpe: [8.5, 9, 9, 6],     rest: 55 },
    plyo:      { sets: [2, 3, 3, 2], reps: '3',                              rest: 90 }
  },
  5: {
    label: 'Dense — shorter rests, harder finishes',
    primary:   { sets: [4, 5, 5, 2], reps: '6-8',   pct: [0.75, 0.79, 0.83, 0.68], rpe: [8.5, 9, 9, 6], rest: 195 },
    secondary: { sets: [4, 4, 5, 2], reps: '8-10',  rpe: [8.5, 9, 9, 6],     rest: 120 },
    accessory: { sets: [3, 4, 4, 2], reps: '12-15', rpe: [9, 9, 9.5, 6],     rest: 60 },
    isolation: { sets: [3, 4, 4, 2], reps: '15-20', rpe: [9, 9.5, 10, 7],    rest: 45 },
    calf:      { sets: [4, 4, 5, 2], reps: '15',    rpe: [9, 9.5, 10, 7],    rest: 50 },
    core:      { sets: [3, 4, 4, 2], reps: '15',    rpe: [9, 9, 9.5, 6],     rest: 50 },
    plyo:      { sets: [2, 3, 3, 2], reps: '3',                              rest: 90 }
  },
  6: {
    label: 'Consolidate — prove the new mass is strong, then taper',
    primary:   { sets: [4, 4, 3, 2], reps: [4, 4, 3, 5], pct: [0.85, 0.88, 0.90, 0.70], rpe: [9, 9, 9, 6], rest: 240 },
    secondary: { sets: [3, 4, 3, 2], reps: '6-8',   rpe: [8.5, 9, 8.5, 6],   rest: 150 },
    accessory: { sets: [3, 3, 3, 2], reps: '10-12', rpe: [8.5, 9, 8.5, 6],   rest: 90 },
    isolation: { sets: [2, 3, 2, 2], reps: '12-15', rpe: [8.5, 9, 8.5, 7],   rest: 60 },
    calf:      { sets: [3, 4, 3, 2], reps: '12',    rpe: [9, 9, 9, 7],       rest: 70 },
    core:      { sets: [2, 3, 2, 2], reps: '12',    rpe: [8, 8.5, 8, 6],     rest: 60 },
    plyo:      { sets: [3, 3, 2, 2], reps: '2-3',                            rest: 110 }
  }
};

/**
 * Resolve one template item against a block's scheme.
 * Percentage loading is only applied when the movement actually references a
 * tested max; everything else falls back to autoregulated RPE.
 */
function resolve(item, scheme) {
  const role = item.role;
  if (!role) return { ...item };
  const r = scheme[role];
  if (!r) throw new Error(`Unknown role "${role}" for ${item.ex}`);

  const out = { ex: item.ex, sets: r.sets, reps: r.reps, rest: r.rest };
  const usesPct = r.pct && !!ex(item.ex).ref;
  if (usesPct) out.pct = r.pct;
  else if (r.rpe) out.rpe = r.rpe;

  // Template overrides always win.
  for (const [k, v] of Object.entries(item)) {
    if (k === 'role' || k === 'ex') continue;
    out[k] = v;
  }
  if (out.pct && out.rpe) delete out.rpe;
  return out;
}

function buildSession(tpl, scheme) {
  return {
    ...tpl,
    sections: tpl.sections.map(sec => ({
      name: sec.name,
      notes: sec.notes,
      items: sec.items.map(it => resolve(it, scheme))
    }))
  };
}

/* ========================================================================
   PHASE 1 — weeks 1-8 · Build the base
   ===================================================================== */
const P1 = [
  {
    id: 'p1-lowerA', day: 0, name: 'Lower — Squat Focus',
    focus: 'Squat, leg press, and enough quad volume to actually change the shape of your legs.',
    brief: 'Legs respond to volume more than almost anything else, and yours have the most room to grow. Full range on everything — depth is where the growth is, and the leg press exists so you can chase it without your lower back becoming the limit.',
    sections: [
      PREP_LOWER,
      S('Spring Maintenance', 'Two minutes. Keeps your ankles springy while the rest of the week gets heavy.', [
        i('pogo', { role: 'plyo', reps: '12 contacts' }),
        i('box_jump', { role: 'plyo', note: 'Step down every rep. This is upkeep, not a workout.' })
      ]),
      S('Main Lift', null, [
        i('back_squat', { role: 'primary', note: 'Two reps in reserve on every set this block. Learn the groove before you chase load.' })
      ]),
      S('Volume', null, [
        i('leg_press', { role: 'secondary', note: 'Deep, controlled, no bouncing out of the bottom.' }),
        i('bulgarian', { role: 'accessory', reps: '10-12 ea', note: 'The side that feels harder gets one extra set.' })
      ]),
      S('Isolation', null, [
        i('leg_ext', { role: 'isolation', note: 'Squeeze the top for a beat. Last set, take it to failure.' })
      ]),
      S('Calves', 'Grown with slow reps and full stretch, never bouncing.', [
        i('calf_raise', { role: 'calf', tempo: '3-1-1' })
      ]),
      S('Core', null, [
        i('hanging_leg_raise', { role: 'core' })
      ]),
      S('Durability Block', null, [
        i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 }),
        i('copenhagen', { sets: 2, reps: '25 s ea side', rest: 45 }),
        NECK
      ])
    ]
  },
  {
    id: 'p1-upperA', day: 1, name: 'Upper — Push Focus',
    focus: 'Incline pressing, dumbbells, and side delts. The width half of looking bigger.',
    brief: 'Broad shoulders read as size far more than a big chest does, so side delts get trained hard every push day. Press with your shoulder blades set, and stop lowering when you feel a stretch rather than when the bar hits you.',
    sections: [
      PREP_UPPER,
      S('Main Lift', null, [
        i('incline_bb_press', { role: 'primary' })
      ]),
      S('Volume', null, [
        i('db_flat_press', { role: 'secondary' }),
        i('db_ohp', { role: 'accessory' })
      ]),
      S('Isolation', null, [
        i('lat_raise', { role: 'isolation', note: 'Lead with the elbow. Go lighter than your ego wants.' }),
        i('cable_fly', { role: 'isolation' }),
        i('pushdown', { role: 'isolation' })
      ]),
      ARMOR_SHOULDER
    ]
  },
  {
    id: 'p1-jump', day: 2, name: 'Jump & Move',
    focus: 'Keeping your vertical and your court speed while the scale goes up.',
    brief: 'Short session, and the most important one for making sure you gain the right kind of weight. Ten extra pounds of muscle should make you jump higher; ten pounds of anything else will make you slower. This day is how you tell the difference — and it stays in the plan all 24 weeks.',
    sections: [
      PREP_JUMP,
      S('Max Jumps', 'Fresh and maximal. Stop the moment height drops off.', [
        i('approach_jump', { role: 'plyo', sets: [4, 4, 5, 3], reps: '2', rest: 120, note: 'Full game approach against a real target. Log your best in Progress.' }),
        i('broad_jump', { role: 'plyo', rest: 100 })
      ]),
      S('Power', null, [
        i('med_scoop_toss', { sets: 3, reps: '5', rest: 75 }),
        i('med_rot_throw', { sets: 3, reps: '4 ea side', rest: 75 })
      ]),
      S('Court Movement', null, [
        i('approach_footwork', { sets: 3, reps: '5 approaches', rest: 60 }),
        i('lateral_shuffle', { sets: 3, reps: '2 x 5 m + cut', rest: 60 })
      ]),
      S('Aerobic', 'Deliberately short — on a gaining phase, cardio you do not need is just calories you have to eat back.', [
        i('zone2', { sets: 1, reps: '15-20 min', note: 'Bike or row. Easy enough to hold a conversation.' })
      ]),
      S('Durability Block', null, [
        i('nordic', { sets: 2, reps: '5', rest: 75, note: 'Never skip these. Hamstring strains end seasons.' }),
        i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 }),
        i('copenhagen', { sets: 2, reps: '25 s ea side', rest: 45 })
      ])
    ]
  },
  {
    id: 'p1-lowerB', day: 3, name: 'Lower — Hinge Focus',
    focus: 'Hamstrings and glutes, loaded both long and short.',
    brief: 'Hamstrings have two jobs — extending the hip and bending the knee — and you need to train both. RDLs cover the first, leg curls the second. This is also the session that keeps you off the injury list, so Nordics are non-negotiable.',
    sections: [
      S('Movement Prep', null, [
        i('hip_90_90', { sets: 1, reps: '10 switches' }),
        i('ankle_rock', { sets: 2, reps: '8 ea side' }),
        i('bird_dog', { sets: 2, reps: '6 ea side' }),
        i('adductor_rock', { sets: 1, reps: '8 ea side' })
      ]),
      S('Main Lift', null, [
        i('rdl', { role: 'primary', note: 'Stop when the hamstrings run out of length, not when your back rounds.' })
      ]),
      S('Volume', null, [
        i('hip_thrust', { role: 'secondary', note: 'One second of hard glute squeeze at the top of every rep.' }),
        i('seated_leg_curl', { role: 'accessory', note: 'The best hamstring size builder there is. Slow negatives.' })
      ]),
      S('Isolation', null, [
        i('back_ext', { role: 'isolation', note: 'Hug a plate once bodyweight is easy.' })
      ]),
      S('Calves', null, [
        i('seated_calf', { role: 'calf', tempo: '3-1-1', note: 'Bent knee biases the soleus, which is most of your calf.' })
      ]),
      S('Core', null, [
        i('ab_wheel', { role: 'core', reps: '10' })
      ]),
      S('Durability Block', null, [
        i('nordic', { sets: 3, reps: '5', rest: 90 }),
        i('copenhagen', { sets: 2, reps: '25 s ea side', rest: 45 })
      ])
    ]
  },
  {
    id: 'p1-upperB', day: 4, name: 'Upper — Pull Focus',
    focus: 'Lats, mid-back, rear delts and arms.',
    brief: 'A wide back is what makes a 200 lb frame look athletic instead of just heavy. Pull with your elbows rather than your hands, and let your shoulder blades move fully at the top of every rep — the stretch matters as much as the squeeze.',
    sections: [
      PREP_UPPER,
      S('Main Lift', null, [
        i('pullup', { role: 'primary', reps: 'AMRAP -2', note: 'Add load with a belt once you clear 10 clean reps.' })
      ]),
      S('Volume', null, [
        i('chest_supported_row', { role: 'secondary', note: 'Chest stays on the pad. No cheating with the low back.' }),
        i('lat_pulldown', { role: 'accessory', note: 'Full stretch overhead at the top of every rep.' })
      ]),
      S('Isolation', null, [
        i('rear_delt_fly', { role: 'isolation' }),
        i('curl', { role: 'isolation', note: 'Arms behind the body — full biceps stretch.' }),
        i('hammer_curl', { role: 'isolation' })
      ]),
      ARMOR_SHOULDER
    ]
  },
  {
    id: 'p1-pump', day: 5, name: 'Pump & Patch',
    focus: 'Arms, delts, calves, core. High reps, low cost.',
    brief: 'The session to drop first if life gets busy or the court took a lot out of you — nothing here is load-bearing for the program. But it is free growth in the places that show, and it barely dents your recovery.',
    optional: true,
    sections: [
      S('Movement Prep', null, [
        i('band_pullapart', { sets: 2, reps: '20' }),
        i('scap_pushup', { sets: 2, reps: '12' })
      ]),
      S('Delts', 'Chase the burn here, not the weight.', [
        i('lat_raise', { role: 'isolation', reps: '15-20' }),
        i('rear_delt_fly', { role: 'isolation', reps: '15-20' }),
        i('shrug', { role: 'isolation' })
      ]),
      S('Arms', 'Superset the curl and the triceps movement to save time.', [
        i('cable_curl', { role: 'isolation' }),
        i('skullcrusher', { role: 'isolation' })
      ]),
      S('Calves', null, [
        i('calf_raise', { role: 'calf', tempo: '2-2-1' })
      ]),
      S('Core', null, [
        i('cable_crunch', { role: 'core' }),
        i('side_plank', { sets: 2, reps: '10 reach-throughs ea', rest: 45 })
      ]),
      S('Durability Block', null, [
        i('ext_rotation', { sets: 2, reps: '15 ea', rpe: 6, rest: 45 }),
        i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 }),
        NECK
      ])
    ]
  }
];

/* ========================================================================
   PHASE 2 — weeks 9-16 · Add the load
   ===================================================================== */
const P2 = [
  {
    id: 'p2-lowerA', day: 0, name: 'Lower — Heavy Squat',
    focus: 'Real weight on the bar, then machine volume behind it.',
    brief: 'Percentages arrive this phase. Getting stronger in the squat is what raises the ceiling on every set of leg work you do afterwards — a leg press you can load with 100 more pounds is a bigger leg press.',
    sections: [
      PREP_LOWER,
      S('Spring Maintenance', null, [
        i('pogo', { role: 'plyo', reps: '12 contacts' }),
        i('depth_drop', { role: 'plyo', reps: '4', note: 'Box 18-24". Step off, land silently, freeze 2 s.' })
      ]),
      S('Main Lift', null, [
        i('back_squat', { role: 'primary' })
      ]),
      S('Volume', null, [
        i('hack_squat', { role: 'secondary', note: 'No hack squat? Leg press with your feet low on the platform.' }),
        i('walking_lunge', { role: 'accessory', reps: '10 ea leg' })
      ]),
      S('Isolation', null, [
        i('leg_ext', { role: 'isolation' })
      ]),
      S('Calves', null, [
        i('calf_raise', { role: 'calf', tempo: '2-2-1' })
      ]),
      S('Core', null, [
        i('hanging_leg_raise', { role: 'core' })
      ]),
      S('Durability Block', null, [
        i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
        i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 }),
        NECK
      ])
    ]
  },
  {
    id: 'p2-upperA', day: 1, name: 'Upper — Heavy Push',
    focus: 'Bench press at percentage, dips, and delts.',
    brief: 'Flat bench takes over as the primary so you have a hard strength number to chase. Keep the incline and fly work — pressing strength builds the chest, but the stretched positions are what fill it out.',
    sections: [
      PREP_UPPER,
      S('Main Lift', null, [
        i('bench', { role: 'primary' })
      ]),
      S('Volume', null, [
        i('db_incline', { role: 'secondary' }),
        i('dip', { role: 'accessory', note: 'Add a belt once you can do 12 clean bodyweight reps.' })
      ]),
      S('Isolation', null, [
        i('lat_raise', { role: 'isolation' }),
        i('skullcrusher', { role: 'isolation' }),
        i('cable_fly', { role: 'isolation' })
      ]),
      ARMOR_SHOULDER
    ]
  },
  {
    id: 'p2-jump', day: 2, name: 'Jump & Move',
    focus: 'Loaded jumps and reactive work at maintenance dose.',
    brief: 'Same job as phase 1 — protect the athlete while the bodybuilder does his work. Trap bar jumps enter because a heavier you needs to learn to move the new weight fast.',
    sections: [
      PREP_JUMP,
      S('Max Jumps', 'Quality only. The set ends when height drops.', [
        i('approach_jump', { role: 'plyo', sets: [4, 5, 5, 3], reps: '2', rest: 120 }),
        i('block_jump', { role: 'plyo', rest: 100 })
      ]),
      S('Loaded Power', null, [
        i('trap_jump', { role: 'plyo', pct: [0.24, 0.26, 0.28, 0.20], rest: 110, note: 'Reset on the floor between reps.' }),
        i('med_slam', { sets: 3, reps: '5', rest: 75 })
      ]),
      S('Court Movement', null, [
        i('approach_footwork', { sets: 3, reps: '5 approaches', rest: 60 }),
        i('pro_agility', { sets: 2, reps: '1 timed run', rest: 150, note: 'Log the time. It should not get worse as you gain.' })
      ]),
      S('Aerobic', null, [
        i('zone2', { sets: 1, reps: '15-20 min' })
      ]),
      S('Durability Block', null, [
        i('nordic', { sets: 2, reps: '5', rest: 75 }),
        i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
        i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 })
      ])
    ]
  },
  {
    id: 'p2-lowerB', day: 3, name: 'Lower — Heavy Hinge',
    focus: 'Trap bar deadlift at percentage, then hamstring volume.',
    brief: 'Heaviest pulling of the program. Brace hard, keep the lats tight, and end the set the moment your back position changes — no rep is worth a tweaked back on a gaining phase.',
    sections: [
      S('Movement Prep', null, [
        i('hip_90_90', { sets: 1, reps: '10 switches' }),
        i('ankle_rock', { sets: 2, reps: '8 ea side' }),
        i('bird_dog', { sets: 2, reps: '6 ea side' }),
        i('med_scoop_toss', { sets: 2, reps: '5', note: 'Primer — wakes up the hinge before you load it.' })
      ]),
      S('Main Lift', null, [
        i('trap_dl', { role: 'primary' })
      ]),
      S('Volume', null, [
        i('rdl', { role: 'secondary' }),
        i('seated_leg_curl', { role: 'accessory' })
      ]),
      S('Isolation', null, [
        i('back_ext', { role: 'isolation' })
      ]),
      S('Calves', null, [
        i('seated_calf', { role: 'calf', tempo: '2-2-1' })
      ]),
      S('Core', null, [
        i('cable_crunch', { role: 'core' })
      ]),
      S('Durability Block', null, [
        i('nordic', { sets: 3, reps: '6', rest: 90 }),
        i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 })
      ])
    ]
  },
  {
    id: 'p2-upperB', day: 4, name: 'Upper — Heavy Pull',
    focus: 'Weighted pull-ups, barbell rows, and thicker arms.',
    brief: 'Weighted pull-ups are the best single indicator of an athlete who is both strong and lean, and they get harder as you gain — which is exactly why they stay the primary. If your weighted pull-up climbs while the scale climbs, everything is working.',
    sections: [
      PREP_UPPER,
      S('Main Lift', null, [
        i('pullup', { role: 'primary', reps: '5-6', note: 'Weighted. Belt or vest.' })
      ]),
      S('Volume', null, [
        i('bb_row', { role: 'secondary', note: 'Torso does not move. No body english.' }),
        i('lat_pulldown', { role: 'accessory' })
      ]),
      S('Isolation', null, [
        i('pullover', { role: 'isolation', note: 'Lats only. This is what builds width.' }),
        i('preacher_curl', { role: 'isolation' }),
        i('hammer_curl', { role: 'isolation' })
      ]),
      ARMOR_SHOULDER
    ]
  },
  {
    id: 'p2-pump', day: 5, name: 'Pump & Patch',
    focus: 'Arms, delts, calves, core.',
    brief: 'Optional, cheap, and where the visible details get built. Drop it without guilt on a heavy volleyball week.',
    optional: true,
    sections: [
      S('Movement Prep', null, [
        i('band_pullapart', { sets: 2, reps: '20' }),
        i('scap_pushup', { sets: 2, reps: '12' })
      ]),
      S('Delts', null, [
        i('lat_raise', { role: 'isolation', reps: '15-20' }),
        i('rear_delt_fly', { role: 'isolation', reps: '15-20' }),
        i('shrug', { role: 'isolation' })
      ]),
      S('Arms', 'Superset these.', [
        i('close_grip_bench', { role: 'accessory', reps: '10-12' }),
        i('cable_curl', { role: 'isolation' }),
        i('pushdown', { role: 'isolation' })
      ]),
      S('Calves', null, [
        i('calf_raise', { role: 'calf', tempo: '2-2-1' })
      ]),
      S('Core', null, [
        i('pallof', { role: 'core', reps: '10 ea side' }),
        i('side_plank', { sets: 2, reps: '10 reach-throughs ea', rest: 45 })
      ]),
      S('Durability Block', null, [
        i('ext_rotation', { sets: 2, reps: '15 ea', rpe: 6, rest: 45 }),
        i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
        NECK
      ])
    ]
  }
];

/* ========================================================================
   PHASE 3 — weeks 17-24 · Fill the frame
   ===================================================================== */
const P3 = [
  {
    id: 'p3-lowerA', day: 0, name: 'Lower — Squat Density',
    focus: 'Heavy squats, paused squats, and leg press taken past comfortable.',
    brief: 'Last phase, and the one where the legs actually look different. Pause squats kill the bounce so the muscle does all the work. On the leg press, the final set gets a myo-rep finish: go to failure, rest 15 seconds, grab 3-5 more, repeat twice.',
    sections: [
      PREP_LOWER,
      S('Spring Maintenance', null, [
        i('pogo', { role: 'plyo', reps: '12 contacts' }),
        i('box_jump', { role: 'plyo' })
      ]),
      S('Main Lift', null, [
        i('back_squat', { role: 'primary' })
      ]),
      S('Volume', null, [
        i('pause_squat', { role: 'secondary', pct: [0.62, 0.65, 0.68, 0.55], note: 'Full 2-second dead stop at the bottom. Stay braced.' }),
        i('leg_press', { role: 'accessory', note: 'Last set: myo-reps. Failure, rest 15 s, 3-5 more, twice.' })
      ]),
      S('Isolation', null, [
        i('leg_ext', { role: 'isolation', note: 'Last set: drop the weight 30% and go again to failure.' })
      ]),
      S('Calves', null, [
        i('calf_raise', { role: 'calf', tempo: '2-2-1' })
      ]),
      S('Core', null, [
        i('cable_crunch', { role: 'core' })
      ]),
      S('Durability Block', null, [
        i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
        i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 }),
        NECK
      ])
    ]
  },
  {
    id: 'p3-upperA', day: 1, name: 'Upper — Push Density',
    focus: 'Incline barbell, dumbbells, and everything taken close to failure.',
    brief: 'Rests get shorter on the accessories and the last set of each isolation movement gets a drop set. This is the highest-effort push work of the program — it should be uncomfortable, and it should be over in 70 minutes.',
    sections: [
      PREP_UPPER,
      S('Main Lift', null, [
        i('incline_bb_press', { role: 'primary' })
      ]),
      S('Volume', null, [
        i('db_flat_press', { role: 'secondary' }),
        i('dip', { role: 'accessory', note: 'Weighted. Last set to failure.' })
      ]),
      S('Isolation', null, [
        i('lat_raise', { role: 'isolation', note: 'Last set: drop 30% and go again.' }),
        i('cable_fly', { role: 'isolation', note: 'Hold the stretch a beat on every rep.' }),
        i('pushdown', { role: 'isolation', note: 'Last set: drop 30% and go again.' })
      ]),
      ARMOR_SHOULDER
    ]
  },
  {
    id: 'p3-jump', day: 2, name: 'Jump & Move',
    focus: 'Proving the new weight still moves fast.',
    brief: 'By now you are carrying most of the 10 pounds. This is where you find out it was the right kind — your approach jump should be at least where it started, and your 5-10-5 should not have slipped. Keep the volume low and the intent maximal.',
    sections: [
      PREP_JUMP,
      S('Max Jumps', null, [
        i('approach_jump', { role: 'plyo', sets: [5, 5, 4, 3], reps: '2', rest: 130, note: 'Log the best touch. This is the number that matters.' }),
        i('block_jump', { role: 'plyo', rest: 110 })
      ]),
      S('Reactive', 'Low volume, high quality. Ground contact should sound like one sound.', [
        i('depth_jump', { role: 'plyo', rest: 120 }),
        i('trap_jump', { role: 'plyo', pct: [0.26, 0.28, 0.30, 0.22], rest: 110 })
      ]),
      S('Court Movement', null, [
        i('approach_footwork', { sets: 3, reps: '5 approaches', rest: 60 }),
        i('pro_agility', { sets: 2, reps: '1 timed run', rest: 150 })
      ]),
      S('Aerobic', null, [
        i('zone2', { sets: 1, reps: '15-20 min' })
      ]),
      S('Durability Block', null, [
        i('nordic', { sets: 2, reps: '5', rest: 75 }),
        i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
        i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 })
      ])
    ]
  },
  {
    id: 'p3-lowerB', day: 3, name: 'Lower — Hinge Density',
    focus: 'Trap bar, RDLs, and hamstrings from both ends.',
    brief: 'Both leg curl variations appear together this phase — seated for the long-length stretch, lying for the short. It is more hamstring work than feels reasonable, and it is why they will actually grow.',
    sections: [
      S('Movement Prep', null, [
        i('hip_90_90', { sets: 1, reps: '10 switches' }),
        i('ankle_rock', { sets: 2, reps: '8 ea side' }),
        i('bird_dog', { sets: 2, reps: '6 ea side' }),
        i('med_scoop_toss', { sets: 2, reps: '5' })
      ]),
      S('Main Lift', null, [
        i('trap_dl', { role: 'primary' })
      ]),
      S('Volume', null, [
        i('rdl', { role: 'secondary' }),
        i('seated_leg_curl', { role: 'accessory', note: 'Last set: drop 30% and go again to failure.' })
      ]),
      S('Isolation', null, [
        i('lying_leg_curl', { role: 'isolation' }),
        i('hip_thrust', { role: 'isolation', reps: '12' })
      ]),
      S('Calves', null, [
        i('seated_calf', { role: 'calf', tempo: '2-2-1' })
      ]),
      S('Core', null, [
        i('ab_wheel', { role: 'core', reps: '10-12' })
      ]),
      S('Durability Block', null, [
        i('nordic', { sets: 3, reps: '6', rest: 90 }),
        i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 })
      ])
    ]
  },
  {
    id: 'p3-upperB', day: 4, name: 'Upper — Pull Density',
    focus: 'Pull-ups, cable rows, and arms taken to failure.',
    brief: 'Cable rows replace the barbell so you can keep constant tension and push closer to failure without your low back being the thing that gives out first. Full stretch at the front of every rep.',
    sections: [
      PREP_UPPER,
      S('Main Lift', null, [
        i('pullup', { role: 'primary', reps: '5-6', note: 'Weighted.' })
      ]),
      S('Volume', null, [
        i('cable_row', { role: 'secondary', note: 'Let the blades spread fully on the way out.' }),
        i('lat_pulldown', { role: 'accessory', note: 'Last set: drop 30% and go again.' })
      ]),
      S('Isolation', null, [
        i('rear_delt_fly', { role: 'isolation' }),
        i('preacher_curl', { role: 'isolation' }),
        i('cable_curl', { role: 'isolation', note: 'Last set: drop 30% and go again.' })
      ]),
      ARMOR_SHOULDER
    ]
  },
  {
    id: 'p3-pump', day: 5, name: 'Pump & Patch',
    focus: 'Arms, delts, calves, core — the finishing details.',
    brief: 'Optional. By this phase it is mostly about the parts that show in a t-shirt.',
    optional: true,
    sections: [
      S('Movement Prep', null, [
        i('band_pullapart', { sets: 2, reps: '20' }),
        i('scap_pushup', { sets: 2, reps: '12' })
      ]),
      S('Delts', null, [
        i('lat_raise', { role: 'isolation', reps: '15-20' }),
        i('rear_delt_fly', { role: 'isolation', reps: '15-20' }),
        i('shrug', { role: 'isolation' })
      ]),
      S('Arms', 'Superset. Chase the pump.', [
        i('hammer_curl', { role: 'isolation' }),
        i('skullcrusher', { role: 'isolation' }),
        i('pushdown', { role: 'isolation', reps: '20' })
      ]),
      S('Calves', null, [
        i('seated_calf', { role: 'calf', tempo: '2-2-1' })
      ]),
      S('Core', null, [
        i('cable_crunch', { role: 'core' }),
        i('pallof', { role: 'core', reps: '10 ea side' })
      ]),
      S('Durability Block', null, [
        i('ext_rotation', { sets: 2, reps: '15 ea', rpe: 6, rest: 45 }),
        i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
        NECK
      ])
    ]
  }
];

/* ---------------------------------------------------------- RECOVERY DAY */
export const RECOVERY_DAY = {
  id: 'recovery', day: 6, name: 'Recovery Flow',
  focus: 'Move, breathe, eat, sleep. Growth happens here, not in the gym.',
  brief: 'You are training six days and eating in a surplus. The limiting factor on how much muscle you actually build is how well you recover, and this is the cheapest recovery you will ever get.',
  optional: true,
  sections: [
    S('Flow', null, [
      i('mobility_flow', { sets: 1, reps: '10 min' }),
      i('couch_stretch', { sets: 1, reps: '90 s ea side' }),
      i('adductor_rock', { sets: 1, reps: '10 ea side' }),
      i('cat_cow', { sets: 1, reps: '10 + 5 ea side' })
    ]),
    S('Tissue', null, [
      i('soft_tissue', { sets: 1, reps: '8 min total' })
    ]),
    S('Aerobic', null, [
      i('walk_recovery', { sets: 1, reps: '30-45 min' })
    ]),
    S('Down-Regulate', null, [
      i('breath_down', { sets: 1, reps: '5 min' })
    ])
  ]
};

/* ------------------------------------------------------------ TEST BATTERY */
export const TEST_DAY_A = {
  id: 'testA', day: 0, name: 'Test Battery — Size & Athleticism',
  focus: 'Tape, scale, and jumps. Proof that the weight went where you wanted it.',
  brief: 'On a gaining phase this session answers one question: did I add muscle or did I add padding? Chest, arm and thigh climbing while the waist stays flat is the picture you want. Measure cold, before you train — a pumped arm reads big and means nothing.',
  isTest: true,
  sections: [
    S('Movement Prep', 'Thorough — you are about to go max effort.', [
      i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
      i('world_greatest', { sets: 1, reps: '5 ea side' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('a_skip', { sets: 3, reps: '20 m' }),
      i('pogo_prep', { sets: 3, reps: '20 contacts' }),
      i('box_jump', { sets: 2, reps: '3', rest: 60 })
    ]),
    S('Body Composition', 'Do this first, cold, before anything else.', [
      i('test_bodycomp', { sets: 1, reps: '1', metric: 'bodyweight' }),
      i('test_measure', { sets: 1, reps: 'chest / arm / thigh', metric: 'chest' })
    ]),
    S('Baseline Measurement', null, [
      i('test_reach', { sets: 1, reps: '1', metric: 'reach' }),
      i('test_ankle', { sets: 1, reps: '1 ea side', metric: 'ankle' })
    ]),
    S('Jump Tests', '3 attempts each, full recovery. Best attempt counts.', [
      i('test_approach', { sets: 3, reps: '1', rest: 150, metric: 'approach' }),
      i('test_block', { sets: 3, reps: '1', rest: 120, metric: 'block' }),
      i('test_broad', { sets: 3, reps: '1', rest: 120, metric: 'broad' })
    ]),
    S('Speed Test', null, [
      i('test_agility', { sets: 4, reps: '1 timed run', rest: 180, metric: 'agility' })
    ])
  ]
};

export const TEST_DAY_B = {
  id: 'testB', day: 3, name: 'Test Battery — Strength',
  focus: 'Re-establish the maxes that drive every percentage in the app.',
  brief: 'Work up in singles and doubles to a hard-but-clean triple. Stop at the first rep that looks ugly. Enter each 3RM in Settings and the app converts it to an estimated 1RM and re-prescribes everything downstream.',
  isTest: true,
  sections: [
    S('Movement Prep', null, [
      i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('hip_90_90', { sets: 1, reps: '10 switches' }),
      i('scap_pushup', { sets: 2, reps: '10' }),
      i('band_pullapart', { sets: 2, reps: '15' })
    ]),
    S('Lower Strength Test', 'Ramp: 5 @ 50%, 3 @ 65%, 3 @ 75%, 2 @ 85%, then 3RM attempts.', [
      i('test_squat_3rm', { sets: 1, reps: '3RM', rest: 240, maxRef: 'squat' }),
      i('trap_dl', { sets: 1, reps: '3RM', rest: 240, maxRef: 'trapbar', note: 'Same ramp. Log the 3RM in Settings.' })
    ]),
    S('Upper Strength Test', null, [
      i('bench', { sets: 1, reps: '3RM', rest: 240, maxRef: 'bench' }),
      i('ohp', { sets: 1, reps: '3RM', rest: 210, maxRef: 'ohp' }),
      i('test_pullup_max', { sets: 1, reps: 'Max', rest: 180, metric: 'pullups' })
    ]),
    S('Cool Down', null, [
      i('breath_down', { sets: 1, reps: '5 min' })
    ])
  ]
};

/* ============================================================== THE BLOCKS */
const BLOCK_DEFS = [
  { n: 1, name: 'Base',        weeks: [1, 2, 3, 4],     color: '#4f8ff7', phase: P1, tagline: 'Learn the patterns',
    goal: 'Technique, full range of motion, and building tolerance to real volume.',
    detail: 'You are switching from a power program to a growth program, and the first block is about earning the right to do the hard volume that follows. Two reps in reserve on the main lifts, full range everywhere, and no chasing load yet. The Wednesday jump session starts here and never leaves — it is your insurance that the weight you add is athletic weight.' },
  { n: 2, name: 'Volume',      weeks: [5, 6, 7, 8],     color: '#7c6cf0', phase: P1, tagline: 'The most sets you will do',
    goal: 'Peak weekly set counts. This is the block that drives the first visible change.',
    detail: 'Same exercises as block 1 so you can see progress on the same numbers, but the sets climb and the last set of most isolation work goes to failure. Expect to be sore and hungry. If your jump numbers on Wednesday start dropping, that is the signal you are underfed rather than overtrained.' },
  { n: 3, name: 'Load',        weeks: [9, 10, 11, 12],  color: '#f7a84f', phase: P2, tagline: 'Get strong again',
    goal: 'Percentage-based squat, bench, trap bar and pull-up work at 78-86%.',
    detail: 'Muscle you cannot load eventually stops growing, so this block raises the ceiling. Reps drop to 4-5 on the primaries and the accessory work stays heavy. Weighted pull-ups become the primary pull, which is deliberately unforgiving as your bodyweight climbs — if they keep going up, so is your muscle-to-fat ratio.' },
  { n: 4, name: 'Grow',        weeks: [13, 14, 15, 16], color: '#e5844d', phase: P2, tagline: 'Volume at the new loads',
    goal: 'Back to hypertrophy rep ranges, now with a meaningfully stronger base.',
    detail: 'The pay-off block for the strength you just built. Same 6-8 and 10-12 rep ranges as phase one, but every one of them is now loaded 10-15% heavier. This is usually where people first get asked whether they have been working out.' },
  { n: 5, name: 'Density',     weeks: [17, 18, 19, 20], color: '#e5484d', phase: P3, tagline: 'Shorter rests, harder finishes',
    goal: 'Highest-effort block: myo-reps, drop sets, and compressed rest on accessories.',
    detail: 'Volume is already high, so the extra stimulus comes from effort instead of more sets. Myo-reps on the leg press, drop sets on the isolation work, and rests cut to 45-60 seconds on anything small. Primaries stay heavy and fully rested — that part never gets compromised.' },
  { n: 6, name: 'Consolidate', weeks: [21, 22, 23, 24], color: '#30a46c', phase: P3, tagline: 'Prove it, then test it',
    goal: 'Peak intensity at 85-90%, volume pulled back, then the full retest in week 24.',
    detail: 'Volume drops and intensity peaks so the new muscle gets expressed as strength rather than just size. Week 23 tapers and week 24 re-runs the entire battery — tape, scale, jumps and 3RMs — against your week-zero numbers. Then you decide: keep gaining, or run a short cut to sharpen up at your new weight.' }
];

export const BLOCKS = BLOCK_DEFS.map(b => ({
  n: b.n, name: b.name, weeks: b.weeks, color: b.color,
  tagline: b.tagline, goal: b.goal, detail: b.detail,
  scheme: SCHEMES[b.n].label,
  days: b.phase.map(tpl => buildSession(tpl, SCHEMES[b.n]))
}));

export const TOTAL_WEEKS = 24;

/** The three 8-week phases, for the plan overview. */
export const PHASES = [
  { name: 'Build the base', weeks: '1-8',   blocks: [1, 2], detail: 'Master the patterns, then bury yourself in volume.' },
  { name: 'Add the load',   weeks: '9-16',  blocks: [3, 4], detail: 'Get stronger, then grow into the new strength.' },
  { name: 'Fill the frame', weeks: '17-24', blocks: [5, 6], detail: 'Maximum effort, then consolidate and retest.' }
];

/* ----------------------------------------------------------------- LOOKUPS */
export function blockForWeek(week) {
  return BLOCKS.find(b => b.weeks.includes(week)) || BLOCKS[0];
}

export function weekInBlock(week) {
  const b = blockForWeek(week);
  return b.weeks.indexOf(week); // 0..3, where 3 is the deload week
}

export function isDeloadWeek(week) {
  return weekInBlock(week) === 3;
}

export function isTestWeek(week) {
  return week === TOTAL_WEEKS;
}

/** All sessions for a given week, in day order. */
export function weekSessions(week) {
  if (isTestWeek(week)) {
    const light = BLOCKS[5].days.find(d => d.day === 4);
    return [
      TEST_DAY_A,
      { ...light, day: 1, name: 'Pull — light', brief: 'Light maintenance between test days. Two sets per movement, nothing near failure.' },
      { ...RECOVERY_DAY, day: 2, name: 'Recovery (pre-test)' },
      TEST_DAY_B,
      { ...BLOCKS[5].days.find(d => d.day === 2), day: 4, name: 'Free Play', brief: 'Go play volleyball at your new bodyweight. This is the whole point.', optional: true },
      RECOVERY_DAY
    ].sort((a, b) => a.day - b.day);
  }
  const b = blockForWeek(week);
  return [...b.days, RECOVERY_DAY].sort((x, y) => x.day - y.day);
}

export function sessionFor(week, dayIndex) {
  return weekSessions(week).find(s => s.day === dayIndex) || null;
}

export function dayLabel(dayIndex) {
  return DAY_LABELS[dayIndex];
}

/** Resolve a per-week-indexed prescription value. */
export function atWeek(value, wib) {
  if (Array.isArray(value)) return value[Math.min(wib, value.length - 1)];
  return value;
}

const SUPPORT_RE = /prep|recovery|down-regulate|flow|tissue|aerobic|durability|spring/i;
/* Armor work is real work, but counting it as "pull volume" would flatter the
   numbers, so the per-pattern view leaves it out. */
const NON_HYPERTROPHY_RE = /prep|recovery|down-regulate|flow|tissue|aerobic|durability|spring|armor/i;

/** Total planned working sets in a session (excludes prep/recovery). */
export function sessionVolume(session, wib) {
  let sets = 0;
  for (const sec of session.sections) {
    if (SUPPORT_RE.test(sec.name)) continue;
    for (const it of sec.items) sets += atWeek(it.sets, wib) || 0;
  }
  return sets;
}

/** Rough session duration estimate in minutes. */
export function sessionMinutes(session, wib) {
  let mins = 0;
  for (const sec of session.sections) {
    for (const it of sec.items) {
      const sets = atWeek(it.sets, wib) || 1;
      const rest = it.rest || 30;
      mins += (sets * (rest + 35)) / 60;
    }
  }
  return Math.round(mins / 5) * 5;
}

/**
 * Weekly set count per movement pattern — the number that actually drives
 * hypertrophy, and worth being able to see.
 */
export function weeklySetsByPattern(week) {
  const wib = weekInBlock(week);
  const out = {};
  for (const s of weekSessions(week)) {
    if (s.optional) continue;
    for (const sec of s.sections) {
      if (NON_HYPERTROPHY_RE.test(sec.name)) continue;
      for (const it of sec.items) {
        const p = ex(it.ex).pattern || 'other';
        out[p] = (out[p] || 0) + (atWeek(it.sets, wib) || 0);
      }
    }
  }
  return out;
}

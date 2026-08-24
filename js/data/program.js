/**
 * "ABOVE THE NET" — a 16-week block-periodized program for a 6'3", 190 lb
 * volleyball player who wants to be lean, explosive, and hard to break.
 *
 * Structure: 4 blocks x 4 weeks. Weeks 1-3 of each block load, week 4 unloads.
 * Week 16 is a test week — you re-run the whole battery and see the receipts.
 *
 * Prescription arrays are indexed by week-within-block (0..3). A scalar means
 * "same every week".
 */

/* Percent-of-max prescriptions reference these tested lifts. */
export const MAX_LIFTS = {
  squat:   { name: 'Back Squat',        unit: 'lb' },
  trapbar: { name: 'Trap Bar Deadlift', unit: 'lb' },
  bench:   { name: 'Bench Press',       unit: 'lb' },
  ohp:     { name: 'Overhead Press',    unit: 'lb' },
  clean:   { name: 'Hang Power Clean',  unit: 'lb' }
};

export const METRICS = {
  bodyweight:   { name: 'Body Weight',      unit: 'lb', better: 'lower', target: 180 },
  waist:        { name: 'Waist (navel)',    unit: 'in', better: 'lower', target: 31 },
  reach:        { name: 'Standing Reach',   unit: 'in', better: 'flat' },
  approach:     { name: 'Approach Jump',    unit: 'in', better: 'higher', note: 'Touch height minus standing reach' },
  block:        { name: 'Block Jump',       unit: 'in', better: 'higher' },
  broad:        { name: 'Broad Jump',       unit: 'in', better: 'higher' },
  agility:      { name: '5-10-5 Agility',   unit: 's',  better: 'lower' },
  pullups:      { name: 'Max Pull-Ups',     unit: 'reps', better: 'higher' },
  ankle:        { name: 'Ankle (knee-to-wall)', unit: 'cm', better: 'higher', target: 10 }
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* Shorthand builders ------------------------------------------------------ */
const S = (name, notes, items) => ({ name, notes, items });
const i = (exId, o = {}) => ({ ex: exId, ...o });

/* Reusable blocks --------------------------------------------------------- */
const PREP_LOWER = S('Movement Prep', '8 minutes. Do not skip this — it is where your ankles and hips get permission to work.', [
  i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
  i('ankle_rock', { sets: 2, reps: '8 ea side' }),
  i('hip_90_90', { sets: 1, reps: '10 switches' }),
  i('world_greatest', { sets: 1, reps: '5 ea side' }),
  i('pogo_prep', { sets: 2, reps: '15 contacts' })
]);

const PREP_UPPER = S('Movement Prep', '8 minutes. Shoulder prep is the price of admission for a hitter.', [
  i('cat_cow', { sets: 1, reps: '8 + 5 ea side' }),
  i('scap_pushup', { sets: 2, reps: '10' }),
  i('band_pullapart', { sets: 2, reps: '15' }),
  i('wall_slide', { sets: 2, reps: '10' })
]);

const PREP_SPEED = S('Movement Prep', 'Longer prep — you are about to sprint and cut. Cold tissue tears.', [
  i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
  i('adductor_rock', { sets: 1, reps: '8 ea side' }),
  i('world_greatest', { sets: 1, reps: '5 ea side' }),
  i('a_skip', { sets: 3, reps: '20 m' }),
  i('pogo_prep', { sets: 2, reps: '20 contacts' })
]);

const ARMOR_SHOULDER = S('Shoulder Armor', '5 minutes, every upper day, forever. This is what keeps you swinging at 40.', [
  i('facepull', { sets: 3, reps: '15', rpe: 6, rest: 45 }),
  i('ext_rotation', { sets: 3, reps: '12 ea', rpe: 6, rest: 45, note: 'Light. 3 seconds on the way down.' }),
  i('prone_ytw', { sets: 2, reps: '5 of each letter', rpe: 6, rest: 45 })
]);

const ARMOR_LOWER = S('Durability Block', 'Tendon and connective-tissue work. Slow, boring, and the reason you stay on the court.', [
  i('calf_raise', { sets: 3, reps: '12', tempo: '3-1-1', rpe: 7, rest: 60 }),
  i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 }),
  i('copenhagen', { sets: 2, reps: '20 s ea side', rest: 45 })
]);

const NECK = i('neck_iso', { sets: 1, reps: '10 s x 4 directions' });

/* ========================================================================
   BLOCK 1 — FOUNDATION (Weeks 1-4)
   ===================================================================== */
const B1_A = {
  id: 'b1a', day: 0, name: 'Lower Base + Push',
  focus: 'Tempo squats and landing mechanics. Build the chassis before you race it.',
  brief: 'Everything is slower than you want it to be this block. That is deliberate — tempo work builds the tendon and connective-tissue tolerance that lets you survive the plyometrics in weeks 9-16.',
  sections: [
    PREP_LOWER,
    S('Jump Skill', 'Low volume, high quality. You are learning to land, not testing your vertical.', [
      i('snap_down', { sets: 3, reps: '5', rest: 60, note: 'Freeze the landing for a full 2 seconds.' }),
      i('box_jump', { sets: 4, reps: '3', rest: 75, note: 'Step down every single rep.' })
    ]),
    S('Main Strength', 'The tempo is the prescription. 3 seconds down, 1 second pause, drive up.', [
      i('back_squat', { sets: [3, 4, 4, 3], reps: '8', pct: [0.60, 0.65, 0.70, 0.60], tempo: '3-1-1', rest: 150 })
    ]),
    S('Push', null, [
      i('db_incline', { sets: [3, 3, 4, 2], reps: '10', rpe: [7, 7.5, 8, 6], rest: 90 }),
      i('pushup_weighted', { sets: 3, reps: '10', rpe: 7, rest: 75 })
    ]),
    S('Accessory', 'Shoulders wide, waist tight. This is the "shredded" part.', [
      i('lat_raise', { sets: 3, reps: '15', rpe: 8, rest: 45 }),
      i('triceps_ext', { sets: 3, reps: '12', rpe: 8, rest: 45 })
    ]),
    S('Durability Block', null, [
      i('calf_raise', { sets: 3, reps: '12', tempo: '3-1-1', rpe: 7, rest: 60 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 }),
      NECK
    ])
  ]
};

const B1_B = {
  id: 'b1b', day: 1, name: 'Pull + Shoulder Armor',
  focus: 'Back volume and the rotator-cuff work that keeps your swing alive.',
  brief: 'Volleyball is an overhead sport with no natural counterbalance. This session is the counterbalance. Do the armor work with light weight and real attention.',
  sections: [
    PREP_UPPER,
    S('Main Pull', null, [
      i('pullup', { sets: [4, 4, 4, 3], reps: 'AMRAP -1', rpe: 8, rest: 120, note: 'Leave one rep in the tank on every set. Add load once you clear 10.' }),
      i('bb_row', { sets: [3, 4, 4, 2], reps: '8', rpe: [7, 8, 8, 6], rest: 120 })
    ]),
    S('Volume Pull', null, [
      i('chest_supported_row', { sets: 3, reps: '12', rpe: 8, rest: 75 }),
      i('curl', { sets: 3, reps: '12', rpe: 8, rest: 45 })
    ]),
    ARMOR_SHOULDER,
    S('Core', 'Braced, not crunched. Every rep should feel like you could take a punch.', [
      i('hollow_hold', { sets: 3, reps: '30 s', rest: 45 }),
      i('pallof', { sets: 3, reps: '10 ea side', rpe: 7, rest: 45 }),
      i('side_plank', { sets: 2, reps: '8 reach-throughs ea', rest: 45 })
    ]),
    S('Carry', null, [
      i('bottoms_up_carry', { sets: 3, reps: '20 m ea arm', rpe: 8, rest: 60 })
    ])
  ]
};

const B1_C = {
  id: 'b1c', day: 2, name: 'Court Speed + Aerobic Base',
  focus: 'Sprint mechanics, footwork, and an aerobic engine that does not cost you your legs.',
  brief: 'If you played volleyball yesterday and your legs are cooked, cut the sprints in half and keep the Zone 2. The aerobic base is what makes you recover between points in the third set.',
  sections: [
    PREP_SPEED,
    S('Sprint Mechanics', 'Quality only. Full recovery. If your times drop off, you are done.', [
      i('wall_drill', { sets: 3, reps: '10 ea leg', rest: 45 }),
      i('sprint_accel', { sets: [5, 6, 6, 4], reps: '15 m', rest: 90 })
    ]),
    S('Court Movement', 'Volleyball-specific footwork. No ball needed.', [
      i('lateral_shuffle', { sets: 4, reps: '2 x 5 m + cut', rest: 60 }),
      i('approach_footwork', { sets: 4, reps: '5 approaches', rest: 60, note: 'Slow it down first, then build speed. Fix the footwork now while it is cheap.' })
    ]),
    S('Conditioning', 'Pick one. Tempo runs if your legs feel good, Zone 2 if they do not.', [
      i('tempo_run', { sets: [8, 10, 12, 6], reps: '100 m @ 70%', rest: 60, note: 'Walk back as your rest.' }),
      i('zone2', { sets: 1, reps: '25 min', note: 'Alternative to tempo runs. Bike or row — keep it non-impact.' })
    ]),
    S('Durability Block', null, [
      i('copenhagen', { sets: 3, reps: '20 s ea side', rest: 45 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 }),
      i('seated_calf', { sets: 3, reps: '15', tempo: '3-1-1', rpe: 7, rest: 60 })
    ])
  ]
};

const B1_D = {
  id: 'b1d', day: 3, name: 'Posterior Chain + Single Leg',
  focus: 'Hamstrings, glutes, and closing the gap between your left and right leg.',
  brief: 'Nordics are the most important thing in this session and probably in this program. Hamstring strains end seasons. Log the depth you can control and chase it.',
  sections: [
    S('Movement Prep', null, [
      i('hip_90_90', { sets: 1, reps: '10 switches' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('bird_dog', { sets: 2, reps: '6 ea side' }),
      i('adductor_rock', { sets: 1, reps: '8 ea side' })
    ]),
    S('Main Hinge', 'Controlled down, aggressive up.', [
      i('trap_dl', { sets: [3, 4, 4, 3], reps: '6', pct: [0.62, 0.68, 0.73, 0.60], tempo: '3-0-1', rest: 150 })
    ]),
    S('Hinge Volume', null, [
      i('rdl', { sets: 3, reps: '10', rpe: [7, 7.5, 8, 6], rest: 105, note: 'Stop when the hamstrings run out of length — not when your back rounds.' }),
      i('nordic', { sets: 3, reps: '5', rest: 90, note: 'Lower as slowly as you can control. Log how far down you get.' })
    ]),
    S('Single Leg', 'The side that feels harder gets one extra set. Every time.', [
      i('bulgarian', { sets: 3, reps: '10 ea', tempo: '3-0-1', rpe: 8, rest: 90 }),
      i('leg_curl', { sets: 3, reps: '12', tempo: '3-1-1', rpe: 8, rest: 60 })
    ]),
    S('Durability Block', null, [
      i('seated_calf', { sets: 4, reps: '12', tempo: '3-1-1', rpe: 8, rest: 60 }),
      i('atg_split', { sets: 2, reps: '8 ea', rpe: 6, rest: 60, note: 'Bodyweight or light. Building knee tolerance in deep flexion.' })
    ]),
    S('Core', null, [
      i('ab_wheel', { sets: 3, reps: '8', rest: 60 }),
      i('suitcase_carry', { sets: 3, reps: '30 m ea', rpe: 8, rest: 60 })
    ])
  ]
};

const B1_E = {
  id: 'b1e', day: 5, name: 'Full Body Power + Finisher',
  focus: 'Triple extension, horizontal power, and a metabolic kicker.',
  brief: 'First real taste of power work. Med ball and broad jumps are 100% intent or they are worthless — do not turn them into conditioning.',
  sections: [
    S('Movement Prep', null, [
      i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
      i('world_greatest', { sets: 1, reps: '5 ea side' }),
      i('scap_pushup', { sets: 2, reps: '10' }),
      i('pogo_prep', { sets: 2, reps: '20 contacts' })
    ]),
    S('Power', 'Every rep at full effort. Long rests. This is a nervous-system session.', [
      i('med_scoop_toss', { sets: 4, reps: '5', rest: 75, note: 'Toss it as high as you can and let it land.' }),
      i('broad_jump', { sets: [3, 4, 4, 2], reps: '3', rest: 90, note: 'Mark your best distance and try to beat it.' })
    ]),
    S('Strength', null, [
      i('front_squat', { sets: 3, reps: '8', pct: [0.50, 0.55, 0.58, 0.48], tempo: '2-1-1', rest: 120, note: 'Percentages are off your BACK squat max — front squat runs about 85% of it.' }),
      i('ohp', { sets: [3, 4, 4, 2], reps: '8', pct: [0.62, 0.66, 0.70, 0.58], rest: 120 })
    ]),
    S('Upper Volume', null, [
      i('db_row', { sets: 3, reps: '10 ea', rpe: 8, rest: 75 }),
      i('dip', { sets: 3, reps: '10', rpe: 8, rest: 75 })
    ]),
    S('Finisher', '8 minutes of hell. Keep every rep fast — this is power endurance, not a grind.', [
      i('sled_push', { sets: [6, 8, 8, 5], reps: '10 s all-out', rest: 60, note: 'Sled, bike, or hill. Full recovery between — quality every rep.' })
    ]),
    S('Durability Block', null, [
      i('ext_rotation', { sets: 2, reps: '15 ea', rpe: 6, rest: 45 }),
      NECK
    ])
  ]
};

/* ========================================================================
   BLOCK 2 — STRENGTH (Weeks 5-8)
   ===================================================================== */
const B2_A = {
  id: 'b2a', day: 0, name: 'Heavy Lower + Push',
  focus: 'Real weight on the bar. Force production is the foundation of a vertical.',
  brief: 'The tempo work is gone and the load is up. You cannot jump higher than you can push into the floor — this block builds the push. Depth drops appear this week: step off, land silently, freeze.',
  sections: [
    PREP_LOWER,
    S('Plyometrics', 'Landing quality is the whole point of the depth drops. Silent or it does not count.', [
      i('pogo', { sets: 3, reps: '12 contacts', rest: 60 }),
      i('depth_drop', { sets: [3, 3, 4, 2], reps: '4', rest: 90, note: 'Box at 18-24". Step OFF, do not jump off. Freeze the landing 2 s.' }),
      i('box_jump', { sets: 4, reps: '3', rest: 75 })
    ]),
    S('Main Strength', null, [
      i('back_squat', { sets: [5, 5, 5, 3], reps: [4, 4, 3, 4], pct: [0.78, 0.82, 0.86, 0.70], rest: 210 })
    ]),
    S('Push', null, [
      i('bench', { sets: [4, 4, 5, 3], reps: [5, 5, 4, 5], pct: [0.75, 0.80, 0.85, 0.70], rest: 180 }),
      i('db_incline', { sets: 3, reps: '8', rpe: 8, rest: 90 })
    ]),
    S('Accessory', null, [
      i('lat_raise', { sets: 3, reps: '15', rpe: 8, rest: 45 }),
      i('triceps_ext', { sets: 3, reps: '12', rpe: 8, rest: 45 })
    ]),
    S('Durability Block', null, [
      i('calf_raise', { sets: 4, reps: '8', tempo: '2-2-1', rpe: 8, rest: 75, note: 'Heavier than block 1. Hold 2 s at the top.' }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
      NECK
    ])
  ]
};

const B2_B = {
  id: 'b2b', day: 1, name: 'Heavy Pull + Shoulder Armor',
  focus: 'Loaded pull-ups and rows. Armor work unchanged.',
  brief: 'Add weight to your pull-ups this block. A weighted pull-up is one of the best indicators of an athlete who is both strong and lean.',
  sections: [
    PREP_UPPER,
    S('Main Pull', null, [
      i('pullup', { sets: 5, reps: '5', rpe: 8, rest: 150, note: 'Add load with a belt or vest. If 5x5 bodyweight is easy, you need weight.' }),
      i('bb_row', { sets: [4, 4, 4, 2], reps: '6', rpe: [8, 8.5, 9, 6], rest: 150 })
    ]),
    S('Volume Pull', null, [
      i('chest_supported_row', { sets: 3, reps: '10', rpe: 8, rest: 75 }),
      i('curl', { sets: 3, reps: '10', rpe: 8, rest: 45 })
    ]),
    ARMOR_SHOULDER,
    S('Core', null, [
      i('hanging_leg_raise', { sets: 3, reps: '10', rest: 60 }),
      i('pallof', { sets: 3, reps: '10 ea side', rpe: 8, rest: 45 }),
      i('copenhagen', { sets: 3, reps: '25 s ea side', rest: 45 })
    ]),
    S('Carry', null, [
      i('farmer_carry', { sets: 3, reps: '40 m', rpe: 8, rest: 75 })
    ])
  ]
};

const B2_C = {
  id: 'b2c', day: 2, name: 'Speed + Change of Direction',
  focus: 'Acceleration and hard cutting. Timed, tracked, competitive.',
  brief: 'Time your 5-10-5 today and log it. A number you can see moving is worth more than any amount of "feeling faster".',
  sections: [
    PREP_SPEED,
    S('Acceleration', 'Full recovery. Every rep is a max effort or it is junk mileage.', [
      i('sprint_accel', { sets: [6, 8, 8, 5], reps: '20 m', rest: 120 })
    ]),
    S('Change of Direction', null, [
      i('pro_agility', { sets: 4, reps: '1 timed run', rest: 150, note: 'Two runs each direction. Log your best time in the Progress tab.' }),
      i('crossover_step', { sets: 4, reps: '3 ea side', rest: 60 }),
      i('reactive_shuffle', { sets: 6, reps: '6 s', rest: 75, note: 'Need a partner or a random cue. React, do not anticipate.' })
    ]),
    S('Conditioning', 'Repeat-sprint ability in the exact pattern volleyball asks for.', [
      i('shuttle_condition', { sets: [6, 8, 8, 4], reps: '1 down-and-back x3', rest: 60 })
    ]),
    S('Durability Block', null, [
      i('copenhagen', { sets: 3, reps: '25 s ea side', rest: 45 }),
      i('seated_calf', { sets: 3, reps: '15', tempo: '3-1-1', rpe: 8, rest: 60 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 })
    ])
  ]
};

const B2_D = {
  id: 'b2d', day: 3, name: 'Heavy Hinge + Single Leg',
  focus: 'Trap bar deadlift at real weight. Hamstrings hammered.',
  brief: 'Heaviest pulling of the program. Brace hard, keep the lats tight, and stop the set the moment your back position changes.',
  sections: [
    S('Movement Prep', null, [
      i('hip_90_90', { sets: 1, reps: '10 switches' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('bird_dog', { sets: 2, reps: '6 ea side' }),
      i('med_scoop_toss', { sets: 2, reps: '5', note: 'Primer — wakes up the hinge before you load it.' })
    ]),
    S('Main Hinge', null, [
      i('trap_dl', { sets: [5, 5, 5, 3], reps: [4, 4, 3, 4], pct: [0.80, 0.84, 0.88, 0.72], rest: 210 })
    ]),
    S('Hip Extension', null, [
      i('hip_thrust', { sets: 3, reps: '8', rpe: 8, rest: 105, note: '1 s hard squeeze at the top of every rep.' }),
      i('nordic', { sets: 4, reps: '5', rest: 90, note: 'Chase the depth. This is the anti-hamstring-strain drug.' })
    ]),
    S('Single Leg', null, [
      i('step_up', { sets: 3, reps: '8 ea', rpe: 8, rest: 90, note: 'Knee-height box. Zero push off the back foot.' }),
      i('atg_split', { sets: 3, reps: '8 ea', rpe: 7, rest: 75 })
    ]),
    S('Durability Block', null, [
      i('seated_calf', { sets: 4, reps: '10', tempo: '2-2-1', rpe: 8, rest: 75 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 })
    ]),
    S('Core', null, [
      i('ab_wheel', { sets: 3, reps: '10', rest: 60 }),
      i('side_plank', { sets: 2, reps: '10 reach-throughs ea', rest: 45 })
    ])
  ]
};

const B2_E = {
  id: 'b2e', day: 5, name: 'Explosive Full Body',
  focus: 'Olympic derivatives and loaded jumps. Speed against resistance.',
  brief: 'Hang power clean if you know it, trap bar jump shrug if you do not — both build the same triple extension. Bar speed is the prescription: if it slows down, the set is over regardless of reps left.',
  sections: [
    S('Movement Prep', null, [
      i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
      i('world_greatest', { sets: 1, reps: '5 ea side' }),
      i('scap_pushup', { sets: 2, reps: '10' }),
      i('pogo_prep', { sets: 2, reps: '20 contacts' })
    ]),
    S('Olympic Derivative', 'Pick ONE. Speed over load, always.', [
      i('hang_clean', { sets: 5, reps: '3', pct: [0.70, 0.75, 0.80, 0.65], rest: 150 }),
      i('jump_shrug', { sets: 5, reps: '3', pct: [0.35, 0.38, 0.40, 0.30], rest: 150, note: 'Substitute for the hang clean if you have not been coached on the catch.' })
    ]),
    S('Loaded Jumps', null, [
      i('trap_jump', { sets: 4, reps: '3', pct: [0.22, 0.25, 0.28, 0.20], rest: 120, note: 'Reset on the floor between reps. If the bar barely leaves the ground, drop weight.' }),
      i('med_rot_throw', { sets: 4, reps: '4 ea side', rest: 75 })
    ]),
    S('Strength', null, [
      i('ohp', { sets: [4, 4, 4, 2], reps: '5', pct: [0.75, 0.80, 0.85, 0.70], rest: 150 }),
      i('db_row', { sets: 4, reps: '8 ea', rpe: 8, rest: 90 }),
      i('chinup', { sets: 3, reps: '8', rpe: 8, rest: 90 })
    ]),
    S('Finisher', null, [
      i('sled_push', { sets: [8, 8, 10, 5], reps: '10 s all-out', rest: 60 })
    ]),
    S('Durability Block', null, [
      i('ext_rotation', { sets: 2, reps: '15 ea', rpe: 6, rest: 45 }),
      NECK
    ])
  ]
};

/* ========================================================================
   BLOCK 3 — POWER (Weeks 9-12)
   ===================================================================== */
const B3_A = {
  id: 'b3a', day: 0, name: 'Contrast Lower + Push',
  focus: 'Heavy singles paired with jumps. Teaching strength to move fast.',
  brief: 'Contrast training: a heavy set primes your nervous system, then you immediately express it in a jump. Rest 30-45 s between the heavy set and the jump — long enough to recover, short enough to still be potentiated.',
  sections: [
    PREP_LOWER,
    S('Reactive Plyometrics', 'Highest-value, highest-cost drills in the program. Ground contact should sound like ONE sound.', [
      i('pogo', { sets: 3, reps: '12 contacts', rest: 60 }),
      i('depth_jump', { sets: [4, 4, 4, 2], reps: '4', rest: 120, note: 'Box 18-24". Touch and go. If you have to sink deep, the box is too tall.' })
    ]),
    S('Contrast Pair A', 'Squat, rest 40 s, then jump. That is one round.', [
      i('back_squat', { sets: [4, 4, 5, 3], reps: [3, 2, 2, 3], pct: [0.85, 0.88, 0.90, 0.75], rest: 40, pair: 'A' }),
      i('block_jump', { sets: [4, 4, 5, 3], reps: '3', rest: 180, pair: 'A', note: 'Max height every rep. Reach for a real target.' })
    ]),
    S('Contrast Pair B', null, [
      i('bench', { sets: 4, reps: '3', pct: [0.85, 0.87, 0.90, 0.75], rest: 40, pair: 'B' }),
      i('med_slam', { sets: 4, reps: '5', rest: 150, pair: 'B', note: 'Violent. Every rep 100%.' })
    ]),
    S('Accessory', null, [
      i('db_incline', { sets: 3, reps: '8', rpe: 8, rest: 90 }),
      i('lat_raise', { sets: 3, reps: '15', rpe: 8, rest: 45 }),
      i('triceps_ext', { sets: 3, reps: '12', rpe: 8, rest: 45 })
    ]),
    S('Durability Block', null, [
      i('calf_raise', { sets: 4, reps: '8', tempo: '2-2-1', rpe: 8, rest: 75 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
      NECK
    ])
  ]
};

const B3_B = {
  id: 'b3b', day: 1, name: 'Max Pull + Shoulder Armor',
  focus: 'Heavy low-rep pulling. Keep the armor work honest.',
  brief: 'Intensity is up everywhere this block, including the pull. The armor work never gets heavier — it gets more attentive.',
  sections: [
    PREP_UPPER,
    S('Main Pull', null, [
      i('pullup', { sets: 5, reps: '3', rpe: 9, rest: 180, note: 'Weighted. Heaviest pull-ups of the program.' }),
      i('bb_row', { sets: [4, 4, 4, 2], reps: '5', rpe: [8.5, 9, 9, 6], rest: 150 })
    ]),
    S('Volume Pull', null, [
      i('chest_supported_row', { sets: 3, reps: '10', rpe: 8, rest: 75 }),
      i('curl', { sets: 3, reps: '10', rpe: 8, rest: 45 })
    ]),
    ARMOR_SHOULDER,
    S('Core', null, [
      i('hanging_leg_raise', { sets: 3, reps: '12', rest: 60 }),
      i('pallof', { sets: 3, reps: '10 ea side', rpe: 8, rest: 45 }),
      i('dead_bug', { sets: 3, reps: '8 ea side', rpe: 7, rest: 45 })
    ]),
    S('Carry', null, [
      i('bottoms_up_carry', { sets: 3, reps: '25 m ea arm', rpe: 8, rest: 60 })
    ])
  ]
};

const B3_C = {
  id: 'b3c', day: 2, name: 'Top Speed + Reactive Agility',
  focus: 'Flying sprints and reacting to cues. The fastest you will move all week.',
  brief: 'Flying sprints expose you to true max velocity, which is the best hamstring insurance that exists. Get properly warm first — this is the one session where a poor warm-up will actually hurt you.',
  sections: [
    PREP_SPEED,
    S('Max Velocity', 'Full recovery — 3 minutes between flying sprints. No exceptions.', [
      i('flying_sprint', { sets: [3, 4, 4, 2], reps: '20 m fly', rest: 180 }),
      i('sprint_accel', { sets: [5, 6, 6, 4], reps: '20 m', rest: 120 })
    ]),
    S('Reactive Agility', null, [
      i('pro_agility', { sets: 4, reps: '1 timed run', rest: 150, note: 'Log the best time. Compare to block 2.' }),
      i('reactive_shuffle', { sets: 6, reps: '6 s', rest: 75 }),
      i('approach_footwork', { sets: 4, reps: '5 approaches', rest: 60, note: 'At full match speed now.' })
    ]),
    S('Conditioning', 'Kept light on purpose — the power block is what matters right now.', [
      i('zone2', { sets: 1, reps: '20 min', note: 'Easy bike or row. Recovery, not a workout.' })
    ]),
    S('Durability Block', null, [
      i('copenhagen', { sets: 3, reps: '30 s ea side', rest: 45 }),
      i('nordic', { sets: 2, reps: '5', rest: 75, note: 'Light day. Just keeping the pattern.' }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 })
    ])
  ]
};

const B3_D = {
  id: 'b3d', day: 3, name: 'Power Hinge + Contrast',
  focus: 'Hang cleans, heavy pulls, and broad jumps off the back of RDLs.',
  brief: 'The hinge version of Monday. Cleans first while you are fresh — technical lifts never go after fatigue.',
  sections: [
    S('Movement Prep', null, [
      i('hip_90_90', { sets: 1, reps: '10 switches' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('med_scoop_toss', { sets: 3, reps: '5' }),
      i('pogo_prep', { sets: 2, reps: '20 contacts' })
    ]),
    S('Olympic Derivative', null, [
      i('hang_clean', { sets: 5, reps: '2', pct: [0.80, 0.85, 0.88, 0.70], rest: 180 }),
      i('jump_shrug', { sets: 5, reps: '3', pct: [0.42, 0.45, 0.48, 0.35], rest: 180, note: 'Substitute if you are not cleaning.' })
    ]),
    S('Main Hinge', null, [
      i('trap_dl', { sets: [4, 4, 4, 2], reps: '3', pct: [0.85, 0.88, 0.90, 0.75], rest: 210 })
    ]),
    S('Contrast Pair C', 'RDL, rest 40 s, broad jump.', [
      i('rdl', { sets: 3, reps: '5', rpe: 8, rest: 40, pair: 'C' }),
      i('broad_jump', { sets: 3, reps: '3', rest: 150, pair: 'C', note: 'Chase your PR distance.' })
    ]),
    S('Durability Block', null, [
      i('nordic', { sets: 4, reps: '6', rest: 90 }),
      i('seated_calf', { sets: 4, reps: '10', tempo: '2-2-1', rpe: 8, rest: 75 }),
      i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 })
    ]),
    S('Core', null, [
      i('ab_wheel', { sets: 3, reps: '10', rest: 60 }),
      i('suitcase_carry', { sets: 3, reps: '30 m ea', rpe: 8, rest: 60 })
    ])
  ]
};

const B3_E = {
  id: 'b3e', day: 5, name: 'JUMP DAY',
  focus: 'The money session. Max approach jumps, reactive plyos, and nothing that gets in the way.',
  brief: 'This is the session the whole program points at. Warm up thoroughly, then jump with total intent. The rule is absolute: the moment your jump height drops, that exercise is over. Chasing reps here makes you worse, not better.',
  sections: [
    S('Movement Prep', 'Be genuinely warm before you jump. 10 minutes minimum.', [
      i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
      i('world_greatest', { sets: 1, reps: '5 ea side' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('pogo_prep', { sets: 3, reps: '20 contacts' }),
      i('snap_down', { sets: 2, reps: '5' })
    ]),
    S('Max Jumps', 'Fresh, maximal, measured. Touch a real target and know the number.', [
      i('approach_jump', { sets: [5, 6, 6, 4], reps: '2', rest: 120, note: 'Full game approach. Stop the moment height drops off.' }),
      i('block_jump', { sets: 4, reps: '3', rest: 105 })
    ]),
    S('Reactive Plyometrics', null, [
      i('depth_jump', { sets: 4, reps: '3', rest: 120 }),
      i('hurdle_hop', { sets: 4, reps: '6 hurdles', rest: 90, note: 'Stiff ankles. Land and leave.' })
    ]),
    S('Loaded Power', null, [
      i('trap_jump', { sets: 4, reps: '3', pct: [0.25, 0.28, 0.30, 0.22], rest: 120 }),
      i('med_rot_throw', { sets: 3, reps: '4 ea side', rest: 75 })
    ]),
    S('Strength Maintenance', 'Keep it brief. You already did the important work.', [
      i('ohp', { sets: 3, reps: '4', pct: [0.82, 0.85, 0.88, 0.72], rest: 150 }),
      i('db_row', { sets: 3, reps: '8 ea', rpe: 8, rest: 90 }),
      i('dip', { sets: 3, reps: '8', rpe: 8, rest: 75 })
    ]),
    S('Durability Block', null, [
      i('ext_rotation', { sets: 2, reps: '15 ea', rpe: 6, rest: 45 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 8, rest: 45 }),
      NECK
    ])
  ]
};

/* ========================================================================
   BLOCK 4 — PEAK (Weeks 13-16)
   ===================================================================== */
const B4_A = {
  id: 'b4a', day: 0, name: 'Peak Lower + Push',
  focus: 'Near-max singles, minimal volume, maximum intent.',
  brief: 'Volume drops hard this block and intensity peaks. You should leave every session feeling sharp, not destroyed. If you are sore for two days, you did too much.',
  sections: [
    PREP_LOWER,
    S('Jump Primer', null, [
      i('pogo', { sets: 3, reps: '12 contacts', rest: 60 }),
      i('approach_jump', { sets: [5, 5, 4, 3], reps: '2', rest: 120, note: 'Fresh and maximal. This is a skill rep, not conditioning.' })
    ]),
    S('Contrast Pair A', null, [
      i('back_squat', { sets: [4, 4, 3, 2], reps: [2, 2, 2, 3], pct: [0.90, 0.92, 0.85, 0.70], rest: 45, pair: 'A' }),
      i('block_jump', { sets: [4, 4, 3, 2], reps: '3', rest: 210, pair: 'A' })
    ]),
    S('Push', null, [
      i('bench', { sets: [4, 4, 3, 2], reps: '3', pct: [0.88, 0.90, 0.85, 0.72], rest: 180 }),
      i('med_slam', { sets: 3, reps: '5', rest: 75 })
    ]),
    S('Accessory', 'Trimmed to essentials.', [
      i('lat_raise', { sets: 2, reps: '15', rpe: 8, rest: 45 }),
      i('triceps_ext', { sets: 2, reps: '12', rpe: 8, rest: 45 })
    ]),
    S('Durability Block', null, [
      i('calf_raise', { sets: 3, reps: '8', tempo: '2-2-1', rpe: 7, rest: 75 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 }),
      NECK
    ])
  ]
};

const B4_B = {
  id: 'b4b', day: 1, name: 'Pull + Armor (maintain)',
  focus: 'Hold your strength, protect your shoulder, stay fresh.',
  brief: 'Maintenance session. Enough stimulus to keep what you built, not enough to dig a hole.',
  sections: [
    PREP_UPPER,
    S('Main Pull', null, [
      i('pullup', { sets: 4, reps: '3', rpe: 8, rest: 150, note: 'Weighted, but leave a rep in the tank.' }),
      i('chest_supported_row', { sets: 3, reps: '8', rpe: 8, rest: 90 })
    ]),
    ARMOR_SHOULDER,
    S('Core', null, [
      i('hanging_leg_raise', { sets: 3, reps: '12', rest: 60 }),
      i('pallof', { sets: 2, reps: '10 ea side', rpe: 7, rest: 45 }),
      i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 })
    ]),
    S('Accessory', null, [
      i('curl', { sets: 2, reps: '12', rpe: 8, rest: 45 }),
      i('farmer_carry', { sets: 2, reps: '40 m', rpe: 8, rest: 75 })
    ])
  ]
};

const B4_C = {
  id: 'b4c', day: 2, name: 'Sharp Speed',
  focus: 'Short, fast, and done. In and out in 35 minutes.',
  brief: 'Speed work in a peak block is about staying sharp, not building. Low reps, full recovery, walk out feeling fast.',
  sections: [
    PREP_SPEED,
    S('Speed', null, [
      i('sprint_accel', { sets: [5, 5, 4, 3], reps: '20 m', rest: 150 }),
      i('flying_sprint', { sets: [3, 3, 2, 2], reps: '20 m fly', rest: 210 })
    ]),
    S('Court Movement', null, [
      i('approach_footwork', { sets: 3, reps: '5 approaches', rest: 60 }),
      i('crossover_step', { sets: 3, reps: '3 ea side', rest: 60 })
    ]),
    S('Durability Block', null, [
      i('nordic', { sets: 2, reps: '5', rest: 75 }),
      i('copenhagen', { sets: 2, reps: '30 s ea side', rest: 45 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 })
    ]),
    S('Recovery', null, [
      i('breath_down', { sets: 1, reps: '4 min' })
    ])
  ]
};

const B4_D = {
  id: 'b4d', day: 3, name: 'Peak Hinge',
  focus: 'Heavy pull, fast cleans, low volume.',
  brief: 'Last heavy pulling of the program. Two working sets that matter, then get out.',
  sections: [
    S('Movement Prep', null, [
      i('hip_90_90', { sets: 1, reps: '10 switches' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('med_scoop_toss', { sets: 3, reps: '5' })
    ]),
    S('Olympic Derivative', null, [
      i('hang_clean', { sets: [5, 5, 4, 3], reps: '2', pct: [0.85, 0.88, 0.82, 0.70], rest: 180 }),
      i('jump_shrug', { sets: 5, reps: '3', pct: [0.48, 0.50, 0.45, 0.35], rest: 180, note: 'Substitute if you are not cleaning.' })
    ]),
    S('Main Hinge', null, [
      i('trap_dl', { sets: [3, 3, 2, 2], reps: '2', pct: [0.90, 0.93, 0.85, 0.72], rest: 240 })
    ]),
    S('Single Leg', null, [
      i('step_up', { sets: 2, reps: '6 ea', rpe: 7, rest: 90 }),
      i('nordic', { sets: 3, reps: '5', rest: 90 })
    ]),
    S('Durability Block', null, [
      i('seated_calf', { sets: 3, reps: '10', tempo: '2-2-1', rpe: 7, rest: 75 }),
      i('tib_raise', { sets: 2, reps: '20', rpe: 7, rest: 45 })
    ])
  ]
};

const B4_E = {
  id: 'b4e', day: 5, name: 'EXPRESSION DAY',
  focus: 'Jump as high as you can. Everything else is optional.',
  brief: 'Warm up, get sharp, and go find out how high you can jump. Log the number. This is what 16 weeks of work is for.',
  sections: [
    S('Movement Prep', null, [
      i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
      i('world_greatest', { sets: 1, reps: '5 ea side' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('pogo_prep', { sets: 3, reps: '20 contacts' }),
      i('snap_down', { sets: 2, reps: '5' }),
      i('box_jump', { sets: 2, reps: '3', rest: 60 })
    ]),
    S('Max Expression', 'Fully rested between attempts. Chase a number.', [
      i('approach_jump', { sets: [6, 6, 5, 4], reps: '2', rest: 150, note: 'Log your best touch height in Progress.' }),
      i('block_jump', { sets: 4, reps: '2', rest: 120 }),
      i('broad_jump', { sets: 3, reps: '2', rest: 120 })
    ]),
    S('Reactive', 'Keep it minimal. Quality only.', [
      i('depth_jump', { sets: [3, 3, 2, 2], reps: '3', rest: 120 }),
      i('hurdle_hop', { sets: 3, reps: '6 hurdles', rest: 90 })
    ]),
    S('Power Maintenance', null, [
      i('trap_jump', { sets: 3, reps: '3', pct: [0.28, 0.30, 0.25, 0.22], rest: 120 }),
      i('med_rot_throw', { sets: 3, reps: '4 ea side', rest: 75 })
    ]),
    S('Durability Block', null, [
      i('ext_rotation', { sets: 2, reps: '15 ea', rpe: 6, rest: 45 }),
      NECK,
      i('breath_down', { sets: 1, reps: '4 min' })
    ])
  ]
};

/* ---------------------------------------------------------- RECOVERY DAY */
export const RECOVERY_DAY = {
  id: 'recovery', day: 6, name: 'Recovery Flow',
  focus: 'Move, breathe, eat, sleep. This is training too.',
  brief: 'Active recovery beats sitting still. 30 minutes of this on Sunday is worth more than an extra hard session, and it is the difference between finishing this program and quitting in week 9.',
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
  id: 'testA', day: 0, name: 'Test Battery — Performance',
  focus: 'Jumps, speed, and agility. Fresh legs, full effort, real numbers.',
  brief: 'Come in rested. Warm up properly. Test in this exact order every time — jumps before sprints before strength — so the numbers stay comparable. Log everything in the Progress tab.',
  isTest: true,
  sections: [
    S('Movement Prep', 'Thorough. You are about to go max effort.', [
      i('leg_swings', { sets: 1, reps: '10 ea / direction' }),
      i('world_greatest', { sets: 1, reps: '5 ea side' }),
      i('ankle_rock', { sets: 2, reps: '8 ea side' }),
      i('a_skip', { sets: 3, reps: '20 m' }),
      i('pogo_prep', { sets: 3, reps: '20 contacts' }),
      i('box_jump', { sets: 2, reps: '3', rest: 60 })
    ]),
    S('Baseline Measurement', 'Do this first — every jump number depends on it.', [
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
    ]),
    S('Body Composition', null, [
      i('test_bodycomp', { sets: 1, reps: '1', metric: 'bodyweight' })
    ])
  ]
};

export const TEST_DAY_B = {
  id: 'testB', day: 3, name: 'Test Battery — Strength',
  focus: 'Establish or re-establish the maxes that drive every percentage in the app.',
  brief: 'Work up in singles or doubles to a hard-but-clean triple. Stop at the first rep that looks ugly. Enter the 3RM in Settings and the app converts it to an estimated 1RM and re-prescribes everything.',
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
export const BLOCKS = [
  {
    n: 1, name: 'Foundation', weeks: [1, 2, 3, 4], color: '#4f8ff7',
    tagline: 'Build the chassis',
    goal: 'Tissue tolerance, movement quality, and a hypertrophy base. Tempo work and low-level landing mechanics.',
    detail: 'Everything here is slower and more controlled than feels necessary. That is the point: 4 weeks of eccentric and isometric loading builds the tendon stiffness and connective-tissue tolerance that lets you absorb depth jumps in block 3 without your knees complaining. Plyometric volume stays low and landing-focused. Conditioning is aerobic and non-impact so your legs stay fresh.',
    days: [B1_A, B1_B, B1_C, B1_D, B1_E]
  },
  {
    n: 2, name: 'Strength', weeks: [5, 6, 7, 8], color: '#f7a84f',
    tagline: 'Build the engine',
    goal: 'Maximal strength in the squat, trap bar deadlift, and press. Plyometrics step up to depth drops and real box jumps.',
    detail: 'You cannot jump higher than you can push into the floor, and this is the block that builds the push. Reps drop to 3-5, load climbs to 78-88% of your tested max. Change-of-direction work gets timed so you have a number to chase. Weighted pull-ups start here.',
    days: [B2_A, B2_B, B2_C, B2_D, B2_E]
  },
  {
    n: 3, name: 'Power', weeks: [9, 10, 11, 12], color: '#e5484d',
    tagline: 'Wire it fast',
    goal: 'Convert strength into speed. Contrast pairs, Olympic derivatives, reactive plyometrics, and max approach jumps.',
    detail: 'The strength you built in block 2 is useless on the court until it becomes fast. Contrast training pairs a heavy set with an immediate jump so your nervous system learns to recruit that force in the 0.2 seconds a takeoff actually gives you. Saturday becomes JUMP DAY — the most important session of the program.',
    days: [B3_A, B3_B, B3_C, B3_D, B3_E]
  },
  {
    n: 4, name: 'Peak', weeks: [13, 14, 15, 16], color: '#30a46c',
    tagline: 'Express it',
    goal: 'Peak intensity, minimal volume, then taper into the week 16 test battery.',
    detail: 'Volume drops off a cliff and intensity peaks. You should walk out of every session feeling sharp rather than beaten up. Week 15 is a taper and week 16 is the full test battery — you re-run every measurement from week 0 and see exactly what 16 weeks bought you.',
    days: [B4_A, B4_B, B4_C, B4_D, B4_E]
  }
];

export const TOTAL_WEEKS = 16;

/* ----------------------------------------------------------------- LOOKUPS */
export function blockForWeek(week) {
  return BLOCKS.find(b => b.weeks.includes(week)) || BLOCKS[0];
}

export function weekInBlock(week) {
  const b = blockForWeek(week);
  return b.weeks.indexOf(week); // 0..3, where 3 is the deload/test week
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
    return [
      TEST_DAY_A,
      { ...B4_B, name: 'Pull + Armor (light)', brief: 'Light maintenance between test days. Nothing heavy.' },
      { ...RECOVERY_DAY, day: 2, name: 'Recovery (pre-test)' },
      TEST_DAY_B,
      { ...B4_E, day: 5, name: 'Free Play', brief: 'Go play volleyball. Enjoy the new vertical.', optional: true },
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

/** Total planned working sets in a session (excludes prep/recovery). */
export function sessionVolume(session, wib) {
  let sets = 0;
  for (const sec of session.sections) {
    if (/prep|recovery|down-regulate|flow|tissue|aerobic/i.test(sec.name)) continue;
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

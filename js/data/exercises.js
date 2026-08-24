/**
 * Exercise library.
 *
 * loadType semantics:
 *   pct   - load derived from a tested max (see `ref`), prescription carries pct
 *   rpe   - autoregulated, prescription carries rpe target
 *   bw    - bodyweight (may carry added load)
 *   time  - held or worked for seconds
 *   plyo  - measured in ground contacts / quality reps, never to fatigue
 *   run   - distance or interval based
 */

export const EXERCISES = {
  /* ---------------------------------------------------------------- PREP */
  ankle_rock: {
    name: 'Half-Kneel Ankle Rock',
    cat: 'prep', pattern: 'mobility', loadType: 'time',
    cues: [
      'Front foot flat, drive the knee forward past the toes.',
      'Heel stays glued down — that is the whole drill.',
      'Hold 2s at end range, then back off.'
    ],
    why: 'Dorsiflexion is the gatekeeper for depth in your approach and for soft landings. Tight ankles push the load into your knees.'
  },
  hip_90_90: {
    name: '90/90 Hip Switch',
    cat: 'prep', pattern: 'mobility', loadType: 'time',
    cues: ['Sit tall, hands light on the floor.', 'Switch knees without the chest collapsing.', 'Own the top of each rep for a beat.'],
    why: 'Internal + external rotation on demand. Volleyball digs and blocks live here.'
  },
  world_greatest: {
    name: "World's Greatest Stretch",
    cat: 'prep', pattern: 'mobility', loadType: 'time',
    cues: ['Deep lunge, opposite elbow inside the foot.', 'Drive the back hip toward the floor.', 'Reach tall and rotate — eyes follow the hand.'],
    why: 'Hits hip flexors, adductors, and thoracic rotation in one shot.'
  },
  scap_pushup: {
    name: 'Scapular Push-Up',
    cat: 'prep', pattern: 'push', loadType: 'bw',
    cues: ['Arms locked the whole time.', 'Push the floor away and let the shoulder blades spread.', 'Then pinch them together. Small range, slow.'],
    why: 'Wakes up serratus anterior — the muscle that lets your shoulder blade rotate up when you swing.'
  },
  band_pullapart: {
    name: 'Band Pull-Apart',
    cat: 'prep', pattern: 'pull', loadType: 'rpe',
    cues: ['Thumbs up, arms nearly straight.', 'Pull to a T, squeeze 1s.', 'Ribs down — do not arch to finish the rep.'],
    why: 'Cheap insurance for the back of a hitter\'s shoulder.'
  },
  pogo_prep: {
    name: 'Pogo Hop (prep)',
    cat: 'prep', pattern: 'plyo', loadType: 'plyo',
    cues: ['Knees nearly straight, all ankle.', 'Bounce off the balls of the feet, quiet.', 'Think "hot pavement".'],
    why: 'Primes Achilles stiffness before anything explosive.'
  },
  leg_swings: {
    name: 'Leg Swings (front/side)',
    cat: 'prep', pattern: 'mobility', loadType: 'time',
    cues: ['Hold something stable.', 'Relaxed swing, build range gradually.', '10 each direction, each leg.'],
    why: 'Dynamic hip prep — do not static stretch before jumping.'
  },
  cat_cow: {
    name: 'Cat-Cow into Thread the Needle',
    cat: 'prep', pattern: 'mobility', loadType: 'time',
    cues: ['Move one segment at a time.', 'Thread the arm through and stack the shoulder.', 'Exhale into end range.'],
    why: 'Thoracic spine mobility feeds overhead reach.'
  },
  wall_slide: {
    name: 'Wall Slide with Lift-Off',
    cat: 'prep', pattern: 'push', loadType: 'bw',
    cues: ['Forearms on the wall, ribs down.', 'Slide up, then lift the forearms off 1 inch.', 'No shrug, no low-back arch.'],
    why: 'Trains overhead reach with the scapula doing the work instead of the low back.'
  },
  adductor_rock: {
    name: 'Adductor Rock-Back',
    cat: 'prep', pattern: 'mobility', loadType: 'time',
    cues: ['One leg out to the side, foot flat.', 'Rock the hips back and hold.', 'Keep the spine long.'],
    why: 'Groin length protects you on lateral digs.'
  },

  /* ------------------------------------------------------------- LOWER PWR */
  approach_jump: {
    name: 'Max Approach Jump',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: [
      'Full 3 or 4-step approach, exactly like a game.',
      'Last two steps fast and long — plant, block the arms, rip up.',
      'Reach and touch a real target. Stop the set the moment height drops.'
    ],
    why: 'The thing you actually want to improve. Practice it fresh, with intent, never tired.'
  },
  block_jump: {
    name: 'Block Jump (2-foot, no approach)',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: ['Load fast — quarter squat, no more.', 'Arms punch straight up, press the ceiling.', 'Land where you took off.'],
    why: 'Pure concentric expression + the jump you make most often on defense.'
  },
  depth_drop: {
    name: 'Depth Drop to Stick',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: ['Step off the box — do not jump off.', 'Land mid-foot, hips back, knees tracking out.',
      'Absorb silently and freeze 2s. Quality over height.'],
    why: 'Teaches your tendons to accept force. This is the durability half of explosiveness.'
  },
  depth_jump: {
    name: 'Depth Jump',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: ['Step off, touch and go — minimum ground time.', 'Ground contact should sound like one sound, not two.',
      'If you have to sink deep to jump, the box is too tall.'],
    why: 'Highest-return reactive drill for the stretch-shortening cycle. Also the highest cost — keep volume honest.'
  },
  box_jump: {
    name: 'Box Jump (step down)',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: ['Explode up, land soft in the same shape you took off in.',
      'Always step down — do not jump down.', 'Box height is ego; landing quality is training.'],
    why: 'Concentric power with a cheap landing. Great early-block volume.'
  },
  broad_jump: {
    name: 'Standing Broad Jump',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: ['Arms swing back, hips load, throw yourself forward.', 'Land in an athletic base and stick it.', 'Mark your best and chase it.'],
    why: 'Horizontal power transfers to your approach and your first step on defense.'
  },
  hurdle_hop: {
    name: 'Continuous Hurdle Hop',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: ['Stiff ankles, minimal knee bend.', 'Land and leave — no pause between hurdles.', 'Chest tall the whole way.'],
    why: 'Reactive stiffness. Trains the spring, not the muscle.'
  },
  pogo: {
    name: 'Pogo Hops',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: ['Ankles only, knees almost locked.', 'Fastest possible ground contact.', 'Silent and rhythmic.'],
    why: 'Builds Achilles/plantar stiffness, which is a huge chunk of a fast approach.'
  },
  snap_down: {
    name: 'Snap-Down',
    cat: 'power', pattern: 'plyo', loadType: 'plyo',
    cues: ['Stand tall on the toes, arms overhead.', 'Violently drop into an athletic quarter-squat and freeze.', 'Feet hit the floor at the same instant.'],
    why: 'Cheapest way to teach a good landing position. Do these before real jumps.'
  },
  trap_jump: {
    name: 'Trap Bar Jump',
    cat: 'power', pattern: 'hinge', loadType: 'pct', ref: 'trapbar',
    cues: ['Light load (20–30%). Jump off the floor with the bar.', 'Land soft, reset every rep.', 'If the bar barely leaves the floor, drop the weight.'],
    why: 'Loaded jump — trains force at speed, the middle of the strength-speed curve.'
  },
  hang_clean: {
    name: 'Hang Power Clean',
    cat: 'power', pattern: 'pull', loadType: 'pct', ref: 'clean',
    cues: ['Bar to mid-thigh, chest over the bar.', 'Violent hip extension — jump the bar up, do not curl it.',
      'Catch in a quarter squat with the elbows whipping through.'],
    why: 'Teaches full-body triple extension against real load. The closest barbell cousin to a block jump.'
  },
  jump_shrug: {
    name: 'Trap Bar Jump Shrug',
    cat: 'power', pattern: 'hinge', loadType: 'pct', ref: 'trapbar',
    cues: ['Extend hips, knees, ankles — then shrug hard.', 'Heels leave the floor.', 'No pulling with the arms.'],
    why: 'A cleaner-friendly Olympic derivative if you do not want to learn the catch.'
  },
  med_slam: {
    name: 'Overhead Medicine Ball Slam',
    cat: 'power', pattern: 'core', loadType: 'rpe',
    cues: ['Reach tall, then drive the ball through the floor.', 'Exhale hard on the slam.', 'Every rep at 100% or it is cardio.'],
    why: 'Trains the same overhead-to-core sequence as your swing.'
  },
  med_rot_throw: {
    name: 'Rotational Med Ball Throw',
    cat: 'power', pattern: 'core', loadType: 'rpe',
    cues: ['Load the back hip, then turn the hip before the shoulder.', 'Throw through the wall, not at it.', 'Reset between reps.'],
    why: 'Rotational power for hitting and for changing direction.'
  },
  med_scoop_toss: {
    name: 'Vertical Scoop Toss',
    cat: 'power', pattern: 'hinge', loadType: 'rpe',
    cues: ['Ball between the feet, hinge and load.', 'Toss straight up as high as you can.', 'Let it land — do not catch it.'],
    why: 'Triple extension with zero technique cost. Great as a jump primer.'
  },

  /* ------------------------------------------------------------ LOWER STR */
  back_squat: {
    name: 'Back Squat',
    cat: 'strength', pattern: 'squat', loadType: 'pct', ref: 'squat',
    cues: ['Brace like someone is about to punch you.', 'Break at the hips and knees together, knees track over the mid-foot.',
      'Drive the whole foot through the floor, hips and chest rise together.'],
    why: 'Your primary force builder. More force into the floor = more height off it.'
  },
  front_squat: {
    name: 'Front Squat',
    // Percentages for the front squat are written against the BACK squat max
    // already (roughly 85% of it), so no extra scaling is applied here.
    cat: 'strength', pattern: 'squat', loadType: 'pct', ref: 'squat',
    cues: ['Elbows high, bar in the shelf of the shoulders.', 'Stay vertical — chest up, sit straight down.', 'If the elbows drop, the set is over.'],
    why: 'Quad and upper-back dominant, and it punishes a soft torso — which is exactly what landing does.'
  },
  trap_dl: {
    name: 'Trap Bar Deadlift',
    cat: 'strength', pattern: 'hinge', loadType: 'pct', ref: 'trapbar',
    cues: ['Hips high-ish, shoulders over the bar, lats tight.', 'Push the floor down.', 'Lockout is hips and knees together, no lean-back.'],
    why: 'Max posterior-chain force with a spine-friendly bar path.'
  },
  rdl: {
    name: 'Romanian Deadlift',
    cat: 'strength', pattern: 'hinge', loadType: 'rpe',
    cues: ['Soft knees, push the hips back.', 'Bar drags the thighs, lats hold it in.', 'Stop when the hamstrings run out, not when the back rounds.'],
    why: 'Hamstrings at length. This is a hamstring-strain vaccine.'
  },
  bulgarian: {
    name: 'Bulgarian Split Squat',
    cat: 'strength', pattern: 'lunge', loadType: 'rpe',
    cues: ['Back foot elevated, front shin roughly vertical at the bottom.', 'Torso slight lean forward, hip does the work.',
      'Control down for 3s, up with intent.'],
    why: 'Single-leg strength closes the left/right gap that shows up in one-foot takeoffs.'
  },
  atg_split: {
    name: 'ATG Split Squat',
    cat: 'strength', pattern: 'lunge', loadType: 'rpe',
    cues: ['Long stance, back knee lightly kisses the floor.', 'Front heel may lift — that is fine here.', 'Full knee flexion is the point.'],
    why: 'Builds knee tolerance in deep flexion, which is where landings actually happen.'
  },
  step_up: {
    name: 'Tall Step-Up (knee-height)',
    cat: 'strength', pattern: 'lunge', loadType: 'rpe',
    cues: ['No push off the back foot. None.', 'Drive through the front leg and stand all the way up.', 'Lower for 3s.'],
    why: 'Unilateral hip and glute strength through a big range, low spinal load.'
  },
  nordic: {
    name: 'Nordic Hamstring Curl (assisted)',
    cat: 'strength', pattern: 'hinge', loadType: 'bw',
    cues: ['Anchor the ankles, hips locked straight.', 'Lower as slowly as you can control, then catch with the hands.',
      'Push back up or reset. Log the angle you can hold.'],
    why: 'The single most proven hamstring-injury reducer that exists. Non-negotiable in this plan.'
  },
  hip_thrust: {
    name: 'Barbell Hip Thrust',
    cat: 'strength', pattern: 'hinge', loadType: 'rpe',
    cues: ['Chin tucked, ribs down.', 'Finish with a hard glute squeeze, do not arch the low back.', '1s hold at the top.'],
    why: 'Glute force at end-range hip extension — the last thing that happens before you leave the floor.'
  },
  reverse_lunge: {
    name: 'Reverse Lunge',
    cat: 'strength', pattern: 'lunge', loadType: 'rpe',
    cues: ['Step back and down, front shin vertical.', 'Front foot stays flat and loaded.', 'Push the floor away to return.'],
    why: 'Knee-friendly single-leg volume; also trains the deceleration you do every landing.'
  },
  leg_curl: {
    name: 'Leg Curl (any variation)',
    cat: 'strength', pattern: 'hinge', loadType: 'rpe',
    cues: ['Slow eccentric, 3s minimum.', 'Do not let the hips fly up.', 'Squeeze the peak contraction.'],
    why: 'Direct knee-flexor work; complements the hip-dominant hinges.'
  },
  calf_raise: {
    name: 'Straight-Leg Calf Raise',
    cat: 'strength', pattern: 'calf', loadType: 'rpe',
    cues: ['Full stretch at the bottom, pause 1s.', 'Rise all the way to the top, pause 1s.', 'Slow. This is tendon work, not a bounce.'],
    why: 'Achilles capacity. Your jump is heavily ankle-driven and this is where it breaks down.'
  },
  seated_calf: {
    name: 'Seated (Bent-Knee) Calf Raise',
    cat: 'strength', pattern: 'calf', loadType: 'rpe',
    cues: ['Knee bent ~90°, this biases soleus.', 'Slow through the whole range.', 'Do not let the heel bounce off the bottom.'],
    why: 'Soleus handles most of the load in a jump landing and is almost always undertrained.'
  },
  tib_raise: {
    name: 'Tibialis Raise',
    cat: 'strength', pattern: 'calf', loadType: 'bw',
    cues: ['Heels planted, lean back against a wall.', 'Pull the toes up hard, slow down on the way back.', 'Burn is expected.'],
    why: 'Balances the calf, improves deceleration and shin-splint resistance.'
  },
  copenhagen: {
    name: 'Copenhagen Plank',
    cat: 'strength', pattern: 'core', loadType: 'time',
    cues: ['Top leg on a bench, squeeze it down.', 'Body in one line, hips up.', 'Start with the knee-supported version.'],
    why: 'Adductor strength — the top predictor of groin injuries in court athletes.'
  },

  /* --------------------------------------------------------------- UPPER */
  bench: {
    name: 'Barbell Bench Press',
    cat: 'strength', pattern: 'push', loadType: 'pct', ref: 'bench',
    cues: ['Shoulder blades tucked and down, feet driving.', 'Bar to the lower chest, elbows ~45°.', 'Push yourself away from the bar.'],
    why: 'Upper-body pressing strength, with the scapula stable — good for shoulders when done well.'
  },
  db_incline: {
    name: 'Incline DB Press',
    cat: 'strength', pattern: 'push', loadType: 'rpe',
    cues: ['30–40° bench, wrists stacked over elbows.', 'Lower until you feel a stretch, no further.', 'Press and slightly together at the top.'],
    why: 'Upper chest and front delt with a friendlier shoulder path than a barbell.'
  },
  ohp: {
    name: 'Standing Overhead Press',
    cat: 'strength', pattern: 'push', loadType: 'pct', ref: 'ohp',
    cues: ['Squeeze the glutes, ribs down — no lean-back.', 'Move the head out of the way, then back under.', 'Finish with the biceps by the ears.'],
    why: 'Overhead strength that carries to blocking and swing deceleration.'
  },
  landmine_press: {
    name: 'Half-Kneeling Landmine Press',
    cat: 'strength', pattern: 'push', loadType: 'rpe',
    cues: ['Press up and slightly forward on the arc.', 'Rib cage stays down over the pelvis.', 'Full reach at the top, let the shoulder blade travel.'],
    why: 'Overhead pattern in the scapular plane — the safest way to load a hitter\'s shoulder.'
  },
  dip: {
    name: 'Dip',
    cat: 'strength', pattern: 'push', loadType: 'bw',
    cues: ['Slight forward lean, elbows back.', 'Down to upper arms parallel, no deeper.', 'Lock out and hold the shoulder blades down.'],
    why: 'Heavy triceps and chest with bodyweight; scale with a belt.'
  },
  pushup_weighted: {
    name: 'Weighted Push-Up',
    cat: 'strength', pattern: 'push', loadType: 'bw',
    cues: ['Body in one line, glutes tight.', 'Elbows ~45°, chest to the floor.', 'Push the floor away and spread the blades at the top.'],
    why: 'Closed-chain pressing — the scapula gets to move, which the bench does not allow.'
  },
  pullup: {
    name: 'Pull-Up',
    cat: 'strength', pattern: 'pull', loadType: 'bw',
    cues: ['Start from a dead hang, shoulders active.', 'Pull the elbows to the ribs, chest to the bar.', 'Control the descent for 2s.'],
    why: 'Best bang-for-buck upper pull, and it builds the lat length you need overhead.'
  },
  chinup: {
    name: 'Chin-Up',
    cat: 'strength', pattern: 'pull', loadType: 'bw',
    cues: ['Supinated grip, shoulder width.', 'Drive the elbows down and back.', 'Chin over the bar, no kip.'],
    why: 'More biceps and a slightly stronger position than a pull-up — good for adding load.'
  },
  bb_row: {
    name: 'Barbell Row',
    cat: 'strength', pattern: 'pull', loadType: 'rpe',
    cues: ['Hinge to ~45°, back flat and locked.', 'Pull to the lower ribs, squeeze 1s.', 'No body english — the torso does not move.'],
    why: 'Heavy horizontal pull to balance all the pressing and overhead work.'
  },
  db_row: {
    name: 'Single-Arm DB Row',
    cat: 'strength', pattern: 'pull', loadType: 'rpe',
    cues: ['Long spine, hips square.', 'Pull with the elbow, not the hand.', 'Full stretch at the bottom.'],
    why: 'Unilateral back work with a big range; also anti-rotation for the trunk.'
  },
  chest_supported_row: {
    name: 'Chest-Supported Row',
    cat: 'strength', pattern: 'pull', loadType: 'rpe',
    cues: ['Chest stays on the pad the whole set.', 'Retract, then row.', '2s pause at the top of the last 2 reps.'],
    why: 'Removes the low back so the mid-back actually gets trained.'
  },
  facepull: {
    name: 'Face Pull (external rotation)',
    cat: 'strength', pattern: 'pull', loadType: 'rpe',
    cues: ['Rope to the forehead, elbows high.', 'Finish by rotating — knuckles end up behind the ears.', 'Slow, light, controlled.'],
    why: 'The highest-value shoulder-health movement for anyone who swings overhead.'
  },
  ext_rotation: {
    name: 'Side-Lying External Rotation',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Elbow pinned to the ribs, towel under it.', 'Rotate the hand toward the ceiling only.', 'Light weight, 3s down.'],
    why: 'Isolates the infraspinatus — the brake on your swing. Weak here is where shoulders fail.'
  },
  prone_ytw: {
    name: 'Prone Y-T-W',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Face down on an incline or the floor.', 'Thumbs up, lift with the mid-back not the neck.', '5 of each letter, no weight needed at first.'],
    why: 'Lower trap and rhomboid endurance — posture support for the shoulder blade.'
  },
  bottoms_up_carry: {
    name: 'Bottoms-Up KB Carry',
    cat: 'accessory', pattern: 'carry', loadType: 'rpe',
    cues: ['Bell upside down, crush the handle.', 'Walk tall, ribs down.', 'Shoulder packed — do not shrug.'],
    why: 'Reflexive shoulder stability plus grip. Cheap and highly transferable.'
  },
  farmer_carry: {
    name: 'Farmer Carry',
    cat: 'accessory', pattern: 'carry', loadType: 'rpe',
    cues: ['Heavy, tall, quiet feet.', 'Do not lean away from the load.', 'Breathe.'],
    why: 'Trunk stiffness under load, grip, and general toughness.'
  },
  curl: {
    name: 'Incline DB Curl',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Arms hanging behind the body, full stretch.', 'Curl without the elbow drifting forward.', 'Slow 3s down.'],
    why: 'Elbow health and arms. Also, you want to look shredded — arms help.'
  },
  triceps_ext: {
    name: 'Overhead Cable Triceps Extension',
    cat: 'accessory', pattern: 'push', loadType: 'rpe',
    cues: ['Elbows in and high, full stretch behind the head.', 'Lock out and squeeze.', 'No lower-back arch.'],
    why: 'Long head of the triceps at length — best growth position, and elbow-friendly.'
  },
  lat_raise: {
    name: 'Lateral Raise',
    cat: 'accessory', pattern: 'push', loadType: 'rpe',
    cues: ['Lead with the elbow, pinkie slightly up.', 'Stop at shoulder height.', 'Control the way down — no swinging.'],
    why: 'Side delts are the widest visual lever you have. Shoulders wide, waist tight.'
  },
  neck_iso: {
    name: 'Neck Isometrics (4-way)',
    cat: 'accessory', pattern: 'neck', loadType: 'time',
    cues: ['Hand or band resistance, no movement.', '10s per direction, moderate effort.', 'Breathe through it.'],
    why: 'Neck strength is a real factor in collision and fall tolerance. Takes 90 seconds.'
  },

  /* ----------------------------------------------------------------- CORE */
  hollow_hold: {
    name: 'Hollow Hold',
    cat: 'core', pattern: 'core', loadType: 'time',
    cues: ['Low back pressed flat to the floor.', 'Lower the legs only as far as you can keep it flat.', 'Breathe shallow but breathe.'],
    why: 'Anterior core in the exact shape that resists arching when you reach overhead.'
  },
  pallof: {
    name: 'Pallof Press',
    cat: 'core', pattern: 'core', loadType: 'rpe',
    cues: ['Stand tall, press straight out and hold 2s.', 'Do not let the cable rotate you an inch.', 'Squeeze glutes.'],
    why: 'Anti-rotation. Your trunk has to transmit rotational force, not leak it.'
  },
  dead_bug: {
    name: 'Weighted Dead Bug',
    cat: 'core', pattern: 'core', loadType: 'rpe',
    cues: ['Ribs down, low back flat.', 'Extend opposite arm and leg slowly.', 'Exhale fully at end range.'],
    why: 'Teaches the ribs-over-pelvis position under limb movement.'
  },
  side_plank: {
    name: 'Side Plank with Reach-Through',
    cat: 'core', pattern: 'core', loadType: 'time',
    cues: ['Stack the feet and hips.', 'Reach under and rotate, then open to the ceiling.', 'Hips stay high.'],
    why: 'Lateral trunk + oblique control for lateral movement on the court.'
  },
  hanging_leg_raise: {
    name: 'Hanging Leg Raise',
    cat: 'core', pattern: 'core', loadType: 'bw',
    cues: ['Start from a hollow hang, no swing.', 'Curl the pelvis up — feet to the bar is a bonus.', 'Lower slowly.'],
    why: 'Full-range anterior core plus grip and shoulder decompression from a hang.'
  },
  ab_wheel: {
    name: 'Ab Wheel Rollout',
    cat: 'core', pattern: 'core', loadType: 'bw',
    cues: ['Tuck the pelvis before you move.', 'Roll out only to where you can hold the tuck.', 'Pull back with the abs, not the hips.'],
    why: 'The hardest anti-extension drill you can do without equipment cost.'
  },
  suitcase_carry: {
    name: 'Suitcase Carry',
    cat: 'core', pattern: 'carry', loadType: 'rpe',
    cues: ['One heavy load, walk perfectly upright.', 'Do not hike the free hip.', 'Same distance both sides.'],
    why: 'Anti-lateral-flexion — hits the deep obliques and QL in a way planks cannot.'
  },
  bird_dog: {
    name: 'Bird Dog',
    cat: 'core', pattern: 'core', loadType: 'time',
    cues: ['Reach long, do not lift high.', 'Hips level — imagine a glass of water on your low back.', '3s hold each rep.'],
    why: 'Spinal control with cross-body coordination. Great low-cost filler.'
  },

  /* -------------------------------------------------------- SPEED & AGILITY */
  a_skip: {
    name: 'A-Skip',
    cat: 'speed', pattern: 'run', loadType: 'run',
    cues: ['Tall posture, knee up, toe up.', 'Punch the foot down under the hip.', 'Rhythmic and light.'],
    why: 'Sprint mechanics drill — teaches the front-side posture that makes you fast.'
  },
  wall_drill: {
    name: 'Wall Acceleration Drill',
    cat: 'speed', pattern: 'run', loadType: 'run',
    cues: ['Lean into the wall at ~45°, straight line ankle to head.', 'Drive one knee up, then switch fast.', 'Hold the lean — no piking.'],
    why: 'Grooves the acceleration angle without needing space.'
  },
  sprint_accel: {
    name: 'Acceleration Sprint (10–20m)',
    cat: 'speed', pattern: 'run', loadType: 'run',
    cues: ['Push, do not reach. Long first three steps.', 'Full recovery between reps — this is a power drill.', 'Stop if the times drop off.'],
    why: 'Court speed is almost entirely acceleration; you never reach top speed on a 9m court.'
  },
  flying_sprint: {
    name: 'Flying 20m Sprint',
    cat: 'speed', pattern: 'run', loadType: 'run',
    cues: ['20m build-up, 20m at true max, 20m decelerate.', 'Relax the face and hands.', 'Full recovery, 2–3 min.'],
    why: 'Top-speed exposure is the best hamstring protection there is.'
  },
  pro_agility: {
    name: '5-10-5 Pro Agility',
    cat: 'speed', pattern: 'cod', loadType: 'run',
    cues: ['Drop the hips to change direction, do not stand up.', 'Plant on the outside foot, hard.', 'Both directions equally.'],
    why: 'Change-of-direction under control — and a clean number to track.'
  },
  lateral_shuffle: {
    name: 'Lateral Shuffle + Cut',
    cat: 'speed', pattern: 'cod', loadType: 'run',
    cues: ['Low athletic stance, feet never cross.', 'Push off the trail leg.', 'Cut and accelerate out.'],
    why: 'The blocker\'s footwork pattern, trained with intent.'
  },
  reactive_shuffle: {
    name: 'Mirror / Reactive Shuffle',
    cat: 'speed', pattern: 'cod', loadType: 'run',
    cues: ['Partner or random cue leads, you react.', 'Stay square, eyes up.', '5–8s bursts.'],
    why: 'Adds a decision to the movement. Reactive agility is what actually transfers to a match.'
  },
  approach_footwork: {
    name: 'Approach Footwork Ladder',
    cat: 'speed', pattern: 'cod', loadType: 'run',
    cues: ['Slow the 4-step pattern down, then speed it up.', 'Last two steps: long, then fast and closed.', 'No ball — just the feet.'],
    why: 'Your approach is a skill. Refining the footwork is free vertical.'
  },
  crossover_step: {
    name: 'Crossover Start',
    cat: 'speed', pattern: 'cod', loadType: 'run',
    cues: ['Open the hip, cross over, go.', 'No false step backwards.', 'First step lands under the center of mass.'],
    why: 'Fastest way to cover ground sideways — the digging first step.'
  },

  /* ------------------------------------------------------------ CONDITION */
  zone2: {
    name: 'Zone 2 Aerobic (bike/row/ruck)',
    cat: 'conditioning', pattern: 'aerobic', loadType: 'run',
    cues: ['Nose-breathing pace, could hold a conversation.', 'Low impact — save the legs.', 'Steady, boring, effective.'],
    why: 'Aerobic base is what lets you recover between points and between sets. Non-impact so it does not tax the jump.'
  },
  tempo_run: {
    name: 'Tempo Runs (100m @ 70%)',
    cat: 'conditioning', pattern: 'aerobic', loadType: 'run',
    cues: ['Relaxed 70% effort, good posture.', 'Walk back as recovery.', 'Should feel easy through rep 6.'],
    why: 'Builds work capacity and running mechanics without the wear of true sprinting.'
  },
  shuttle_condition: {
    name: 'Court Shuttles (baseline-to-net)',
    cat: 'conditioning', pattern: 'cod', loadType: 'run',
    cues: ['Touch the line every time.', 'Change direction low.', 'Same effort on the last rep as the first.'],
    why: 'Repeat-sprint ability in the exact pattern volleyball demands.'
  },
  sled_push: {
    name: 'Sled Push / Bike Sprint',
    cat: 'conditioning', pattern: 'aerobic', loadType: 'run',
    cues: ['10s all-out, then full recovery.', 'Aggressive angle, drive the knees.', 'Alactic — quality every rep.'],
    why: 'Power endurance without eccentric damage. You can hammer it and still jump tomorrow.'
  },
  jump_rope: {
    name: 'Jump Rope',
    cat: 'conditioning', pattern: 'plyo', loadType: 'time',
    cues: ['Ankles doing the work, wrists turning the rope.', 'Stay on the balls of the feet.', 'Light and quiet.'],
    why: 'Doubles as calf/Achilles conditioning and coordination.'
  },

  /* ------------------------------------------------------------- RECOVERY */
  breath_down: {
    name: 'Down-Regulation Breathing',
    cat: 'recovery', pattern: 'recovery', loadType: 'time',
    cues: ['4s in through the nose, 8s out.', 'Lie down, legs elevated if you can.', '3–5 minutes.'],
    why: 'Flips you out of fight-or-flight so the training actually turns into adaptation.'
  },
  mobility_flow: {
    name: 'Full Mobility Flow',
    cat: 'recovery', pattern: 'mobility', loadType: 'time',
    cues: ['Move through every joint, unhurried.', 'Breathe into the tight spots.', 'Should feel better at the end than the start.'],
    why: 'Active recovery beats total rest for soreness and for keeping range.'
  },
  couch_stretch: {
    name: 'Couch Stretch',
    cat: 'recovery', pattern: 'mobility', loadType: 'time',
    cues: ['Back knee against a wall, tuck the pelvis.', 'Squeeze the glute on the stretching side.', '90s per side, breathe.'],
    why: 'Hip flexor and quad length — jumping and sitting both shorten these.'
  },
  walk_recovery: {
    name: 'Easy Walk',
    cat: 'recovery', pattern: 'aerobic', loadType: 'time',
    cues: ['30–45 minutes, outside, no phone if you can.', 'Nasal breathing.', 'Counts as your daily steps.'],
    why: 'Blood flow without cost. The most underrated recovery tool available.'
  },
  soft_tissue: {
    name: 'Soft Tissue (calves, quads, glutes, lats)',
    cat: 'recovery', pattern: 'recovery', loadType: 'time',
    cues: ['60–90s per area.', 'Find the tender spot, breathe, wait for it to release.', 'Not a pain contest.'],
    why: 'Temporary range improvement and it feels good. Do it while watching film.'
  },

  /* ------------------------------------------------------------- TESTING */
  test_reach: {
    name: 'Standing Reach',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Flat feet, one arm fully extended overhead.', 'Mark the highest point you can touch.', 'This is your baseline for every jump measurement.'],
    why: 'You cannot measure vertical jump without it.'
  },
  test_approach: {
    name: 'Max Approach Jump Test',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Full approach, 3 attempts, full rest between.', 'Record the best touch height.', 'Vertical = best touch minus standing reach.'],
    why: 'The headline number for this whole program.'
  },
  test_block: {
    name: 'Block Jump Test',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Two feet, no approach, no step.', '3 attempts, best touch.', 'Arms may swing.'],
    why: 'Isolates concentric power without the approach\'s elastic contribution.'
  },
  test_broad: {
    name: 'Broad Jump Test',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Both feet, stick the landing or it does not count.', 'Measure heel to start line.', 'Best of 3.'],
    why: 'Horizontal power — a cheap proxy for total lower-body output.'
  },
  test_agility: {
    name: '5-10-5 Test',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Timed, both directions, best of 2 each way.', 'Hand touches the line.', 'Full recovery between runs.'],
    why: 'Change-of-direction speed with a repeatable number.'
  },
  test_squat_3rm: {
    name: '3RM Back Squat Test',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Warm up thoroughly, then work to a hard but clean triple.', 'Stop at the first rep that looks bad.', 'Log it — the app converts it to an estimated 1RM.'],
    why: 'Safer than a true 1RM and accurate enough to drive percentages.'
  },
  test_pullup_max: {
    name: 'Max Pull-Ups',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Dead hang start, chin clearly over.', 'No kipping.', 'One all-out set.'],
    why: 'Relative upper-body strength — improves as you lean out, which is motivating.'
  },
  test_ankle: {
    name: 'Knee-to-Wall Ankle Test',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Toe from the wall, drive the knee to touch, heel down.', 'Measure toe-to-wall distance in cm.', 'Target: 10cm+ both sides.'],
    why: 'Screens the mobility restriction most likely to limit your jump and beat up your knees.'
  },
  test_measure: {
    name: 'Tape Measurements',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Cold, not after training — a pumped arm reads big and means nothing.',
      'Arm flexed at the peak, chest at the nipple line, thigh at the midpoint.',
      'Same spot, same tension, same time of day, every single time.'],
    why: 'On a gaining phase the tape is your best evidence that the weight is going where you want it. Arm, chest and thigh up while the waist holds flat is exactly the picture you are after.'
  },
  test_bodycomp: {
    name: 'Body Composition Check',
    cat: 'test', pattern: 'test', loadType: 'time',
    cues: ['Morning, fasted, after the bathroom.', 'Weight, navel waist measurement, 3 photos (front/side/back).', 'Same conditions every time or the data is noise.'],
    why: 'Weight alone lies. Waist, measurements and photos tell the truth.'
  },

  /* ------------------------------------------------------ MASS: LOWER */
  leg_press: {
    name: 'Leg Press',
    cat: 'strength', pattern: 'squat', loadType: 'rpe',
    cues: ['Feet mid-platform, knees track over the toes.',
      'Come down until the hips just start to tuck, then stop.',
      'Do not lock the knees out hard at the top — stay under tension.'],
    why: 'Lets you pile on quad volume without the spinal and stabiliser cost of another squat. For a tall lifter this is where a lot of leg size actually comes from.'
  },
  hack_squat: {
    name: 'Hack Squat',
    cat: 'strength', pattern: 'squat', loadType: 'rpe',
    cues: ['Back flat on the pad, feet low on the platform.', 'Sink deep — the machine supports you, use the range.',
      'Drive through the whole foot, no heel lift.'],
    why: 'The most quad-biased loaded squat pattern there is. If you only have a leg press, use that instead.'
  },
  leg_ext: {
    name: 'Leg Extension',
    cat: 'accessory', pattern: 'squat', loadType: 'rpe',
    cues: ['Squeeze hard at full extension for a beat.', 'Lower for 3 seconds, no clanging the stack.',
      'Point the toes up to bias the quad.'],
    why: 'The only movement that loads the quad at short length. Cheap growth with almost no systemic fatigue.'
  },
  walking_lunge: {
    name: 'Walking Lunge',
    cat: 'strength', pattern: 'lunge', loadType: 'rpe',
    cues: ['Long stride, front shin close to vertical.', 'Drive straight up out of the bottom.',
      'Keep the torso tall — no falling forward.'],
    why: 'Loaded single-leg work through a long stride. Adds glute and quad size and doubles as usable court strength.'
  },
  pause_squat: {
    name: 'Pause Squat',
    cat: 'strength', pattern: 'squat', loadType: 'pct', ref: 'squat',
    cues: ['Full 2-second dead stop at the bottom.', 'Stay braced through the pause — do not relax and bounce.',
      'Explode out of the hole.'],
    why: 'Kills the stretch reflex so the muscle does all the work. Builds strength exactly where you are weakest.'
  },
  seated_leg_curl: {
    name: 'Seated Leg Curl',
    cat: 'strength', pattern: 'hinge', loadType: 'rpe',
    cues: ['Hips strapped down, torso upright.', 'Curl hard, hold the peak a beat, lower for 3 seconds.',
      'Do not let the hips rise to help.'],
    why: 'Trains the hamstring at long muscle length, which is where most of its growth comes from — and it is the single best hamstring hypertrophy machine.'
  },
  lying_leg_curl: {
    name: 'Lying Leg Curl',
    cat: 'accessory', pattern: 'hinge', loadType: 'rpe',
    cues: ['Hips pressed into the pad.', 'Full range, controlled negative.', 'Point the toes to shift work into the hamstring.'],
    why: 'Complements the seated version by loading the hamstring at short length. Different stimulus, same muscle.'
  },
  back_ext: {
    name: '45° Back Extension',
    cat: 'accessory', pattern: 'hinge', loadType: 'rpe',
    cues: ['Round down slowly, then extend to a straight line and stop.',
      'Squeeze the glutes to finish, not the low back.', 'Hug a plate to add load.'],
    why: 'Glutes, hamstrings and spinal erectors with almost no fatigue cost. Great volume filler on a hinge day.'
  },

  /* ------------------------------------------------------ MASS: PUSH */
  incline_bb_press: {
    name: 'Incline Barbell Press',
    cat: 'strength', pattern: 'push', loadType: 'pct', ref: 'bench',
    cues: ['Bench at 30°, shoulder blades tucked down.', 'Bar to the upper chest, elbows about 45°.',
      'Press in a slight arc back over the shoulders.'],
    why: 'Upper chest and front delt with a heavy barbell. Percentages here run off your flat bench max.'
  },
  db_flat_press: {
    name: 'Flat DB Press',
    cat: 'strength', pattern: 'push', loadType: 'rpe',
    cues: ['Wrists stacked over the elbows.', 'Lower until you feel a real chest stretch, no further.',
      'Press up and slightly together.'],
    why: 'More range than a barbell and each side works independently. Kinder to a tall lifter\'s shoulders.'
  },
  cable_fly: {
    name: 'Cable Fly',
    cat: 'accessory', pattern: 'push', loadType: 'rpe',
    cues: ['Slight forward lean, soft elbows held at one angle.', 'Bring the hands together and squeeze for a beat.',
      'Control the stretch — this is where the growth is.'],
    why: 'Loads the chest at long length with constant tension, which pressing alone never does.'
  },
  db_ohp: {
    name: 'Seated DB Shoulder Press',
    cat: 'strength', pattern: 'push', loadType: 'rpe',
    cues: ['Back supported, ribs down.', 'Press to full reach without clanging the bells together.',
      'Lower until the elbows are just below shoulder height.'],
    why: 'Front and side delt volume with a friendlier path than a barbell — good for shoulders that swing all week.'
  },
  pushdown: {
    name: 'Triceps Pushdown',
    cat: 'accessory', pattern: 'push', loadType: 'rpe',
    cues: ['Elbows pinned to the ribs.', 'Lock out fully and squeeze.', 'Let the weight stretch the triceps at the top.'],
    why: 'High-volume triceps work with no elbow stress. Pairs with an overhead variation for full coverage.'
  },
  skullcrusher: {
    name: 'EZ-Bar Skullcrusher',
    cat: 'accessory', pattern: 'push', loadType: 'rpe',
    cues: ['Lower to just behind the head, not to the forehead.', 'Elbows stay pointed at the ceiling.',
      'Stop short of a hard lockout to keep tension.'],
    why: 'Loads the long head of the triceps at length, which is the biggest of the three and the one that adds arm size.'
  },
  close_grip_bench: {
    name: 'Close-Grip Bench Press',
    cat: 'strength', pattern: 'push', loadType: 'rpe',
    cues: ['Hands just inside shoulder width — not narrow.', 'Elbows tucked, bar to the lower chest.',
      'Drive with the triceps.'],
    why: 'Lets you load the triceps heavily with a compound. Adds pressing strength and arm mass at once.'
  },

  /* ------------------------------------------------------ MASS: PULL */
  lat_pulldown: {
    name: 'Lat Pulldown',
    cat: 'strength', pattern: 'pull', loadType: 'rpe',
    cues: ['Slight backward lean, chest proud.', 'Pull the bar to the collarbone, elbows down and back.',
      'Let the shoulder blades rise fully at the top for a real stretch.'],
    why: 'Lets you train the lats to failure safely once weighted pull-ups get heavy. Full stretch at the top is the point.'
  },
  cable_row: {
    name: 'Seated Cable Row',
    cat: 'strength', pattern: 'pull', loadType: 'rpe',
    cues: ['Chest up, no rocking from the hips.', 'Pull to the navel, squeeze for a beat.',
      'Let the arms extend fully and the blades spread on the way out.'],
    why: 'Constant tension through the whole range makes it a better mid-back builder than most barbell rows.'
  },
  pullover: {
    name: 'Cable Pullover',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Hinge slightly, arms nearly straight.', 'Pull the handle down to the thighs using only the lats.',
      'Full overhead stretch at the top.'],
    why: 'Isolates the lat in a way no row does. Builds the width that makes a waist look small.'
  },
  rear_delt_fly: {
    name: 'Rear Delt Fly',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Chest supported or hinged over, thumbs down.', 'Lead with the elbows, stop at shoulder level.',
      'Light weight — this is a small muscle.'],
    why: 'Rear delts balance out all the pressing, hold your shoulders back, and are half of what makes delts look round.'
  },
  shrug: {
    name: 'DB Shrug',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Straight up, not rolling.', 'Hold the top for a full second.', 'Full stretch at the bottom.'],
    why: 'Upper traps fill out the frame between neck and shoulders, and they take real load for a jumping athlete.'
  },
  preacher_curl: {
    name: 'Preacher Curl',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Upper arms flat on the pad.', 'Do not fully straighten at the bottom under heavy load.',
      'Slow 3-second negative.'],
    why: 'Biceps at short length with zero cheating. Pair with incline curls to cover both ends of the range.'
  },
  hammer_curl: {
    name: 'Hammer Curl',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Neutral grip throughout.', 'Elbows stay at your sides.', 'No swinging — control both directions.'],
    why: 'Hits the brachialis, which sits under the biceps and pushes it up. This is the one that makes arms look thick.'
  },
  cable_curl: {
    name: 'Cable Curl',
    cat: 'accessory', pattern: 'pull', loadType: 'rpe',
    cues: ['Constant tension, no rest at the bottom.', 'Elbows fixed in place.', 'Squeeze at the top.'],
    why: 'Cables keep load on the biceps through the whole range, which free weights lose at the top and bottom.'
  },
  cable_crunch: {
    name: 'Cable Crunch',
    cat: 'core', pattern: 'core', loadType: 'rpe',
    cues: ['Kneel, rope behind the head, hips fixed.', 'Crunch by rounding the spine, not by hinging at the hips.',
      'Squeeze hard at the bottom.'],
    why: 'The only way to train abs with progressive load. Abs are muscles — grow them like any other.'
  }
};

export function ex(id) {
  const e = EXERCISES[id];
  if (!e) return { name: id, cues: [], why: '', cat: 'other', loadType: 'rpe' };
  return e;
}

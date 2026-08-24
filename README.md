# Above the Net

A training app for a 6'3" volleyball player, plus the program it runs.

The current program is **Frame** — 24 weeks to go from 190 lb to a lean 200, adding real muscle without giving up the jump, the speed or the durability.

The app is a Progressive Web App: no install, no account, no build step. Open it in your phone browser, add it to your home screen, and it runs full-screen and fully offline. Every set you log stays on your device.

---

## Getting it on your phone

**Fastest path — GitHub Pages.** In this repo: Settings → Pages → Source: "Deploy from a branch" → branch `claude/fitness-app-volleyball-workouts-y5pqgb`, folder `/ (root)`. Give it a minute, then open the URL it gives you on your phone.

**iPhone:** open that URL in Safari → Share button → *Add to Home Screen*.
**Android:** open in Chrome → three-dot menu → *Install app*.

**Running it locally** (any static server; ES modules need HTTP, not `file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

There is also a single-file build at `dist/above-the-net.html` — one self-contained page you can open from anywhere.

---

## The goal, and what is actually achievable

| | |
|---|---|
| Height | 6'3" (75 in) |
| Starting weight | 190 lb |
| Target | 200 lb, lean |
| Sport | Volleyball, played often |

**Ten pounds of muscle takes about six months, and that is why the program is 24 weeks.** A trained lifter adds roughly 0.3–0.5 lb of mostly-lean weight per week. Past that, the surplus stops becoming muscle and starts becoming fat — you would hit 200 lb in three months and then spend three more dieting back down to look the way you wanted at the start.

At the planned rate of 0.45 lb a week, 190 → 200 lb is about 23 weeks. The program runs 24. That is not a coincidence; the two were built to land together.

Expect roughly 6–8 lb of lean mass and 2–4 lb of fat over the six months. If you want to be sharper at the end than the arithmetic implies, run a four-week cut after week 24 — the Fuel tab has a "Lean out" goal for exactly that.

---

## The program

Six four-week blocks (three loading weeks, one deload), grouped into three eight-week phases.

### Phase 1 · Build the base — weeks 1–8

**Block 1 "Base"** teaches the patterns: full range, two reps in reserve, no chasing load. **Block 2 "Volume"** is the highest set count in the program, on the same exercises so you can watch the same numbers move. This phase drives the first visible change.

### Phase 2 · Add the load — weeks 9–16

**Block 3 "Load"** brings in percentage work at 78–86% on the squat, bench and trap bar, with weighted pull-ups as the primary pull. Muscle you cannot load eventually stops growing, so this raises the ceiling. **Block 4 "Grow"** returns to hypertrophy rep ranges, now 10–15% heavier across the board. This is usually where people start asking whether you have been working out.

### Phase 3 · Fill the frame — weeks 17–24

**Block 5 "Density"** adds effort rather than more sets: myo-reps on the leg press, drop sets on isolation work, rests compressed to 45–60 seconds on anything small. Primaries stay heavy and fully rested. **Block 6 "Consolidate"** peaks at 85–90%, pulls volume back so the new muscle expresses as strength, tapers in week 23, and retests everything in week 24.

### The weekly shape

| Day | Session | What it's for |
|---|---|---|
| Mon | Lower — squat focus | Squat, leg press, quad volume |
| Tue | Upper — push focus | Incline pressing, dumbbells, side delts |
| Wed | **Jump & Move** | Short. Protects the athlete while the rest builds the muscle |
| Thu | Lower — hinge focus | RDLs, hamstrings from both ends, glutes |
| Fri | Upper — pull focus | Pull-ups, rows, rear delts, arms |
| Sat | Pump & Patch *(optional)* | Arms, delts, calves, core. The one to drop when busy |
| Sun | Recovery flow | Mobility, walk, breathing |

The five main sessions are the program. Saturday is optional and does not hold your week back.

Weekly hard sets land around 14 per pattern in block 1 and 26 at peak — squarely in the productive range for hypertrophy. Sessions run 50–85 minutes.

### Why the Wednesday jump session never gets cut

This is the part most mass programs get wrong for an athlete. Ten pounds of muscle should make you jump higher; ten pounds of anything else makes you slower. The Wednesday session — max approach jumps, pogos, loaded jumps, court footwork — is short, low-fatigue, and runs all 24 weeks. The Progress tab tracks your approach jump, block jump, broad jump and 5-10-5 as guardrails: holding them steady while you add 10 lb means the weight is muscle.

The durability work also stays — Nordic curls, soleus and tibialis work, Copenhagen planks, and rotator-cuff work every upper day. Volleyball is an overhead sport with no natural counterbalance, and getting heavier does not change that.

---

## How the app works

**Percentage-driven loads.** Enter a 3-rep max in Settings; the app converts it to an estimated 1RM (Epley) and calculates every working weight across all 24 weeks from it. Working sets also show their warm-up ramp.

**Starting weights for autoregulated lifts.** Blocks 1, 2 and 4 prescribe by RPE rather than percentage. With no history, the app estimates a starting weight from your tested max via the reps/RPE chart (10 reps at RPE 7 ≈ 67% of 1RM). For machine and cable work with no 1RM to work from, it tells you plainly how to pick the first weight and takes over once you have logged it.

**Progression that notices.** The app estimates your 1RM from every set you log, and when your logs imply you have outgrown a stored max it offers to update it — and every percentage in the program moves with it.

**The surplus check.** This is the feature that matters most on a gaining phase. Log your bodyweight a few times a week and the app fits a trend line through it, compares your actual rate of gain against the plan, and tells you to eat 250 more or 250 fewer calories. A surplus you never verify is just a guess.

**The tape.** Progress tracks chest, arm, thigh and waist alongside bodyweight. Weight going up only tells you the surplus works; arm and chest climbing while the waist stays flat tells you it is working *correctly*.

**Rest timer** starts automatically when you check off a set. **Tap any exercise** for coaching cues, why it is in the program, and your full history on it with estimated 1RMs.

**Your data** lives in this device's local storage and nowhere else. Export a JSON backup from the More tab before switching phones.

---

## Fueling

Targets at 190 lb (recalculated as you go):

| | Training day ×5 | Rest day ×2 |
|---|---|---|
| Calories | 3,540 | 3,360 |
| Protein | 190 g | 190 g |
| Carbs | 502 g | 457 g |
| Fat | 86 g | 86 g |

Maintenance is about 3,260 kcal. The weekly average of 3,489 is a surplus of roughly 1,600 kcal a week — about 0.46 lb. Training days carry the bigger surplus because that is the food you can actually use.

Those carb numbers are large and they are meant to be. Carbs fuel the training that causes the growth and they are far easier to eat in volume than fat or protein.

**The hard part is not the training, it is eating in a surplus for six months.** A surplus stops feeling like one after two weeks. Eat on a schedule rather than on hunger, and when solid food stops going down, drink it — the Fuel tab has an 800-calorie shake for exactly that.

Supplements worth the money: creatine monohydrate (5 g daily), whey as a convenience, vitamin D3 if you train indoors. Everything else is situational or useless.

---

## Testing

Run the battery before week 1, then again at weeks 8, 16 and 24. Same order, same conditions, every time.

**Session 1 — size and athleticism.** Bodyweight and tape measurements first, cold, before anything else. Then standing reach, ankle mobility, approach jump, block jump, broad jump, and a timed 5-10-5.

**Session 2 — strength, 48 hours later.** Work up to a hard-but-clean 3RM in the back squat, trap bar deadlift, bench press and overhead press. One all-out set of pull-ups. Enter the 3RMs and the app re-prescribes everything.

If you would rather not test 3RMs, estimate conservatively in Settings and let the auto-progression find the real numbers over the first two weeks.

---

## The rules that make it work

1. **Progressive overload is the whole program.** Beat the log — one more rep, or five more pounds at the same reps.
2. **Last set close to failure** on isolation work. One or two in reserve on the big compounds.
3. **Full range beats heavy partials.** Long limbs mean long ranges and more growth per rep.
4. **Eat like it is part of training.** Missing the surplus for a week undoes that week more thoroughly than skipping a session would.
5. **Jumps stay in, every week.** The difference between athletic weight and just getting heavier.
6. **Deload weeks are not optional.** Week 4 of each block is where the work turns into muscle.
7. **Log every set.** Beating the log is only possible if there is a log.
8. **Drop the Pump day, never the main five.**
9. **Sleep eight hours.** In a surplus, short sleep shifts what you gain toward fat regardless of macros.

---

## Project layout

```
index.html                 app shell
manifest.webmanifest       PWA manifest
sw.js                      service worker — precaches everything for offline use
css/app.css                all styling
js/app.js                  router, tab bar, boot
js/store.js                state, persistence, e1RM math, progression, weight trend
js/ui.js                   DOM helpers, SVG charts, rest timer, sheets, toasts
js/data/program.js         the 24-week plan — blocks, schemes, session templates
js/data/exercises.js       121 movements with cues and rationale
js/data/nutrition.js       surplus model, rate-of-gain autoregulation, fueling guidance
js/views/                  today, plan, progress, fuel, settings
tools/smoke.mjs            headless browser test — walks all 167 sessions
tools/bundle.mjs           emits the single-file build
```

### How the program is defined

`js/data/program.js` separates *what* you do from *how hard*:

- **Day templates** (`P1`, `P2`, `P3`) list exercises per session, each tagged with a role — `primary`, `secondary`, `accessory`, `isolation`, `calf`, `core`, `plyo`. Exercise selection rotates every eight weeks.
- **Schemes** (one per block) say what each role means that block: sets, reps, RPE or percentage, and rest.
- The generator combines them. Percentage loading is applied only where a movement actually references a tested max, so a leg press falls back to RPE automatically instead of silently producing a nonsense number.

Prescription values are a scalar or a 4-element array indexed by week-within-block, so `pct: [0.78, 0.82, 0.86, 0.70]` loads for three weeks and deloads on the fourth.

Changing the whole feel of a block means editing one scheme. Changing an exercise means editing one template line.

### Running the tests

```bash
npm install -D playwright && npx playwright install chromium
python3 -m http.server 8817 &
node tools/smoke.mjs          # CHROME_PATH=... to use an existing browser
node tools/bundle.mjs         # rebuild dist/above-the-net.html
```

The smoke test drives the real UI in Chromium, then validates every one of the ~2,160 prescribed items across all 167 sessions: unknown exercise ids, missing cues, bad set counts, percentage loads that fail to resolve, implausible session durations, hypertrophy volume below a productive threshold, and any loading week that lost its jump work.

---

*General fitness guidance, not medical advice. Sharp or persistent pain means see a professional, not push through it.*

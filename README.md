# Above the Net

A 16-week block-periodized training program and the phone app that runs it — built for a 6'3", 190 lb volleyball player who wants to get shredded without giving up a single inch of vertical.

The app is a Progressive Web App: no install, no account, no build step. Open it in your phone browser, add it to your home screen, and it runs full-screen and fully offline. Every set you log stays on your device.

---

## Getting it on your phone

**Fastest path — GitHub Pages.** In this repo: Settings → Pages → Source: "Deploy from a branch" → branch `claude/fitness-app-volleyball-workouts-y5pqgb`, folder `/ (root)`. Give it a minute, then open the URL it gives you on your phone.

**iPhone:** open that URL in Safari → Share button → *Add to Home Screen*.
**Android:** open in Chrome → three-dot menu → *Install app*.

Once it's on your home screen it works with no signal, which matters because gym basements never have any.

**Running it locally** (any static server; ES modules need HTTP, not `file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Your starting point

| | |
|---|---|
| Height | 6'3" (75 in) |
| Weight | 190 lb |
| Sport | Volleyball, played often |
| Goal | Shredded, fast, explosive, durable |

At 6'3" and 190 lb you are already lean. That's the key strategic fact, and it's why this is **not** a cut. Aggressively dieting from here would cost you the muscle that produces your jump, and you'd end up lighter, flatter, and easier to injure. Instead this is a **recomposition**: a deliberately small deficit, high protein, high carbs, and heavy enough training that the weight you lose is fat while your strength climbs.

The target is roughly 181–184 lb by week 16 at a visibly lower body fat, with a higher vertical and better numbers on every athletic test. Slow on purpose.

---

## The program

Four four-week blocks. Each loads for three weeks and unloads on the fourth, which is where the adaptation actually shows up. Five sessions a week, assuming you're also on the court 2–3 times.

### Block 1 · Foundation — weeks 1–4 · *Build the chassis*

Tempo work (3 seconds down), isometric holds, and controlled unilateral loading. Plyometrics stay low and landing-focused: snap-downs and box jumps where you always step down.

This block feels too slow. That's the point — four weeks of eccentric loading builds the tendon stiffness and connective-tissue tolerance that lets you absorb depth jumps in block 3 without your knees complaining. Conditioning is aerobic and non-impact so your legs stay fresh for volleyball.

### Block 2 · Strength — weeks 5–8 · *Build the engine*

Reps drop to 3–5, load climbs to 78–88% of your tested max. Depth drops enter (step off, land silently, freeze). Change-of-direction work gets timed. Weighted pull-ups start.

You cannot jump higher than you can push into the floor. This is the block that builds the push.

### Block 3 · Power — weeks 9–12 · *Wire it fast*

Contrast pairs — a heavy squat at 88%, rest 40 seconds, then a max block jump. Olympic derivatives (hang power cleans, or trap bar jump shrugs if you haven't been coached on the catch). Reactive plyometrics: depth jumps, continuous hurdle hops.

Strength is useless on the court until it's fast. Takeoff gives you about 0.2 seconds to produce force, and contrast training is what teaches your nervous system to dump everything into that window. Saturday becomes **JUMP DAY** — the most important session in the program.

### Block 4 · Peak — weeks 13–16 · *Express it*

Volume falls off a cliff, intensity peaks at 90–93%. You should leave every session sharp, not wrecked. Week 15 tapers, week 16 re-runs the full test battery.

### The weekly shape

| Day | Session | What it's for |
|---|---|---|
| Mon | Lower power + upper push | Heaviest squat day, paired with jumps |
| Tue | Upper pull + shoulder armor + core | Back volume and the rotator-cuff work that keeps you swinging |
| Wed | Court speed + conditioning | Acceleration, cutting, aerobic base |
| Thu | Posterior chain + single leg | Hinges, Nordics, closing the left/right gap |
| Sat | Full-body power / JUMP DAY | Triple extension and max jumps |
| Sun | Recovery flow | Mobility, walk, breathing. Optional but do it |

Every session opens with 8 minutes of movement prep and closes with a 5-minute **durability block** — calves, tibialis, adductors, rotator cuff, neck. It is the least fun part of the program and the reason you stay on the court.

---

## Why these exercises

The program is built around what actually limits a volleyball player, not what looks good in a gym.

- **Nordic hamstring curls** appear in almost every lower session. They're the single best-evidenced hamstring-injury reducer that exists, and hamstring strains end seasons.
- **Soleus work** (seated, bent-knee calf raises) because the soleus absorbs most of the load in a jump landing and is almost universally undertrained.
- **Tibialis raises** to balance the calf — deceleration capacity and shin-splint resistance.
- **Copenhagen planks** for adductor strength, the top predictor of groin injury in court athletes.
- **Face pulls, side-lying external rotations, prone Y-T-W** every upper day. Volleyball is an overhead sport with no natural counterbalance; this is the counterbalance.
- **Ankle dorsiflexion work** because tight ankles cap your approach depth and shove the load into your knees.
- **Depth drops before depth jumps.** You learn to land before you learn to rebound.
- **Approach jumps trained as a skill** — fresh, measured, against a real target, and stopped the moment height drops.

---

## How the app works

**Percentage-driven loads.** Enter a 3-rep max in Settings; the app converts it to an estimated 1RM (Epley) and calculates every working weight across all 16 weeks from it. A working set also shows its warm-up ramp — 40/55/70/85% for the given weight.

**Autoregulated loads.** Movements prescribed by RPE instead of percentage suggest a weight from your last logged session, nudged up when you logged it below the target effort.

**Progression that notices.** The app watches your logged sets, estimates your 1RM from every one of them, and when your logs imply you've outgrown a stored max it offers to update it — and every percentage in the program moves with it.

**Rest timer** starts automatically when you check off a set, with the prescribed rest for that movement. ±15 s, skip, audible and haptic at zero.

**Tap any exercise** for its coaching cues, an explanation of why it's in the program, and your full history on that movement with estimated 1RMs.

**Progress tab** tracks approach jump, block jump, broad jump, 5-10-5 agility, bodyweight, waist, pull-ups, and ankle mobility, plus estimated 1RM trends and weekly tonnage. Tonnage dipping on a deload week is the plan working, not a problem.

**Fuel tab** computes your calorie and macro targets from your bodyweight, height, age, and training load, and splits them into training-day and rest-day numbers. Update your weight and everything recalculates.

**Your data** lives in this device's local storage and nowhere else. Export a JSON backup from the More tab before switching phones.

---

## Fueling, in short

Targets at 190 lb (the app recalculates as you change):

| | Training day ×5 | Rest day ×2 |
|---|---|---|
| Calories | 3,110 | 2,760 |
| Protein | 190 g | 190 g |
| Carbs | 417 g | 329 g |
| Fat | 76 g | 76 g |

Maintenance is about 3,260 kcal. The weekly average lands near 3,010 — roughly a 1,700 kcal deficit per week, or half a pound of fat. Training days sit just under maintenance so performance never dips; rest days carry the deficit.

Carbs stay high deliberately. A max approach jump runs almost entirely on stored glycogen, and cutting carbs is the fastest way to feel flat on the court.

Supplements worth the money: creatine monohydrate (5 g daily), protein powder as a convenience, vitamin D3 if you train indoors. Caffeine and collagen are situational. Fat burners, BCAAs, and test boosters do nothing — spend it on food.

---

## Testing

Run the battery before week 1, again after week 8, and again in week 16. Same order and same conditions every time or the numbers are noise.

**Session 1 — performance.** Standing reach first (every jump number is relative to it), knee-to-wall ankle test, then approach jump, block jump, broad jump — three attempts each with full rest — then a timed 5-10-5. Finish with weight, waist at the navel, and three photos.

**Session 2 — strength, 48 hours later.** Work up to a hard-but-clean 3RM in the back squat, trap bar deadlift, bench press, and overhead press. One all-out set of pull-ups. Enter the 3RMs and the app re-prescribes everything.

If you'd rather not test 3RMs, estimate conservatively in Settings and let the auto-progression find the real numbers over the first two weeks. It will.

---

## The rules that make it work

1. **Jumps and sprints go first**, while you're fresh. A tired jump trains you to jump tired.
2. **On power work, output is the rep target.** The set ends when height or speed drops, whatever the prescription says.
3. **Never skip the durability block.** Five minutes. It's why you finish the program.
4. **Deload weeks are not optional.** Skipping week 4 of a block is how people plateau in week 9.
5. **Log every set.** The app can't progress loads it never saw.
6. **If something hurts, change it.** Tendon soreness that fades during the warm-up is fine. Pain that worsens as you go is not — swap the movement.
7. **Sleep eight hours.** Below seven, your jump height, reaction time, and injury risk all measurably worsen and no amount of training compensates.

---

## Project layout

```
index.html                 app shell
manifest.webmanifest       PWA manifest
sw.js                      service worker — precaches everything for offline use
css/app.css                all styling
js/app.js                  router, tab bar, boot
js/store.js                state, persistence, e1RM math, progression logic
js/ui.js                   DOM helpers, SVG charts, rest timer, sheets, toasts
js/data/program.js         the 16-week plan — blocks, sessions, prescriptions
js/data/exercises.js       exercise library — cues and rationale for each movement
js/data/nutrition.js       calorie/macro model and fueling guidance
js/views/                  today, plan, progress, fuel, settings
tools/smoke.mjs            headless browser test — walks all 96 sessions
```

Editing the program means editing `js/data/program.js`. Prescription values can be a scalar or a 4-element array indexed by week-within-block, so `pct: [0.78, 0.82, 0.86, 0.70]` loads for three weeks and deloads on the fourth.

### Running the tests

```bash
npm install -D playwright && npx playwright install chromium
python3 -m http.server 8817 &
node tools/smoke.mjs          # CHROME_PATH=... to use an existing browser
```

It drives the real UI in Chromium, then validates every one of the ~1,250 prescribed items across all 96 sessions — unknown exercise ids, missing cues, bad set counts, percentage loads that fail to resolve, implausible session durations.

---

*General fitness guidance, not medical advice. Sharp or persistent pain means see a professional, not push through it.*

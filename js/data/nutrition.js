/**
 * Fueling model for a lean-mass-preserving recomposition in a jumping athlete.
 *
 * The whole strategy: a small enough deficit that you never lose explosiveness,
 * carbs kept high because a vertical jump is glycogen-dependent, and protein
 * high enough that the weight you lose is fat and not the muscle you need.
 */

export function computeTargets({ weightLb = 190, heightIn = 75, age = 28, activity = 1.7 } = {}) {
  const kg = weightLb / 2.2046;
  const cm = heightIn * 2.54;
  const bmr = Math.round(10 * kg + 6.25 * cm - 5 * age + 5);
  const tdee = Math.round(bmr * activity);

  // Training days sit just under maintenance; rest days carry the deficit.
  const trainKcal = Math.round((tdee - 150) / 10) * 10;
  const restKcal = Math.round((tdee - 500) / 10) * 10;

  const protein = Math.round(weightLb * 1.0);      // 1.0 g/lb — protects lean mass in a deficit
  const fat = Math.round(weightLb * 0.4);          // 0.4 g/lb — floor for hormones, no higher
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;

  const trainCarb = Math.round((trainKcal - proteinKcal - fatKcal) / 4);
  const restCarb = Math.round((restKcal - proteinKcal - fatKcal) / 4);

  return {
    bmr, tdee,
    train: { kcal: trainKcal, protein, fat, carb: trainCarb },
    rest: { kcal: restKcal, protein, fat, carb: restCarb },
    weeklyAvg: Math.round((trainKcal * 5 + restKcal * 2) / 7),
    deficitPerWeek: Math.round(tdee * 7 - (trainKcal * 5 + restKcal * 2)),
    water: Math.round(weightLb * 0.6),             // fl oz baseline, more on court days
    fiber: Math.round((trainKcal / 1000) * 14),
    sodium: '4-6 g/day — you sweat a lot on the court and cramping kills jumps'
  };
}

export function projectedWeight(startLb, weeks, deficitPerWeek) {
  // ~3,500 kcal per lb of fat, tempered because you will add some lean mass.
  const fatLost = (deficitPerWeek * weeks) / 3500;
  const leanGained = weeks * 0.09; // realistic recomp rate for a trained athlete
  return +(startLb - fatLost + leanGained).toFixed(1);
}

export const RULES = [
  {
    t: 'Protein at every meal',
    d: 'Four feedings of 45-55 g beats two of 100 g. Hit the number, spread it out, and the weight you lose comes off fat instead of the legs you jump with.'
  },
  {
    t: 'Carbs are performance, not the enemy',
    d: 'A max approach jump runs almost entirely on stored glycogen. Cutting carbs is the fastest way to feel flat on the court. Keep them high — especially around training.'
  },
  {
    t: 'Front-load the day, fuel the session',
    d: '40-60 g of carbs and 30 g of protein in the 90 minutes before you train. Another 60-80 g of carbs plus 40 g of protein inside an hour after. The rest fills in around it.'
  },
  {
    t: 'Rest days carry the deficit',
    d: 'On non-training days you do not need the fuel, so that is where the calories come out. Training days stay near maintenance so performance never dips.'
  },
  {
    t: 'Half a pound a week, no faster',
    d: 'Aggressive cuts cost you vertical inches and invite injury. At this rate you will be visibly leaner by week 8 and still setting PRs in week 16.'
  },
  {
    t: 'Weigh yourself the same way every time',
    d: 'Morning, after the bathroom, before food. Track the 7-day average and ignore any single day — daily swings of 3-4 lb are water, not fat.'
  },
  {
    t: 'Sleep is the whole game',
    d: '8 hours minimum, 9 in the power block. Under 7 hours and your reaction time, jump height, and injury risk all measurably get worse. No supplement comes close.'
  },
  {
    t: 'Hydrate before you are thirsty',
    d: 'Roughly 0.6 oz per pound of bodyweight as a floor, plus 20-30 oz per hour of court time. Add salt. Dehydration of just 2% bodyweight drops power output.'
  }
];

export const SUPPLEMENTS = [
  { n: 'Creatine monohydrate', d: '5 g daily, timing irrelevant. The single best-evidenced legal ergogenic for power athletes. Cheap. Take it.', tier: 'Worth it' },
  { n: 'Whey or casein protein', d: 'Not magic — just a convenient way to hit 190 g without eating six chicken breasts.', tier: 'Worth it' },
  { n: 'Vitamin D3 + K2', d: '2,000-4,000 IU if you train indoors. Low D is linked to worse muscle function and more injuries.', tier: 'Worth it' },
  { n: 'Caffeine', d: '3-6 mg/kg roughly 45 min pre-session. Real effect on power output. Skip it before evening sessions or your sleep pays.', tier: 'Situational' },
  { n: 'Collagen + vitamin C', d: '15 g with 50 mg vitamin C about 45 min before jump sessions. Evidence is early but promising for tendon.', tier: 'Situational' },
  { n: 'Tart cherry / beetroot', d: 'Modest recovery and endurance effects. Fine during tournaments, not worth a monthly subscription.', tier: 'Situational' },
  { n: 'Fat burners, BCAAs, testosterone boosters', d: 'You already eat enough protein for BCAAs to be pointless, and the rest do not work. Spend the money on food.', tier: 'Skip' }
];

export const MEAL_TEMPLATE = [
  {
    when: 'Breakfast', kcal: '~750',
    what: '4 whole eggs + 3 egg whites, 1 cup oats with berries, black coffee.',
    macro: '50 g protein / 80 g carb / 22 g fat'
  },
  {
    when: 'Pre-training', kcal: '~400',
    what: 'Greek yogurt, banana, honey, handful of rice cakes.',
    macro: '30 g protein / 65 g carb / 4 g fat'
  },
  {
    when: 'Post-training', kcal: '~600',
    what: '8 oz chicken or lean beef, 1.5 cups white rice, veg, salt generously.',
    macro: '55 g protein / 75 g carb / 12 g fat'
  },
  {
    when: 'Dinner', kcal: '~800',
    what: '8 oz salmon or steak, large potato or pasta, big salad with olive oil.',
    macro: '50 g protein / 85 g carb / 28 g fat'
  },
  {
    when: 'Before bed', kcal: '~350',
    what: 'Cottage cheese or casein shake, peanut butter, handful of fruit.',
    macro: '40 g protein / 25 g carb / 12 g fat'
  }
];

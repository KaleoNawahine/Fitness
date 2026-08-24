/**
 * Fueling model for a lean gaining phase.
 *
 * The strategy: a surplus big enough to build muscle and small enough that you
 * do not spend the back half of the year carrying fat you have to diet off.
 * Everything is derived from a target rate of gain rather than picked out of the
 * air, so changing the target changes the whole plan coherently.
 */

/** Roughly the energy cost of a pound of mixed lean-and-fat tissue gain. */
const KCAL_PER_LB = 3500;

/**
 * Training days carry a bigger surplus than rest days — you can use the food
 * better on a day you trained. REST_SHARE is the rest-day surplus expressed as
 * a fraction of the training-day surplus.
 */
const REST_SHARE = 0.35;
const TRAINING_DAYS = 5;
const REST_DAYS = 2;

export const GOALS = {
  leanGain: { name: 'Lean gain',   rate: 0.45,  blurb: 'Add muscle at about half a pound a week. Slow enough to stay lean.' },
  slowGain: { name: 'Slower gain', rate: 0.30,  blurb: 'Minimal fat gain, but roughly nine months to add 10 lb.' },
  maintain: { name: 'Maintain',    rate: 0,     blurb: 'Hold your weight and keep training. Useful in season.' },
  recomp:   { name: 'Lean out',    rate: -0.50, blurb: 'A small deficit for sharpening up once you reach your target weight.' }
};

export function computeTargets({
  weightLb = 190, heightIn = 75, age = 28, activity = 1.7, goal = 'leanGain'
} = {}) {
  const kg = weightLb / 2.2046;
  const cm = heightIn * 2.54;
  const bmr = Math.round(10 * kg + 6.25 * cm - 5 * age + 5);
  const tdee = Math.round(bmr * activity);

  const g = GOALS[goal] || GOALS.leanGain;
  const weeklyDelta = g.rate * KCAL_PER_LB;

  // Solve for the training-day delta given the rest-day share.
  const trainDelta = weeklyDelta / (TRAINING_DAYS + REST_DAYS * REST_SHARE);
  const restDelta = trainDelta * REST_SHARE;

  const trainKcal = Math.round((tdee + trainDelta) / 10) * 10;
  const restKcal = Math.round((tdee + restDelta) / 10) * 10;

  // Protein high enough to make the surplus build muscle rather than just mass.
  const protein = Math.round(weightLb * 1.0);
  const fat = Math.round(weightLb * 0.45);
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;

  return {
    goal, goalName: g.name, targetRate: g.rate,
    bmr, tdee,
    train: { kcal: trainKcal, protein, fat, carb: Math.round((trainKcal - proteinKcal - fatKcal) / 4) },
    rest: { kcal: restKcal, protein, fat, carb: Math.round((restKcal - proteinKcal - fatKcal) / 4) },
    weeklyAvg: Math.round((trainKcal * TRAINING_DAYS + restKcal * REST_DAYS) / 7),
    weeklyDelta: Math.round(trainKcal * TRAINING_DAYS + restKcal * REST_DAYS - tdee * 7),
    water: Math.round(weightLb * 0.6),
    fiber: Math.round((trainKcal / 1000) * 12),
    sodium: '4-6 g/day — you sweat a lot on the court and cramping kills jumps'
  };
}

export function projectedWeight(startLb, weeks, ratePerWeek) {
  return +(startLb + ratePerWeek * weeks).toFixed(1);
}

/** Weeks to go from here to a goal weight at the planned rate. */
export function weeksToGoal(currentLb, goalLb, ratePerWeek) {
  if (!ratePerWeek) return null;
  const w = (goalLb - currentLb) / ratePerWeek;
  return w > 0 ? Math.ceil(w) : 0;
}

/**
 * Compare measured rate of gain against the plan and say what to do about it.
 * This is the whole reason to weigh yourself — a surplus you never check is
 * just a guess.
 */
export function surplusAdvice(measuredRate, targetRate) {
  if (measuredRate == null) {
    return {
      status: 'unknown', tone: 'neutral',
      headline: 'Not enough weigh-ins yet',
      detail: 'Log your bodyweight at least three times a week for two weeks and the app will tell you whether the surplus is right.'
    };
  }
  if (!targetRate) {
    return {
      status: 'ok', tone: 'good',
      headline: `Holding at ${measuredRate >= 0 ? '+' : ''}${measuredRate.toFixed(2)} lb/wk`,
      detail: 'You are maintaining. Nothing to change.'
    };
  }

  const ratio = measuredRate / targetRate;
  if (ratio < 0.4) {
    return {
      status: 'under', tone: 'warn', kcalDelta: 250,
      headline: `Gaining too slowly — ${measuredRate.toFixed(2)} lb/wk vs ${targetRate} target`,
      detail: 'Add about 250 calories to your training days, most easily as carbs around your session. Recheck in two weeks.'
    };
  }
  if (ratio > 1.8) {
    return {
      status: 'over', tone: 'warn', kcalDelta: -250,
      headline: `Gaining too fast — ${measuredRate.toFixed(2)} lb/wk vs ${targetRate} target`,
      detail: 'Past about double the target rate, the extra is mostly fat. Take roughly 250 calories back out and recheck in two weeks.'
    };
  }
  return {
    status: 'ok', tone: 'good',
    headline: `On track at ${measuredRate.toFixed(2)} lb/wk`,
    detail: 'This is exactly the rate you want. Do not change anything.'
  };
}

export const RULES = [
  {
    t: 'Eat on a schedule, not on hunger',
    d: 'The hardest part of gaining is that a surplus stops feeling like one after two weeks. Four or five planned feedings beat waiting until you feel like eating — by block 3 you will not feel like it.'
  },
  {
    t: 'Protein every 3-4 hours',
    d: 'Four feedings of 45-55 g beats two of 100 g. Total matters most, but spreading it out is what turns the surplus into muscle instead of just weight.'
  },
  {
    t: 'Carbs are the cheap part of the surplus',
    d: 'They fuel the training that causes the growth, and they are far easier to eat in volume than fat or protein. Rice, oats, potatoes, pasta, fruit — this is where the extra calories should come from.'
  },
  {
    t: 'Drink some of it',
    d: 'When solid food stops going down, a shake with milk, oats, banana and peanut butter is 700 calories in two minutes. This is the single most useful trick for gaining.'
  },
  {
    t: 'Fuel the session properly',
    d: '60-80 g of carbs and 30 g of protein in the 90 minutes before you train, and another 80-100 g of carbs plus 40 g protein within an hour after. You are training six days a week now.'
  },
  {
    t: 'Half a pound a week, no faster',
    d: 'Past about a pound a week the extra is mostly fat, and you will spend three months dieting it off. Slow is the whole strategy — it is the difference between 200 lb lean and 205 lb soft.'
  },
  {
    t: 'The tape tells the truth, the scale does not',
    d: 'Weight going up only tells you the surplus works. Arm, chest and thigh climbing while the waist stays flat tells you it is working correctly. Measure every two weeks, cold.'
  },
  {
    t: 'Watch the Wednesday jump numbers',
    d: 'If your approach jump starts dropping and you are eating and sleeping enough, you are accumulating fatigue, not muscle. Take the deload seriously.'
  },
  {
    t: 'Sleep is where the muscle is built',
    d: 'Eight hours minimum, nine if you can. Chronic short sleep in a surplus shifts the ratio of what you gain toward fat, independent of your calories.'
  }
];

export const SUPPLEMENTS = [
  { n: 'Creatine monohydrate', d: '5 g daily, timing irrelevant. Best-evidenced legal supplement there is, and it works even better in a surplus. Cheap. Take it.', tier: 'Worth it' },
  { n: 'Whey protein', d: 'Not magic — just the easiest way to hit 190 g a day while also eating 500 g of carbs.', tier: 'Worth it' },
  { n: 'Liquid carbs (maltodextrin or dextrose)', d: 'If you genuinely cannot eat enough, carbs you can drink around training are the least unpleasant way to close the gap.', tier: 'Situational' },
  { n: 'Vitamin D3 + K2', d: '2,000-4,000 IU if you train indoors. Low D is linked to worse muscle function and more injuries.', tier: 'Worth it' },
  { n: 'Caffeine', d: '3-6 mg/kg about 45 min pre-session. Real effect on output. Skip it before evening sessions or your sleep — and your gains — pay for it.', tier: 'Situational' },
  { n: 'Collagen + vitamin C', d: '15 g with 50 mg vitamin C about 45 min before jump sessions. Early but promising evidence for tendon health.', tier: 'Situational' },
  { n: 'Fat burners, BCAAs, testosterone boosters, mass gainers', d: 'BCAAs are pointless at your protein intake, the rest do not work, and "mass gainer" is sugar at four times the price of oats. Spend it on food.', tier: 'Skip' }
];

export const MEAL_TEMPLATE = [
  {
    when: 'Breakfast', kcal: '~850',
    what: '4 whole eggs + 3 whites, 1.5 cups oats with berries and honey, glass of whole milk.',
    macro: '52 g protein / 105 g carb / 26 g fat'
  },
  {
    when: 'Mid-morning', kcal: '~450',
    what: 'Greek yogurt, granola, banana. Or the shake if you are short on time.',
    macro: '30 g protein / 60 g carb / 8 g fat'
  },
  {
    when: 'Pre-training', kcal: '~450',
    what: 'Rice cakes with honey, banana, whey shake.',
    macro: '30 g protein / 75 g carb / 4 g fat'
  },
  {
    when: 'Post-training', kcal: '~750',
    what: '8 oz chicken or lean beef, 2 cups white rice, veg, salt generously.',
    macro: '58 g protein / 100 g carb / 14 g fat'
  },
  {
    when: 'Dinner', kcal: '~850',
    what: '8 oz salmon or steak, large potato or pasta, big salad with olive oil.',
    macro: '52 g protein / 90 g carb / 30 g fat'
  },
  {
    when: 'Before bed', kcal: '~450',
    what: 'Cottage cheese or casein, peanut butter, handful of fruit.',
    macro: '42 g protein / 35 g carb / 16 g fat'
  }
];

/** The gaining-phase shake, because it is the difference between hitting the number and not. */
export const SHAKE = {
  name: 'The 800-calorie shake',
  items: ['500 ml whole milk', '1 scoop whey', '80 g oats', '1 banana', '2 tbsp peanut butter', 'pinch of salt'],
  macro: '~55 g protein / 90 g carb / 28 g fat · about 800 kcal',
  note: 'Blend it, drink it between meals on days the food will not go down. Half a shake still counts.'
};

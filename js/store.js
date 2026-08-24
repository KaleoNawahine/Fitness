/**
 * All app state. Single object, persisted to localStorage, exported/importable
 * as JSON so nothing is ever trapped on one device.
 */

import { atWeek, blockForWeek, weekInBlock, TOTAL_WEEKS, weekSessions } from './data/program.js';
import { ex } from './data/exercises.js';

const KEY = 'atn.state.v1';
const SCHEMA = 1;

const DEFAULTS = () => ({
  v: SCHEMA,
  profile: {
    name: '',
    heightIn: 75,        // 6'3"
    weightLb: 190,
    age: 28,
    activity: 1.7,
    startDate: todayISO()
  },
  maxes: {
    // Estimated 1RMs. Seeded conservatively; overwritten at the week-0 test.
    squat: 275, trapbar: 355, bench: 205, ohp: 125, clean: 155
  },
  cursor: { week: 1, day: null },
  logs: {},              // "week:day" -> session log
  metrics: {},           // metricKey -> [{d, v}]
  prefs: {
    plateInc: 5,
    autoRest: true,
    sound: true,
    theme: 'dark',
    cleanVariant: 'hang_clean'   // or 'jump_shrug'
  }
});

let state = null;
const listeners = new Set();

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------- LOAD */
export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? migrate(JSON.parse(raw)) : DEFAULTS();
  } catch {
    state = DEFAULTS();
  }
  return state;
}

function migrate(s) {
  const base = DEFAULTS();
  return {
    ...base, ...s,
    profile: { ...base.profile, ...(s.profile || {}) },
    maxes: { ...base.maxes, ...(s.maxes || {}) },
    cursor: { ...base.cursor, ...(s.cursor || {}) },
    prefs: { ...base.prefs, ...(s.prefs || {}) },
    logs: s.logs || {},
    metrics: s.metrics || {}
  };
}

export function get() {
  if (!state) load();
  return state;
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not persist state', e);
  }
  listeners.forEach(fn => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function update(mut) {
  mut(get());
  save();
}

export function exportJSON() {
  return JSON.stringify(get(), null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a valid backup file');
  state = migrate(parsed);
  save();
}

export function resetAll() {
  state = DEFAULTS();
  save();
}

/* -------------------------------------------------------------- LOAD MATH */

/** Epley. Good enough at low reps, which is all we use it for. */
export function e1rm(weight, reps) {
  if (!weight || !reps) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

export function roundPlate(w, inc = 5) {
  if (!w) return 0;
  return Math.max(inc, Math.round(w / inc) * inc);
}

/**
 * Working load for one prescription item at a given week-in-block.
 * Returns null when the movement is not percentage-driven.
 */
export function targetLoad(item, wib) {
  const s = get();
  if (!item.pct) return null;
  const ref = refFor(item);
  if (!ref) return null;
  const max = s.maxes[ref];
  if (!max) return null;
  let pct = atWeek(item.pct, wib);
  if (item.pctOf) pct *= item.pctOf;
  return roundPlate(max * pct, s.prefs.plateInc);
}

function refFor(item) {
  // A prescription may name its own reference lift; otherwise the exercise
  // definition says which tested max it loads off.
  return item.ref || ex(item.ex).ref || null;
}

/** Warm-up ramp to a working weight. */
export function warmupRamp(target, inc = 5) {
  if (!target || target < 95) return [];
  const steps = [
    { pct: 0.4, reps: 8 },
    { pct: 0.55, reps: 5 },
    { pct: 0.7, reps: 3 },
    { pct: 0.85, reps: 2 }
  ];
  return steps
    .map(st => ({ weight: roundPlate(target * st.pct, inc), reps: st.reps }))
    .filter(st => st.weight < target - inc);
}

/* -------------------------------------------------------------- SESSION LOG */

export function logKey(week, day) {
  return `${week}:${day}`;
}

export function getLog(week, day) {
  return get().logs[logKey(week, day)] || null;
}

export function ensureLog(week, day) {
  const s = get();
  const k = logKey(week, day);
  if (!s.logs[k]) s.logs[k] = { sets: {}, done: false, notes: '', started: null, date: null };
  return s.logs[k];
}

export function setKeyFor(sessionId, exId, idx, setNo) {
  return `${sessionId}|${exId}|${idx}|${setNo}`;
}

export function logSet(week, day, key, data) {
  update(s => {
    const log = s.logs[logKey(week, day)] || (s.logs[logKey(week, day)] = { sets: {}, done: false, notes: '', started: null, date: null });
    if (!log.started) log.started = new Date().toISOString();
    log.sets[key] = { ...(log.sets[key] || {}), ...data };
  });
}

export function clearSet(week, day, key) {
  update(s => {
    const log = s.logs[logKey(week, day)];
    if (log) delete log.sets[key];
  });
}

export function finishSession(week, day, notes) {
  update(s => {
    const log = s.logs[logKey(week, day)] || (s.logs[logKey(week, day)] = { sets: {}, done: false, notes: '', started: null, date: null });
    log.done = true;
    log.date = todayISO();
    log.finished = new Date().toISOString();
    if (notes != null) log.notes = notes;
  });
}

export function reopenSession(week, day) {
  update(s => {
    const log = s.logs[logKey(week, day)];
    if (log) { log.done = false; log.finished = null; }
  });
}

/**
 * Last logged working weight for an exercise, searching backwards from the
 * current week. This is what drives suggestions on RPE-based lifts.
 */
export function lastLoadFor(exId, beforeWeek, beforeDay) {
  const s = get();
  let best = null;
  for (const [k, log] of Object.entries(s.logs)) {
    const [w, d] = k.split(':').map(Number);
    if (w > beforeWeek || (w === beforeWeek && d >= beforeDay)) continue;
    for (const [sk, sv] of Object.entries(log.sets || {})) {
      const parts = sk.split('|');
      if (parts[1] !== exId) continue;
      if (!sv.done || !sv.w) continue;
      const stamp = w * 10 + d;
      if (!best || stamp > best.stamp || (stamp === best.stamp && sv.w > best.w)) {
        best = { w: sv.w, r: sv.r, rpe: sv.rpe, week: w, day: d, stamp };
      }
    }
  }
  return best;
}

/**
 * Suggested load for an autoregulated (RPE) lift: last session's top load,
 * nudged up when it was logged at or below the target effort.
 */
export function suggestLoad(item, exId, week, day) {
  const s = get();
  const last = lastLoadFor(exId, week, day);
  if (!last) return null;
  const inc = s.prefs.plateInc;
  const targetRpe = Array.isArray(item.rpe) ? item.rpe[0] : item.rpe;
  let w = last.w;
  if (targetRpe && last.rpe && last.rpe <= targetRpe - 1) w = last.w + inc * 2;
  else if (targetRpe && last.rpe && last.rpe <= targetRpe) w = last.w + inc;
  else if (!last.rpe) w = last.w + inc;
  return { suggested: roundPlate(w, inc), last };
}

/** Look for logged 3RM-ish top sets that imply the stored max is stale. */
export function staleMaxes() {
  const s = get();
  const out = [];
  const byRef = { squat: 'back_squat', trapbar: 'trap_dl', bench: 'bench', ohp: 'ohp', clean: 'hang_clean' };
  for (const [ref, exId] of Object.entries(byRef)) {
    let bestE = 0, at = null;
    for (const [k, log] of Object.entries(s.logs)) {
      for (const [sk, sv] of Object.entries(log.sets || {})) {
        if (sk.split('|')[1] !== exId) continue;
        if (!sv.done || !sv.w || !sv.r || sv.r > 6) continue;
        const est = e1rm(sv.w, sv.r);
        if (est > bestE) { bestE = est; at = k; }
      }
    }
    const cur = s.maxes[ref] || 0;
    if (bestE > cur * 1.025) out.push({ ref, current: cur, implied: roundPlate(bestE, s.prefs.plateInc), at });
  }
  return out;
}

export function applyMax(ref, value) {
  update(s => { s.maxes[ref] = Math.round(value); });
}

/* ---------------------------------------------------------------- METRICS */

export function logMetric(key, value, date) {
  update(s => {
    if (!s.metrics[key]) s.metrics[key] = [];
    const d = date || todayISO();
    const existing = s.metrics[key].find(p => p.d === d);
    if (existing) existing.v = value;
    else s.metrics[key].push({ d, v: value });
    s.metrics[key].sort((a, b) => a.d.localeCompare(b.d));
  });
}

export function deleteMetric(key, date) {
  update(s => {
    if (s.metrics[key]) s.metrics[key] = s.metrics[key].filter(p => p.d !== date);
  });
}

export function metricSeries(key) {
  return get().metrics[key] || [];
}

export function latestMetric(key) {
  const arr = metricSeries(key);
  return arr.length ? arr[arr.length - 1] : null;
}

export function firstMetric(key) {
  const arr = metricSeries(key);
  return arr.length ? arr[0] : null;
}

/** Rolling average of the last n entries — for bodyweight, which is noisy. */
export function metricAvg(key, n = 7) {
  const arr = metricSeries(key).slice(-n);
  if (!arr.length) return null;
  return +(arr.reduce((a, p) => a + p.v, 0) / arr.length).toFixed(1);
}

/* -------------------------------------------------------------- PROGRESS */

export function weekProgress(week) {
  const sessions = weekSessions(week).filter(s => !s.optional);
  let done = 0;
  for (const s of sessions) {
    const log = getLog(week, s.day);
    if (log?.done) done++;
  }
  return { done, total: sessions.length };
}

export function overallProgress() {
  let done = 0, total = 0;
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    const p = weekProgress(w);
    done += p.done; total += p.total;
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** Consecutive days with a completed session, counting back from today. */
export function streak() {
  const s = get();
  const dates = new Set();
  for (const log of Object.values(s.logs)) if (log.done && log.date) dates.add(log.date);
  if (!dates.size) return 0;

  let count = 0;
  const d = new Date();
  // Allow today to be a rest day without breaking the streak.
  if (!dates.has(fmt(d))) d.setDate(d.getDate() - 1);
  while (dates.has(fmt(d))) { count++; d.setDate(d.getDate() - 1); }
  return count;
}

function fmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Completed sessions in the last 28 days, as an adherence percentage. */
export function adherence() {
  const s = get();
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 28);
  let done = 0;
  for (const log of Object.values(s.logs)) {
    if (log.done && log.date && new Date(log.date) >= cutoff) done++;
  }
  return { done, expected: 20, pct: Math.min(100, Math.round((done / 20) * 100)) };
}

/** Total tonnage logged, all time. */
export function totalTonnage() {
  let t = 0;
  for (const log of Object.values(get().logs)) {
    for (const sv of Object.values(log.sets || {})) {
      if (sv.done && sv.w && sv.r) t += sv.w * sv.r;
    }
  }
  return t;
}

export function tonnageByWeek() {
  const out = {};
  for (const [k, log] of Object.entries(get().logs)) {
    const w = Number(k.split(':')[0]);
    let t = 0;
    for (const sv of Object.values(log.sets || {})) {
      if (sv.done && sv.w && sv.r) t += sv.w * sv.r;
    }
    out[w] = (out[w] || 0) + t;
  }
  return out;
}

/** Best estimated 1RM per lift over time, for the strength chart. */
export function e1rmSeries(exId) {
  const points = [];
  for (const [k, log] of Object.entries(get().logs)) {
    const w = Number(k.split(':')[0]);
    let best = 0;
    for (const [sk, sv] of Object.entries(log.sets || {})) {
      if (sk.split('|')[1] !== exId) continue;
      if (!sv.done || !sv.w || !sv.r || sv.r > 8) continue;
      best = Math.max(best, e1rm(sv.w, sv.r));
    }
    if (best) points.push({ week: w, v: best, d: log.date });
  }
  return points.sort((a, b) => a.week - b.week);
}

/* ---------------------------------------------------------------- CURSOR */

export function currentWeek() {
  return Math.min(TOTAL_WEEKS, Math.max(1, get().cursor.week || 1));
}

export function setWeek(w) {
  update(s => { s.cursor.week = Math.min(TOTAL_WEEKS, Math.max(1, w)); });
}

/** Today's day index (0 = Mon .. 6 = Sun). */
export function todayDayIndex() {
  return (new Date().getDay() + 6) % 7;
}

/**
 * The session the app should open on: today's if it exists and is unfinished,
 * otherwise the next unfinished one this week, otherwise today's.
 */
export function suggestedDay() {
  const week = currentWeek();
  const today = todayDayIndex();
  const sessions = weekSessions(week);
  const todaySession = sessions.find(s => s.day === today);
  if (todaySession && !getLog(week, today)?.done) return today;
  const next = sessions.find(s => s.day > today && !s.optional && !getLog(week, s.day)?.done);
  if (next) return next.day;
  const anyLeft = sessions.find(s => !s.optional && !getLog(week, s.day)?.done);
  if (anyLeft) return anyLeft.day;
  return todaySession ? today : sessions[0].day;
}

/** Auto-advance the week once the current one is essentially complete. */
export function maybeAdvanceWeek() {
  const w = currentWeek();
  const p = weekProgress(w);
  if (p.total && p.done >= p.total && w < TOTAL_WEEKS) {
    setWeek(w + 1);
    return true;
  }
  return false;
}

export function blockInfo() {
  const w = currentWeek();
  return { block: blockForWeek(w), wib: weekInBlock(w), week: w };
}

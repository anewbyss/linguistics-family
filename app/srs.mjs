'use strict';
// Spaced repetition core: intervals of 1, 3, 7, 14, 30 days. A wrong answer
// drops the word back to level 0 (next review tomorrow); a right one advances
// it one level. Pure functions so both the tests and the app can use them.
export const INTERVALS = [1, 3, 7, 14, 30];
export const DAY = 86400000;

// state: undefined (never seen) or { level, due }. now: epoch ms.
export function schedule(state, now, correct) {
  const level = correct ? Math.min((state?.level ?? -1) + 1, INTERVALS.length - 1) : 0;
  return { level, due: now + INTERVALS[level] * DAY };
}

// items: [{ key, state? }...] — returns the ones due now (or never scheduled).
export function dueItems(items, now) {
  return items.filter((it) => !it.state || (it.state.due ?? 0) <= now);
}

export function describeLevel(level) {
  const d = INTERVALS[level] ?? 1;
  return d === 1 ? 'tomorrow' : `in ${d} days`;
}

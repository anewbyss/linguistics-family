import test from 'node:test';
import assert from 'node:assert/strict';
import { schedule, dueItems, INTERVALS, DAY, describeLevel } from '../app/srs.mjs';

const NOW = 1731700000000;

test('a first correct answer schedules the word tomorrow', () => {
  const s = schedule(undefined, NOW, true);
  assert.equal(s.level, 0);
  assert.equal(s.due, NOW + 1 * DAY);
});

test('correct answers climb the interval ladder', () => {
  let s = schedule(undefined, NOW, true);
  s = schedule(s, NOW, true);
  assert.equal(s.level, 1);
  assert.equal(s.due, NOW + 3 * DAY);
  s = schedule(s, NOW, true);
  s = schedule(s, NOW, true);
  assert.equal(s.due, NOW + 14 * DAY);
});

test('a wrong answer drops back to tomorrow', () => {
  let s = { level: 3, due: NOW };
  s = schedule(s, NOW, false);
  assert.equal(s.level, 0);
  assert.equal(s.due, NOW + DAY);
});

test('the ladder never climbs past 30 days', () => {
  let s = { level: INTERVALS.length - 1, due: NOW };
  s = schedule(s, NOW, true);
  assert.equal(s.level, INTERVALS.length - 1);
});

test('dueItems returns never-scheduled and overdue words', () => {
  const items = [
    { key: 'a' },
    { key: 'b', state: { level: 0, due: NOW - 1000 } },
    { key: 'c', state: { level: 4, due: NOW + DAY } },
  ];
  const due = dueItems(items, NOW).map((i) => i.key);
  assert.deepEqual(due, ['a', 'b']);
});

test('describeLevel is human', () => {
  assert.equal(describeLevel(0), 'tomorrow');
  assert.equal(describeLevel(2), 'in 7 days');
});

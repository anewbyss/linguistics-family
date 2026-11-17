import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDoc } from '../scripts/check-content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const load = (f) => JSON.parse(readFileSync(join(here, 'fixtures', f), 'utf8'));

test('a document with sources on every entry passes', () => {
  assert.deepEqual(checkDoc(load('good.json')), []);
});

test('an entry with no src fails', () => {
  const problems = checkDoc(load('bad-nosrc.json'));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /has no src/);
});

test('a malformed src (neither url nor attribution) fails', () => {
  const problems = checkDoc(load('bad-srcformat.json'));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /needs url or attribution/);
});

test('an audio link on a non-allowlisted host fails', () => {
  const problems = checkDoc(load('bad-audiohost.json'));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /not allowlisted/);
});

test('a quiz answer without an explanation fails', () => {
  const problems = checkDoc(load('bad-quiz.json'));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /needs an explanation/);
});

'use strict';
// Content check: every vocabulary item, quiz fact and culture entry must carry
// a source — a URL ({url, name}) or a named speaker attribution
// ({name, attribution, date}). Audio links must come from allowlisted hosts.
// Exit 0 = valid, exit 1 = problems (each named with its entry id).
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_HOSTS = [
  'potawatomidictionary.com', 'files.peacecorps.gov',
  'www.youtube.com', 'youtu.be', 'learning.potawatomi.org',
];

const problems = [];
let sink = problems; // current collector; checkDoc swaps it so each call is isolated
const bad = (id, why) => sink.push(`${id}: ${why}`);

function checkSrc(id, src, where) {
  if (!src || typeof src !== 'object') return bad(id, `${where} has no src`);
  if (typeof src.url === 'string') {
    if (!/^https:\/\/.+/.test(src.url)) bad(id, `${where} src.url must be https`);
    if (!src.name) bad(id, `${where} src.name missing`);
  } else if (typeof src.attribution === 'string') {
    if (!src.name) bad(id, `${where} attribution needs a source name`);
    if (!src.date) bad(id, `${where} attribution needs a date`);
  } else {
    bad(id, `${where} src needs url or attribution`);
  }
}

function checkAudio(id, audio, where) {
  if (audio === undefined || audio === null) return;
  if (typeof audio !== 'string') return bad(id, `${where} audio must be a URL string`);
  let host = '';
  try { host = new URL(audio).host; } catch { return bad(id, `${where} audio is not a URL`); }
  if (!/^https:/.test(audio)) bad(id, `${where} audio must be https`);
  if (!AUDIO_HOSTS.includes(host)) bad(id, `${where} audio host ${host} not allowlisted`);
}

function checkEntry(entry, where) {
  const id = entry.id || '(no id)';
  const label = where ? `${where}/${id}` : id;
  if (entry.src) checkSrc(label, entry.src, 'item');
  if (entry.audio) checkAudio(label, entry.audio, 'item');
  if (Array.isArray(entry.vocab)) {
    entry.vocab.forEach((v, i) => {
      checkSrc(`${label}#vocab${i}`, v.src, 'vocab');
      checkAudio(`${label}#vocab${i}`, v.audio, 'vocab');
      if (typeof v.t !== 'string' || !v.t.trim()) bad(`${label}#vocab${i}`, 'missing text (t)');
      if (typeof v.en !== 'string' || !v.en.trim()) bad(`${label}#vocab${i}`, 'missing English (en)');
    });
  }
  if (Array.isArray(entry.quiz)) {
    entry.quiz.forEach((q, i) => {
      checkSrc(`${label}#quiz${i}`, q.src, 'quiz');
      if (!Array.isArray(q.options) || q.options.length < 2) bad(`${label}#quiz${i}`, 'quiz needs >= 2 options');
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) bad(`${label}#quiz${i}`, 'quiz answer must be a valid option index');
      if (typeof q.explain !== 'string' || !q.explain.trim()) bad(`${label}#quiz${i}`, 'quiz answer needs an explanation');
    });
  }
  if (Array.isArray(entry.culture)) {
    entry.culture.forEach((c, i) => checkSrc(`${label}#culture${i}`, c.src, 'culture'));
  }
}

export function checkDoc(doc) {
  const collected = [];
  sink = collected;
  if (!doc || typeof doc !== 'object') { bad('(doc)', 'not an object'); sink = problems; return collected; }
  if (!doc.lang) bad('(doc)', 'missing lang');
  if (!Array.isArray(doc.lessons)) bad('(doc)', 'missing lessons array');
  else doc.lessons.forEach((l) => checkEntry(l, doc.lang));
  if (Array.isArray(doc.phrasebook)) doc.phrasebook.forEach((p, i) => {
    checkSrc(`${doc.lang}#phrase${i}`, p.src, 'phrasebook');
    checkAudio(`${doc.lang}#phrase${i}`, p.audio, 'phrasebook');
    if (typeof p.t !== 'string' || !p.t.trim()) bad(`${doc.lang}#phrase${i}`, 'missing text');
    if (typeof p.en !== 'string' || !p.en.trim()) bad(`${doc.lang}#phrase${i}`, 'missing English');
  });
  sink = problems;
  return collected;
}

export function main(files) {
  const collected = [];
  const list = files ?? readdirSync(join(ROOT, 'content')).filter((f) => f.endsWith('.json'));
  for (const f of list) {
    let doc;
    try { doc = JSON.parse(readFileSync(join(ROOT, 'content', f), 'utf8')); }
    catch (e) { collected.push(`${f}: invalid JSON: ${e.message}`); continue; }
    collected.push(...checkDoc(doc));
  }
  if (collected.length) {
    for (const p of collected) console.error('SOURCE CHECK FAIL', p);
    return 1;
  }
  console.log(`source check OK (${list.length} file(s))`);
  return 0;
}

if (process.argv[1] && process.argv[1].endsWith('check-content.mjs')) {
  const args = process.argv.length > 2 ? process.argv.slice(2) : undefined;
  process.exit(main(args));
}

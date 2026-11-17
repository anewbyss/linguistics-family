'use strict';
// Generates app/data.gen.ts from content/*.json so the raea app imports one
// typed module. Run after editing content:  node scripts/build-data.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = readdirSync(join(ROOT, 'content')).filter((f) => f.endsWith('.json'));
const docs = files.map((f) => JSON.parse(readFileSync(join(ROOT, 'content', f), 'utf8')));

const ts = `// GENERATED from content/*.json by scripts/build-data.mjs — do not edit by hand.
// Every entry's src field points at the community source it came from.
export type Src = { url?: string; name: string; attribution?: string; date?: string };
export type Vocab = { t: string; en: string; note?: string; src: Src; audio?: string };
export type QuizItem = { q: string; options: string[]; answer: number; explain: string; src: Src };
export type Lesson = {
  id: string; title: string; band: 'kids' | 'youth' | 'adult'; nativeTitle?: string; emoji?: string;
  vocab: Vocab[]; grammarNotes?: string[]; culture?: { text: string; src: Src }[]; quiz: QuizItem[];
};
export type LangDoc = {
  lang: string; title: string; orthography: string;
  lessons: Lesson[]; phrasebook?: Vocab[];
};
export const DATA: LangDoc[] = ${JSON.stringify(docs, null, 2)} as unknown as LangDoc[];

export const TRACKS = [
  { id: 'kids', label: 'Kids (with a grown-up)', blurb: 'Short and playful. A parent reads along.' },
  { id: 'youth', label: 'Youth', blurb: 'A bit more at a time, still friendly.' },
  { id: 'adult', label: 'Adult', blurb: 'Adds the grammar notes from the sources.' },
] as const;
`;
writeFileSync(join(ROOT, 'app', 'data.gen.ts'), ts);
console.log(`wrote app/data.gen.ts from ${files.length} content file(s)`);

# Family Language App: lea faka-Tonga + Bodéwadmimwen — Design

Date: 2026-11-16. Author: Hermes Ally, for Bryce Banks (anewbyss).
Status: draft for builder check; not yet approved for build.

## Intent and the why

Bryce's friend wants to teach his kids his culture and heritage language(s). This app serves one family using **two languages**:

- **lea faka-Tonga (Tongan)** — Polynesian language of the Kingdom of Tonga
- **Bodéwadmimwen (Potawatomi)** — Algonquian language; revitalization-stage; this app follows the **Citizen Potawatomi Nation (CPN) orthography**

It is a **multi-age** app: little kids, teens, and adults share one app, each getting a track pitched at them, with the parent able to run any lesson with any child. Success looks like: dad opens it with his kids, they learn real words backed by real speaker audio, every piece of language content traces to a named source, and he trusts what it teaches his children.

## Goals

1. **Multi-age accessibility.** Every lesson carries an age tag: `kids` (roughly 4–9, meant to be done with a grown-up), `youth` (10–14), `adult`. The home screen groups by stage, not by age; a track picker filters what's shown. Any lesson can be opened regardless of track (nothing is ever locked — carried over from Lingua's philosophy).
2. **Sourced content, enforced by the build.** Every vocabulary item, example sentence, listening cue and quiz fact carries a `src` field (name + URL). The build script **fails** if any entry lacks one. No exceptions.
3. **Real audio via the community, not robots.** Device TTS does not exist for these languages. Audio is delivered by linking (and where legal, embedding) real recordings: CPN's dictionary (≈90% of 10,400+ words have speaker audio) for Potawatomi; Peace Corps Tonga audio (public domain) for Tongan. The app never claims a robot voice is a native speaker.
4. **Culture with respect.** Culture sections are factual, brief, and links-first: they point to the community's own materials (CPN Language Department videos and classes, Tongan community resources). **No AI-written origin stories, songs, or lore.** Bryce's standing rule.
5. **Works offline on phones.** PWA, service-worker cached, installable — the family will be on phones.
6. **Honest credits.** A credits page names every source and states plainly: *this is a study aid, not an authority; your community's speakers and teachers are the authority.*

## Non-goals (v1)

- No Swift/iOS app — web PWA only; port later if wanted.
- No speech-recognition scoring (no ASR exists for these languages). "I said it ✓" self-check only, carried over from Lingua's fallback.
- No CEFR certificate claims. Content is starter-level (roughly A1–A2), labeled honestly.
- No placement test in v1.
- Not a replacement for community classes — the resources page routes to CPN's courses and live classes.

## Anti-goals (failure even if it technically works)

- Any vocabulary invented without a source.
- Reproducing copyrighted course text (e.g. NZ Ministry of Education's *Faufaua!*, leafakatonga.org) instead of citing and linking it.
- Presenting one Potawatomi dialect's forms as "the" language without saying which community's system is followed.

## Constraints

- **Zero runtime dependencies** (matches Lingua): Node build script (`content/*.mjs` → static JSON) + plain HTML/CSS/JS PWA. No framework.
- Reuse Lingua's content helpers (`P, Q, A, C, M, T`) and engine patterns (`web/js/engine.js`) where they fit; strip what doesn't.
- Both languages are Latin-script: **drop** tracing, RTL handling, and the on-screen keyboard entirely.
- Content schema adds: required `src` on `P` (vocab/sentence) and on quiz answers; optional `audio` URL field.

## Approaches considered

1. **Chosen: new multi-age app, new repo, reusing the Lingua engine pattern.** The audience is a family, not an adult test-prep student; Lingua's CEFR-ladder brand and adult flows don't fit, and the friend's app should deploy and evolve independently.
2. Add the two languages to the existing Lingua repo — rejected: brand and adult shape; mixes audiences.
3. Light starter module — rejected by Bryce ("pro task").

## Sources (the spine — all verified live as of 2026-11-16/17)

**Potawatomi:**
- potawatomidictionary.com — CPN's online dictionary, 10,400+ words, ~90% with audio; tags (nouns > animals > mammals), verb conjugator, related words. Primary vocabulary + audio source.
- learning.potawatomi.org — CPN self-paced courses: introduction, conversation-based, **children's course**, grammar-based.
- 7000.org — CPN sentence-based household course ("gbekte ne?" = are you hungry?) — model for the family/home lesson themes.
- youtube.com/@CPNLanguage — classes, songs, cartoons, cultural teachings (link-outs and culture sections).
- potawatomi.org blog language updates (Justin Neely, Language Director) — natural family phrases, seasonal word sets.

**Tongan:**
- Peace Corps Tonga Language Lessons (files.peacecorps.gov) — public domain US government work: alphabet, pronunciation (fakauʻa, toloi, 20 vowel sounds), greetings, phrases, numbers, days, dialogues; ships with audio tracks.
- leafakatonga.org (Andrew Joakim) — free 52-lesson course built on Churchward's *Tongan Grammar* and Shumway's *Intensive Course in Tongan*. Free to read; **cite and link, do not copy**.
- *Faufaua! An Introduction to Tongan* (NZ Ministry of Education, 2010) — kids-oriented 20-unit structure; Crown copyright — structural model and citation only.
- Shumway, *Intensive Course in Tongan* (Univ. of Hawaii Press, 1971, via Internet Archive, borrow-only) — reference.
- Churchward, *Tongan Grammar* — reference.

**Explicitly excluded:** Citonga resources (Zambia) — a different language that shares the name.

## Content plan (v1)

Per language:

- **Alphabet & sounds module** (interactive, kid-friendly): Tongan — 16 letters, fakauʻa (glottal stop) and toloi (long vowel) with minimal pairs (anga/'anga, kaka/kākā); Potawatomi — CPN orthography sound guide with the community's own audio.
- **12 starter lessons** across all three age bands, themes drawn from the sources' own strengths: family & home, food & meals, greetings & manners, numbers, animals, land & weather, body, colors, daily phrases. Kid lessons are shorter, image-emoji-supported, grown-up-guided; adult lessons add grammar notes (e.g. Tongan sentence pattern, Potawatomi verb classes as covered by CPN's own materials).
- **Phrasebook:** ~150 sourced entries per language, each with `src` and `audio` link where the source has one.
- **Quizzes with an explanation for every answer** (build-enforced, carried over from Lingua's rule).
- **Culture sections:** 4–6 per language, links-first, factual only.
- **Free resources page** per language (modeled on Lingua's), sorted by age band.
- **Review:** spaced repetition (1, 3, 7, 14, 30 days) over learned and saved words.
- **Daily challenge:** only if the sourced content base supports a seeded 10-item generator without padding; decide during build and say so — no filler.

## Open items for Bryce / the friend

1. Which Potawatomi community the friend's family belongs to (CPN orthography is the default here; the app states this on its About page and the friend can correct variant forms).
2. The friend — ideally with a fluent speaker or CPN's department — reviews content before it's shared beyond the family. The app will include a one-tap "report a correction" affordance (mailto) from the credits page.
3. Repo name and GitHub push require Bryce's explicit go (external action).

## Builder check — settled calls (2026-11-16, reviewer: Kimi K2.7 Code)

The builder-check subagent raised six questions. Each is settled here as a design call; none require Bryce's input before the build.

1. **Lesson volume / age bands.** 12 core themes per language, authored once per language as one lesson object; the age band adjusts presentation (kids: shorter vocab list, emoji support, grown-up guidance; adult: adds grammar notes from the sources). Not 36 separate authored variants. Why: keeps content honest (one vetted source set per theme) and authoring feasible.
2. **"Stage" on the home screen.** Stages are Lingua's proven progression — *Start here → Practice → Go further* — mapped to family terms (*First words → Practice together → Go further*). The age-band track picker filters presentation within each stage. Why: reuses a tested navigation shape; no second taxonomy.
3. **CPN audio offline.** Default: stream CPN dictionary audio via link-outs, cache nothing by default (terms of use for redistribution are unknown). Text content works fully offline; audio needs a connection, and the UI says so. If the friend asks CPN and gets permission to cache/redistribute, an offline audio pack becomes a v2 item. The "ask CPN" line is already in Open items.
4. **Progress model.** Named per-child profiles, each with its own spaced-repetition state; one active at a time, switched from the home screen; a parent can run any profile's lesson live. Why: multiple kids with one device is the realistic setup; per-profile review queues keep the SRS honest.
5. **`src` rule for non-web sources.** The build accepts either a URL source OR a named non-web attribution (speaker name, relationship/community, date). Validation: non-empty and either `http(s)` URL or explicit attribution object. Why: family recordings are a real path in this app and blocking them would defeat the purpose.
6. **Culture sections.** Keep Lingua's per-lesson culture block (brief, factual) AND a standalone Culture hub page per language with the 4–6 link-first entries. Why: lessons stay one-stop; the hub is where community links live.

## What's left to the builder

- Exact schema/port decisions, CSS, PWA manifest, accessibility (WCAG AA: large touch targets, keyboard nav, reduced-motion support), which Lingua features to keep (XP/streaks — keep, kid-friendly; quiet mode — keep), lesson-authoring order, and how the build script enforces `src`.

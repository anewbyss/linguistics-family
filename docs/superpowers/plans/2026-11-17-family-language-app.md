# Family Language App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A multi-age family language app for lea faka-Tonga and Bodéwadmimwen (Potawatomi), built as a raea app, with every content item source-attributed and enforced by a build check.

**Architecture:** Content lives as JSON data files (`content/<lang>.json`) authored from verified community sources; a zero-dependency Node check script (`scripts/check-content.mjs`) fails the build if any vocabulary/quiz/culture item lacks a source (URL or named attribution). The interface is a raea app (`app/app.tsx`, target web) that imports the bundled content, renders home → track → lesson → practice screens plus credits/resources, and stores per-profile progress via raea storage.

**Tech Stack:** raea 0.1.2-rc3 (React/TSX compositions, `raea app check` headless verification), Node 22 for the content check, plain JSON content, GitHub repo anewbyss/linguistics-family (public).

**Spec:** `docs/superpowers/specs/2026-11-16-family-language-app-design.md` (adapted 2026-11-17: full raea app chosen by Bryce, replacing the phone-PWA approach; offline/speech constraints change accordingly — desktop raea host runs the app; sourcing, multi-age tracks, audio link-outs, credits all unchanged).

## Global Constraints

- Zero npm dependencies for the content check (stdlib Node only); raea SDK for the app.
- Every `P` (word/phrase) entry, every quiz item, every culture fact carries `src`: either `{url, name}` or `{name, attribution, date}` (family/speaker recordings). `scripts/check-content.mjs` exits 1 otherwise.
- No real names of the friend or children anywhere in repo or app text.
- No AI-invented vocabulary, stories, or cultural lore; culture sections link out to community materials.
- README + in-app credits state: study aid, not an authority; CPN Language Department and Tongan community teachers are the authority.
- Potawatomi follows CPN orthography, stated in-app; Tongan follows standard orthography with fakauʻa (ʻ) and toloi (macron).

## Review Focus

1. **Unsourced entry slips in** → expect build failure naming the entry. Test: check script rejects a fixture missing `src`.
2. **Fake-attribution bypass** → expect failure when `src.url` is not http(s) AND no `attribution` object. Test: fixture with malformed src fails.
3. **Age band leaks adult grammar to kids** → kids view shows shorter vocab and no grammar notes. Test: app check step renders kids track and tree.json shows no grammar section.
4. **Progress mix-up between profiles** → each profile's review queue is independent. Test: two profiles, different review states, switch, verify isolation.
5. **Audio link points at nothing** → every audio URL is validated (https, from known-good domains: potawatomidictionary.com, files.peacecorps.gov, youtube.com/youtu.be). Test: check script rejects foreign/broken audio hosts.

---

### Task 1: Scaffold + content check (TDD)

**Files:** Create `package.json`, `.gitignore`, `LICENSE`, `README.md`, `scripts/check-content.mjs`, `content/tongan.json`, `content/potawatomi.json`, `tests/check-content.test.mjs`, `tests/fixtures/bad-*.json`.

**Interfaces:**
- Produces: `node scripts/check-content.mjs [--all]` → exit 0 valid / 1 invalid, errors printed with entry id. JSON schema: `{ id, lang, title, ageBands: [kids|youth|adult], alphabet?: {...}, lessons: [{id, title, band, vocab: [{t, en, note?, src, audio?}], examples, grammarNotes?, culture?, quiz: [{q, options, answer, explain, src}]}], phrasebook: [{t, en, src, audio?}] }`.

- [ ] Step 1: failing test — fixture missing src fails check; fixture with URL src passes; malformed src (no url/attribution) fails; audio host not on allowlist fails.
- [ ] Step 2: run, expect fail (no script yet).
- [ ] Step 3: implement check script.
- [ ] Step 4: run tests, pass.
- [ ] Step 5: commit `feat: content check with source enforcement`.

### Task 2: Seed content from verified sources (2 sample lessons + phrasebook starters per language)

**Files:** Modify `content/tongan.json`, `content/potawatomi.json`.

Sources (verbatim-extract only):
- Tongan: Peace Corps Tonga Language Lessons (public domain) — greetings/phrases/numbers tables; audio links to its recordings.
- Potawatomi: CPN language updates on potawatomi.org (summer words set: Niben, Waskonédo, Gmowen…) with potawatomidictionary.com links; pronunciation from CPN materials.

- [ ] Step 1: author JSON with src on every entry.
- [ ] Step 2: `node scripts/check-content.mjs` passes.
- [ ] Step 3: spot-verify 5 random entries against source pages (curl).
- [ ] Step 4: commit `feat: seed tongan + potawatomi starter content (sourced)`.

### Task 3: raea app shell (home, tracks, lesson view, quiz)

**Files:** Create `app/app.tsx`, `app/theme.ts`, `app/data.ts` (imports content JSON), `app/screens/*.tsx`.

**Interfaces:** `app = { target: "web", title: "Family Languages", size: [1100, 720] }`; screens read `data.ts` exports `LANGS`, `getTrack(lang, band)`, `buildQuiz(lesson)`.

- [ ] Step 1: implement home (two language cards + track picker), lesson list grouped First words → Practice together → Go further, lesson view (vocab cards with audio buttons → os.open the source audio, grammar notes for adults only, culture block), quiz flow with explanations.
- [ ] Step 2: `raea app check app.tsx --png out/` with steps: open → pick Tongan → pick kids → open first lesson → answer a quiz item; read PNGs (text fits, nothing clipped).
- [ ] Step 3: fix what the check names; re-check.
- [ ] Step 4: commit `feat: raea app shell`.

### Task 4: Profiles + spaced review

**Files:** Modify `app/screens/*`, add `app/store.ts`.

- [ ] Step 1: named profiles (localStorage via raea `net.storage`), each with SRS queue (1,3,7,14,30 d) over learned vocab; switching profiles isolates state.
- [ ] Step 2: `raea app check` steps create two profiles, learn one word in each, switch, verify queues differ (tree.json).
- [ ] Step 3: commit `feat: profiles and spaced review`.

### Task 5: Full content build-out (12 themes × 2 languages, phrasebook ~150/lang)

**Files:** `content/tongan.json`, `content/potawatomi.json` grown from Task 2 seeds.

- [ ] Step 1: per-theme authoring passes with parallel subagents (one per language), each entry sourced verbatim from the source list; subagent output runs through `check-content.mjs`.
- [ ] Step 2: 5-entry random spot-verify per language against sources.
- [ ] Step 3: commit per language: `feat: tongan full starter set`, `feat: potawatomi full starter set`.

### Task 6: Resources + credits pages, raea polish (intro animation, theme)

**Files:** `app/screens/resources.tsx`, `app/screens/credits.tsx`, `app/intro.tsx`.

- [ ] Step 1: resources page (sorted by age band, links-first), credits page (all sources + authority statement + report-a-correction mailto).
- [ ] Step 2: raea intro title animation (code-rendered, no generative art).
- [ ] Step 3: `raea app check` full pass + PNG review.
- [ ] Step 4: commit `feat: resources, credits, intro polish`.

### Task 7: Final verification + delivery

- [ ] Step 1: full test run (`node --test` + `raea app check --video`).
- [ ] Step 2: push milestones to GitHub (with Bryce's standing push-yes), report link + what to check.
- [ ] Step 3: hand to the friend for community review (per design Open items).

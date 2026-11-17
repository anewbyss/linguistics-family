# Family Languages: lea faka-Tonga + Bodéwadmimwen

A multi-age family language app for **Tongan** and **Potawatomi**, built for a
father teaching his kids his culture. Built with [raea](https://raea.io)
(desktop app) and a zero-dependency content pipeline.

**This app is a study aid, not an authority.** The authority is the community:
for Potawatomi, the [Citizen Potawatomi Nation Language Department](https://www.potawatomiheritage.com/language/language-dept/)
(classes at [learning.potawatomi.org](https://learning.potawatomi.org), dictionary at
[potawatomidictionary.com](https://www.potawatomidictionary.com)); for Tongan,
Tongan teachers and community schools. Corrections are welcome — open an issue.

## Ground rules (enforced by the build)

- **Every vocabulary item, sentence, and quiz fact carries a source** — a URL
  or a named speaker attribution. `node scripts/check-content.mjs` fails the
  build if anything is unsourced.
- **No invented language content.** Words come from the community's own
  materials; nothing is made up.
- **No private family information** appears in this repo.
- Potawatomi content follows **CPN orthography**; Tongan follows standard
  orthography (fakauʻa ʻ and toloi macrons). Regional variants exist — your
  community's usage is the one to keep.

## Run it

```sh
npm run check     # validate content + sources
npm test          # content-check tests
npm run app       # launch the raea app (requires raea on PATH)
npm run app:check # headless verification + screenshots
```

## Sources

See `content/*.json` (each entry's `src`) and the in-app credits page.
Key sources: CPN online dictionary, CPN language courses and updates,
US Peace Corps Tonga language lessons (public domain), leafakatonga.org,
NZ Ministry of Education Tongan resources.

Code: MIT (see LICENSE). Content: attributed to its sources, not re-licensed.

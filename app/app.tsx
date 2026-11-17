import { useEffect, useState } from "react";
import { DATA, TRACKS, type LangDoc, type Lesson, type Vocab } from "./data.gen";
import { schedule, dueItems, describeLevel, DAY } from "./srs.mjs";

export const app = { target: "web", title: "Family Languages", size: [1100, 720], minSize: [820, 560] };

// The check walks the real task: mark two words learned (they schedule for
// tomorrow), confirm the review queue is honestly "all caught up", then add a
// second child's profile and confirm it starts clean.
export const steps = [
  { press: "lang-tongan" },
  { press: "lesson-card-to-greet-1" },
  { press: "learn-0" },
  { press: "learn-1" },
  { press: "back" },
  { press: "review-open" },
  { press: "review-back" },
  { press: "profile-open" },
  { type: "Kid Two", into: "profile-name" },
  { press: "profile-add" },
  { press: "profile-pick-1" },
  { press: "lesson-card-to-greet-1" },
];

type Learned = { t: string; en: string; state: { level: number; due: number } };
type Profile = { name: string; band: string; learned: Record<string, Learned> };

const freshProfile = (name: string, band = "kids"): Profile => ({ name, band, learned: {} });

const STORAGE_KEY = "family-languages-profiles";
async function persist(profiles: Profile[]) {
  try {
    // @ts-expect-error host wire provided by raea at runtime
    const w = await import("@raea/ui/wire");
    await w.call("net.storage.set", { key: STORAGE_KEY, value: JSON.stringify(profiles) });
  } catch {
    /* headless check or storage unavailable — in-memory is fine */
  }
}

function openExternal(url: string) {
  try {
    // @ts-expect-error host wire provided by raea at runtime
    import("@raea/ui/wire").then((w: any) => w.call("os.open", { url }));
  } catch {
    /* headless check: nothing to open */
  }
}

const BAND_LABEL: Record<string, string> = { kids: "Start together", youth: "Keep going", adult: "Go deeper" };
const BAND_ORDER = ["kids", "youth", "adult"];

function TopBar({ title, onHome, onCredits, back }: { title: string; onHome: () => void; onCredits: () => void; back?: () => void }) {
  return (
    <div data-testid="topbar" className="flex flex-row items-center gap-3 border-b border-zinc-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      {back && (
        <button data-testid="back" onClick={back} className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
          ← Back
        </button>
      )}
      <span className="flex-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</span>
      <button data-testid="top-home" onClick={onHome} className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">Home</button>
      <button data-testid="top-credits" onClick={onCredits} className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">Sources & credits</button>
    </div>
  );
}

function ProfileBar({ profiles, active, onSwitch, onAdd, onOpen, open }: {
  profiles: Profile[]; active: number; onSwitch: (i: number) => void; onAdd: (name: string) => void; onOpen: () => void; open: boolean;
}) {
  const [name, setName] = useState("");
  return (
    <div data-testid="profile-bar" className="flex flex-row flex-wrap items-center gap-2 border-b border-zinc-200 bg-white px-5 py-2 dark:border-zinc-800 dark:bg-zinc-950">
      <span className="text-xs text-zinc-500">Learning as</span>
      <button data-testid="profile-open" onClick={onOpen} className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-800 hover:border-emerald-500 dark:border-zinc-600 dark:text-zinc-100">
        {profiles[active]?.name ?? "?"} ({profiles[active]?.band ?? ""})
      </button>
      {open && (
        <div data-testid="profile-panel" className="flex flex-row flex-wrap items-center gap-2">
          <input
            data-testid="profile-name"
            aria-label="New profile name"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            placeholder="Add someone…"
            className="h-8 w-40 rounded-md border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            data-testid="profile-add"
            onClick={() => { if (name.trim()) { onAdd(name.trim()); setName(""); } }}
            className="rounded-md bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700"
          >
            Add profile
          </button>
          {profiles.map((p, i) => (
            <button
              key={i}
              data-testid={`profile-pick-${i}`}
              onClick={() => { onSwitch(i); onOpen(); }}
              className={"rounded-md px-2 py-1 text-xs " + (i === active ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300")}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VocabCard({ v, i, big, learnedState, onLearn }: { v: Vocab; i: number; big: boolean; learnedState?: Learned; onLearn: () => void }) {
  return (
    <div data-testid={`vocab-${i}`} className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <span className={(big ? "text-2xl " : "text-lg ") + "font-semibold text-zinc-900 dark:text-zinc-50"}>{v.t}</span>
      <span className="text-sm text-zinc-600 dark:text-zinc-300">{v.en}</span>
      {v.note && <span className="text-xs italic text-zinc-500">say it: {v.note}</span>}
      <div className="mt-1 flex flex-row flex-wrap items-center gap-3 text-xs">
        {v.audio && (
          <button data-testid={`audio-${i}`} onClick={() => openExternal(v.audio!)} className="rounded-md bg-emerald-600 px-2 py-1 text-white hover:bg-emerald-700">
            ▶ Hear it
          </button>
        )}
        <button data-testid={`learn-${i}`} onClick={onLearn} className="rounded-md border border-emerald-500 px-2 py-1 text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950">
          {learnedState ? `✓ reviews ${describeLevel(learnedState.state.level)}` : "✓ I know this"}
        </button>
        <button data-testid={`src-${i}`} onClick={() => v.src.url && openExternal(v.src.url)} className="text-emerald-700 underline decoration-dotted dark:text-emerald-400">
          source: {v.src.name}
        </button>
      </div>
    </div>
  );
}

function ReviewScreen({ lang, profile, onSchedule, onBack }: {
  lang: LangDoc; profile: Profile; onSchedule: (key: string, t: string, en: string, correct: boolean) => void; onBack: () => void;
}) {
  const now = Date.now();
  const queue: { key: string; t: string; en: string }[] = [];
  for (const l of lang.lessons) {
    l.vocab.forEach((v, i) => {
      const key = `${l.id}:${i}`;
      if (profile.learned[key]) queue.push({ key, t: profile.learned[key].t, en: profile.learned[key].en });
    });
  }
  const due = dueItems(queue.map((q) => ({ ...q, state: profile.learned[q.key]?.state })), now);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const item = due[pos];

  const judge = (correct: boolean) => {
    onSchedule(item.key, item.t, item.en, correct);
    setRevealed(false);
    if (correct) setDone((d) => d + 1);
    setPos((p) => p + 1);
  };

  if (!item) {
    const future = queue.map((q) => profile.learned[q.key]?.state?.due ?? Infinity);
    const nextDue = Math.min(...future);
    return (
      <div data-testid="review" className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 p-8 dark:bg-zinc-950">
        <div data-testid="review-done" className="max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950">
          <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">All caught up — {done} reviewed.</p>
          <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
            {Number.isFinite(nextDue)
              ? `The next words come back ${Math.round((nextDue - now) / DAY) <= 1 ? "tomorrow" : `in about ${Math.round((nextDue - now) / DAY)} days`}. Mark new words with ✓ I know this and they join the queue.`
              : "Mark words with ✓ I know this in a lesson and they'll come back here for review."}
          </p>
          <button data-testid="review-back" onClick={onBack} className="mt-3 rounded-md border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-600 dark:text-zinc-200">← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="review" className="flex flex-1 flex-col items-center justify-center gap-5 bg-zinc-50 p-8 dark:bg-zinc-950">
      <p className="text-xs text-zinc-500">{due.length - pos} to review</p>
      <p data-testid="review-word" className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{item.t}</p>
      {!revealed ? (
        <button data-testid="review-reveal" onClick={() => setRevealed(true)} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm text-white hover:bg-emerald-700">Show meaning</button>
      ) : (
        <div data-testid="review-answer" className="flex flex-col items-center gap-3">
          <p className="text-xl text-zinc-800 dark:text-zinc-100">{item.en}</p>
          <div className="flex flex-row gap-3">
            <button data-testid="review-known" onClick={() => judge(true)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">I knew it</button>
            <button data-testid="review-again" onClick={() => judge(false)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:text-zinc-200">Still learning</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonScreen({ lang, lesson, band, learned, onLearn, onBack }: {
  lang: LangDoc; lesson: Lesson; band: string;
  learned: (key: string) => Learned | undefined; onLearn: (key: string, v: Vocab) => void; onBack: () => void;
}) {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const finished = picked !== null && qi >= lesson.quiz.length;
  const q = lesson.quiz[qi];
  const isKid = band === "kids";

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setRight((r) => r + 1);
  };
  const next = () => {
    setPicked(null);
    setQi((x) => Math.min(x + 1, lesson.quiz.length));
  };

  return (
    <div data-testid="lesson" className="flex flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <div data-testid="lesson-left" className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        <div className="flex flex-row items-baseline gap-3">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{lesson.emoji ? lesson.emoji + " " : ""}{lesson.title}</h1>
          {lesson.nativeTitle && <span className="text-sm italic text-zinc-500">{lesson.nativeTitle}</span>}
        </div>
        {lesson.vocab.map((v, i) => {
          const key = `${lesson.id}:${i}`;
          return <VocabCard key={key} v={v} i={i} big={isKid} learnedState={learned(key)} onLearn={() => onLearn(key, v)} />;
        })}
        {!isKid && lesson.grammarNotes && lesson.grammarNotes.length > 0 && (
          <div data-testid="grammar" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">How it works (from the sources)</h2>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              {lesson.grammarNotes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}
        {isKid && (
          <p data-testid="kids-note" className="text-xs text-zinc-500">
            Grown-ups: tap "✓ I know this" as your kid picks words up — they come back for review. Source links show where every word comes from.
          </p>
        )}
        {lesson.culture && lesson.culture.length > 0 && (
          <div data-testid="culture" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">From the community</h2>
            <ul className="mt-2 flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              {lesson.culture.map((c, i) => (
                <li key={i}>
                  {c.text}{" "}
                  <button data-testid={`culture-${i}`} onClick={() => c.src.url && openExternal(c.src.url)} className="text-emerald-700 underline decoration-dotted dark:text-emerald-400">
                    source: {c.src.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div data-testid="lesson-right" className="flex w-[380px] flex-col gap-3 overflow-y-auto border-l border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        {!finished && q ? (
          <section data-testid="quiz" className="flex flex-col">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Check yourself ({qi + 1}/{lesson.quiz.length})</h2>
            <p className="mt-2 text-base text-zinc-900 dark:text-zinc-50">{q.q}</p>
            <div className="mt-3 flex flex-col gap-2">
              {q.options.map((o, i) => {
                const revealed = picked !== null;
                const state = !revealed ? "idle" : i === q.answer ? "right" : i === picked ? "wrong" : "idle";
                return (
                  <button
                    key={i}
                    data-testid={`quiz-opt-${i}`}
                    onClick={() => answer(i)}
                    className={
                      "rounded-lg border px-4 py-3 text-left text-sm " +
                      (state === "right"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                        : state === "wrong"
                          ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-200"
                          : "border-zinc-300 bg-white text-zinc-800 hover:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100")
                    }
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div data-testid="explanation" className="mt-3 rounded-lg bg-zinc-100 p-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                <p>{picked === q.answer ? "✅ Right. " : "❌ Not this one. "}{q.explain}</p>
                <div className="mt-2 flex flex-row items-center gap-2">
                  <button data-testid="quiz-src" onClick={() => q.src.url && openExternal(q.src.url)} className="text-xs text-emerald-700 underline decoration-dotted dark:text-emerald-400">
                    source: {q.src.name}
                  </button>
                  <button data-testid="next-question" onClick={next} className="rounded-md bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700">Next</button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section data-testid="quiz-done" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
              Done — {right} of {lesson.quiz.length} right. Every answer above is explained, with its source.
            </p>
            <div className="mt-2 flex flex-row flex-wrap gap-2">
              <button data-testid="practice-again" onClick={() => { setQi(0); setPicked(null); setRight(0); }} className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700">Practice again</button>
              <button data-testid="back-lessons" onClick={onBack} className="rounded-md border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-600 dark:text-zinc-200">More lessons</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CreditsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div data-testid="credits" className="flex flex-1 flex-col overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Sources & credits</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">
        This app is a <strong>study aid, not an authority</strong>. The authority is the community: for Potawatomi, the
        Citizen Potawatomi Nation Language Department; for Tongan, Tongan teachers and community schools. Every word,
        sentence and quiz fact in this app names where it came from. Corrections are welcome — open an issue on the
        project page, or write to the family that maintains it.
      </p>
      <div className="mt-5 flex flex-col gap-4">
        {DATA.map((d) => (
          <div key={d.lang} data-testid={`credits-${d.lang}`} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{d.title} ({d.lang})</h2>
            <p className="mt-1 text-xs text-zinc-500">{d.orthography}</p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              {Array.from(new Map(d.lessons.flatMap((l) => [...l.vocab, ...l.quiz.map((q) => ({ src: q.src })), ...(l.culture ?? [])]).map((e) => [e.src.url ?? e.src.name, e.src])).values()).map((s, i) => (
                <li key={i}>
                  <button data-testid={`credit-${d.lang}-${i}`} onClick={() => s.url && openExternal(s.url)} className="text-emerald-700 underline decoration-dotted dark:text-emerald-400">
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button data-testid="credits-back" onClick={onBack} className="mt-5 w-fit rounded-md border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-600 dark:text-zinc-200">← Back</button>
    </div>
  );
}

export default function FamilyLanguages() {
  const [screen, setScreen] = useState<"home" | "lang" | "lesson" | "review" | "credits">("home");
  const [langIdx, setLangIdx] = useState(0);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [profiles, setProfiles] = useState<Profile[]>([freshProfile("First learner")]);
  const [active, setActive] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);

  // restore saved profiles when the host provides storage
  useEffect(() => {
    (async () => {
      try {
        // @ts-expect-error host wire provided by raea at runtime
        const w = await import("@raea/ui/wire");
        const r = await w.call("net.storage.get", { key: STORAGE_KEY });
        const saved = typeof r?.value === "string" ? JSON.parse(r.value) : r?.value;
        if (Array.isArray(saved) && saved.length && saved[0]?.name && saved[0]?.learned) {
          setProfiles(saved);
          setActive(0);
        }
      } catch {
        /* no storage — keep defaults */
      }
    })();
  }, []);

  const updateActive = (fn: (p: Profile) => Profile) => {
    setProfiles((ps) => {
      const next = ps.map((p, i) => (i === active ? fn(p) : p));
      persist(next);
      return next;
    });
  };

  const markLearned = (key: string, v: Vocab) => {
    updateActive((p) => {
      const learned = { ...p.learned };
      if (learned[key]) delete learned[key];
      else learned[key] = { t: v.t, en: v.en, state: schedule(learned[key]?.state, Date.now(), true) };
      return { ...p, learned };
    });
  };
  const judgeReview = (key: string, t: string, en: string, correct: boolean) => {
    updateActive((p) => {
      const cur = p.learned[key];
      return { ...p, learned: { ...p.learned, [key]: { t, en, state: schedule(cur?.state, Date.now(), correct) } } };
    });
  };

  const lang = DATA[langIdx];
  const lessons = lang?.lessons ?? [];
  const profile = profiles[active];
  const dueCount = (() => {
    const now = Date.now();
    let due = 0, learned = 0;
    for (const l of lessons) l.vocab.forEach((_, i) => {
      const st = profile?.learned[`${l.id}:${i}`]?.state;
      if (st) { learned++; if (st.due <= now) due++; }
    });
    return { due, learned };
  })();
  const learnedCount = dueCount.learned;

  if (screen === "credits") {
    return (
      <div data-testid="page" className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <CreditsScreen onBack={() => setScreen("home")} />
      </div>
    );
  }
  if (screen === "review") {
    return (
      <div data-testid="page" className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <TopBar title={`Review — ${profile?.name ?? ""}`} onHome={() => setScreen("home")} onCredits={() => setScreen("credits")} back={() => setScreen("lang")} />
        <ReviewScreen lang={lang} profile={profile} onSchedule={judgeReview} onBack={() => setScreen("lang")} />
      </div>
    );
  }
  if (screen === "lesson" && lessons[lessonIdx]) {
    return (
      <div data-testid="page" className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <TopBar title={lang.title} onHome={() => setScreen("home")} onCredits={() => setScreen("credits")} back={() => setScreen("lang")} />
        <LessonScreen
          lang={lang}
          lesson={lessons[lessonIdx]}
          band={profile?.band ?? "kids"}
          learned={(key) => profile?.learned[key]}
          onLearn={markLearned}
          onBack={() => setScreen("lang")}
        />
      </div>
    );
  }
  if (screen === "lang") {
    return (
      <div data-testid="page" className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <TopBar title={lang.title} onHome={() => setScreen("home")} onCredits={() => setScreen("credits")} />
        <ProfileBar profiles={profiles} active={active} open={profileOpen} onOpen={() => setProfileOpen((o) => !o)} onSwitch={setActive} onAdd={(name) => setProfiles((ps) => [...ps, freshProfile(name, profiles[active]?.band ?? "kids")])} />
        <div className="flex flex-1 flex-row gap-5 overflow-y-auto p-5">
          <div className="flex w-64 flex-col gap-3">
            <h2 data-testid="track-title" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Who's learning?</h2>
            {TRACKS.map((t) => (
              <button
                key={t.id}
                data-testid={`track-${t.id}`}
                onClick={() => updateActive((p) => ({ ...p, band: t.id }))}
                className={
                  "rounded-xl border p-3 text-left " +
                  (profile?.band === t.id
                    ? "border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950"
                    : "border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900")
                }
              >
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">{t.label}</span>
                <span className="block text-xs text-zinc-500">{t.blurb}</span>
              </button>
            ))}
            <button
              data-testid="review-open"
              onClick={() => setScreen("review")}
              className="mt-2 rounded-xl border border-emerald-600 bg-emerald-50 p-3 text-left dark:border-emerald-500 dark:bg-emerald-950"
            >
              <span className="block text-sm font-medium text-emerald-900 dark:text-emerald-200">Review</span>
              <span className="block text-xs text-emerald-700 dark:text-emerald-400">
                {learnedCount === 0
                  ? "Mark words with ✓ I know this, and they come back here"
                  : `${dueCount} of ${learnedCount} learned word${learnedCount === 1 ? "" : "s"} due now`}
              </span>
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <p className="text-xs text-zinc-500">{lang.orthography}</p>
            {BAND_ORDER.map((b) => {
              const group = lessons.filter((l) => l.band === b);
              if (!group.length) return null;
              return (
                <div key={b} data-testid={`band-${b}`} className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{BAND_LABEL[b]}</h3>
                  <div className="flex flex-row flex-wrap gap-3">
                    {group.map((l) => {
                      const idx = lessons.indexOf(l);
                      return (
                        <button
                          key={l.id}
                          data-testid={`lesson-card-${l.id}`}
                          onClick={() => { setLessonIdx(idx); setScreen("lesson"); }}
                          className="w-64 rounded-xl border border-zinc-200 bg-white p-4 text-left hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <span className="block text-lg">{l.emoji ?? "📘"}</span>
                          <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">{l.title}</span>
                          {l.nativeTitle && <span className="block text-xs italic text-zinc-500">{l.nativeTitle}</span>}
                          <span className="mt-1 block text-xs text-emerald-700 dark:text-emerald-400">{l.vocab.length} words · {l.quiz.length} questions</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  // home
  return (
    <div data-testid="page" className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <TopBar title="Family Languages" onHome={() => setScreen("home")} onCredits={() => setScreen("credits")} />
      <ProfileBar profiles={profiles} active={active} open={profileOpen} onOpen={() => setProfileOpen((o) => !o)} onSwitch={setActive} onAdd={(name) => setProfiles((ps) => [...ps, freshProfile(name, profiles[active]?.band ?? "kids")])} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
        <p className="max-w-xl text-center text-sm text-zinc-600 dark:text-zinc-300">
          One family, two languages. Every word here comes from the community's own teachers, with its source one tap away.
        </p>
        <div className="flex flex-row flex-wrap justify-center gap-5">
          {DATA.map((d, i) => (
            <button
              key={d.lang}
              data-testid={`lang-${d.lang}`}
              onClick={() => { setLangIdx(i); setScreen("lang"); }}
              className="w-72 rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="block text-4xl">{d.lang === "tongan" ? "🌺" : "🌳"}</span>
              <span className="mt-2 block text-lg font-semibold text-zinc-900 dark:text-zinc-50">{d.title}</span>
              <span className="block text-sm text-zinc-500">{d.lang === "tongan" ? "lea faka-Tonga · Kingdom of Tonga" : "Potawatomi · Citizen Potawatomi Nation orthography"}</span>
              <span className="mt-3 block text-xs text-emerald-700 dark:text-emerald-400">{d.lessons.length} lessons · {d.phrasebook?.length ?? 0} phrasebook entries</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

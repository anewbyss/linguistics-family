import { useState } from "react";
import { DATA, TRACKS, type LangDoc, type Lesson, type Vocab } from "./data.gen";

export const app = { target: "web", title: "Family Languages", size: [1100, 720], minSize: [820, 560] };

// The check walks the real task: pick a language, pick a track, open a lesson,
// answer a quiz item right, one wrong, finish, and visit the credits.
export const steps = [
  { press: "lang-tongan" },
  { press: "track-kids" },
  { press: "lesson-card-to-greet-1" },
  { press: "quiz-opt-1" },          // right answer -> explanation shows
  { press: "next-question" },
  { press: "quiz-opt-0" },          // wrong answer -> explanation still shows
  { press: "next-question" },       // quiz summary
  { press: "practice-again" },
  { press: "quiz-opt-0" },
  { press: "back" },
  { press: "top-home" },
  { press: "top-credits" },
];

const BAND_LABEL: Record<string, string> = { kids: "Start together", youth: "Keep going", adult: "Go deeper" };
const BAND_ORDER = ["kids", "youth", "adult"];

function openExternal(url: string) {
  // host call for the raea app; safe no-op fallback keeps checks headless-friendly
  try {
    // @ts-expect-error host wire provided by raea at runtime
    import("@raea/ui/wire").then((w: any) => w.call("os.open", { url }));
  } catch {
    /* headless check: nothing to open */
  }
}

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

function VocabCard({ v, i, big }: { v: Vocab; i: number; big: boolean }) {
  return (
    <div data-testid={`vocab-${i}`} className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <span className={(big ? "text-2xl " : "text-lg ") + "font-semibold text-zinc-900 dark:text-zinc-50"}>{v.t}</span>
      <span className="text-sm text-zinc-600 dark:text-zinc-300">{v.en}</span>
      {v.note && <span className="text-xs italic text-zinc-500">say it: {v.note}</span>}
      <div className="mt-1 flex flex-row items-center gap-3 text-xs">
        {v.audio && (
          <button data-testid={`audio-${i}`} onClick={() => openExternal(v.audio!)} className="rounded-md bg-emerald-600 px-2 py-1 text-white hover:bg-emerald-700">
            ▶ Hear it
          </button>
        )}
        <button data-testid={`src-${i}`} onClick={() => v.src.url && openExternal(v.src.url)} className="text-emerald-700 underline decoration-dotted dark:text-emerald-400">
          source: {v.src.name}
        </button>
      </div>
    </div>
  );
}

function LessonScreen({ lang, lesson, band, onBack }: { lang: LangDoc; lesson: Lesson; band: string; onBack: () => void }) {
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
        {lesson.vocab.map((v, i) => <VocabCard key={i} v={v} i={i} big={isKid} />)}
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
            Grown-ups: tap any "source" link to read or hear where the word comes from.
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
  const [screen, setScreen] = useState<"home" | "lang" | "lesson" | "credits">("home");
  const [langIdx, setLangIdx] = useState(0);
  const [band, setBand] = useState<string>("kids");
  const [lessonIdx, setLessonIdx] = useState(0);
  const lang = DATA[langIdx];
  const lessons = lang?.lessons ?? [];

  if (screen === "credits") {
    return (
      <div data-testid="page" className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <CreditsScreen onBack={() => setScreen("home")} />
      </div>
    );
  }
  if (screen === "lesson" && lessons[lessonIdx]) {
    return (
      <div data-testid="page" className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <TopBar title={lang.title} onHome={() => setScreen("home")} onCredits={() => setScreen("credits")} back={() => setScreen("lang")} />
        <LessonScreen lang={lang} lesson={lessons[lessonIdx]} band={band} onBack={() => setScreen("lang")} />
      </div>
    );
  }
  if (screen === "lang") {
    return (
      <div data-testid="page" className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <TopBar title={lang.title} onHome={() => setScreen("home")} onCredits={() => setScreen("credits")} />
        <div className="flex flex-1 flex-row gap-5 overflow-y-auto p-5">
          <div className="flex w-64 flex-col gap-3">
            <h2 data-testid="track-title" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Who's learning?</h2>
            {TRACKS.map((t) => (
              <button
                key={t.id}
                data-testid={`track-${t.id}`}
                onClick={() => setBand(t.id)}
                className={
                  "rounded-xl border p-3 text-left " +
                  (band === t.id
                    ? "border-emerald-600 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950"
                    : "border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900")
                }
              >
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">{t.label}</span>
                <span className="block text-xs text-zinc-500">{t.blurb}</span>
              </button>
            ))}
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

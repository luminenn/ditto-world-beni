import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Trophy,
  Flame,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Brush,
  Layers,
  Eraser,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { DittoSVG } from "./DittoSVG";

type VocabCard = {
  char: string; // kanji or jukugo
  reading: string; // hiragana
  romaji: string;
  meaning: string;
  choices: string[]; // hiragana readings incl. answer
};

const DECK: VocabCard[] = [
  { char: "日本語", reading: "にほんご", romaji: "nihongo", meaning: "Japanese language", choices: ["にほんご", "ちゅうごくご", "えいご", "かんこくご"] },
  { char: "友達", reading: "ともだち", romaji: "tomodachi", meaning: "Friend", choices: ["ともだち", "かぞく", "せんぱい", "こいびと"] },
  { char: "学校", reading: "がっこう", romaji: "gakkou", meaning: "School", choices: ["がっこう", "きょうしつ", "としょかん", "こうえん"] },
  { char: "先生", reading: "せんせい", romaji: "sensei", meaning: "Teacher", choices: ["せんせい", "がくせい", "いしゃ", "しゃちょう"] },
  { char: "本屋", reading: "ほんや", romaji: "hon'ya", meaning: "Bookstore", choices: ["ほんや", "はなや", "パンや", "にくや"] },
  { char: "猫", reading: "ねこ", romaji: "neko", meaning: "Cat", choices: ["ねこ", "いぬ", "うま", "とり"] },
  { char: "水", reading: "みず", romaji: "mizu", meaning: "Water", choices: ["みず", "おん", "かわ", "いし"] },
  { char: "空", reading: "そら", romaji: "sora", meaning: "Sky", choices: ["うみ", "くも", "そら", "ほし"] },
  { char: "月曜日", reading: "げつようび", romaji: "getsuyoubi", meaning: "Monday", choices: ["げつようび", "かようび", "すいようび", "きんようび"] },
  { char: "花火", reading: "はなび", romaji: "hanabi", meaning: "Fireworks", choices: ["はなび", "たきび", "ひばな", "かじ"] },
];

/** Simplified stroke hints: numbered dots + arrow direction per stroke start.
 *  Positions are % of canvas box. Not full stroke paths — a friendly guide. */
type StrokeHint = { n: number; x: number; y: number; arrow: "→" | "↓" | "↘" | "↙" | "↖" };
type TraceItem = { char: string; hints: StrokeHint[] };

const TRACE_DECK: TraceItem[] = [
  {
    char: "水",
    hints: [
      { n: 1, x: 50, y: 18, arrow: "↓" },
      { n: 2, x: 32, y: 52, arrow: "↙" },
      { n: 3, x: 62, y: 42, arrow: "↘" },
      { n: 4, x: 68, y: 62, arrow: "↘" },
    ],
  },
  {
    char: "火",
    hints: [
      { n: 1, x: 34, y: 28, arrow: "↙" },
      { n: 2, x: 62, y: 30, arrow: "↘" },
      { n: 3, x: 46, y: 40, arrow: "↓" },
      { n: 4, x: 58, y: 58, arrow: "↘" },
    ],
  },
  {
    char: "木",
    hints: [
      { n: 1, x: 22, y: 34, arrow: "→" },
      { n: 2, x: 50, y: 20, arrow: "↓" },
      { n: 3, x: 44, y: 48, arrow: "↙" },
      { n: 4, x: 58, y: 48, arrow: "↘" },
    ],
  },
  {
    char: "友",
    hints: [
      { n: 1, x: 28, y: 22, arrow: "→" },
      { n: 2, x: 60, y: 14, arrow: "↙" },
      { n: 3, x: 30, y: 52, arrow: "↘" },
      { n: 4, x: 62, y: 62, arrow: "↘" },
    ],
  },
  {
    char: "花",
    hints: [
      { n: 1, x: 26, y: 18, arrow: "→" },
      { n: 2, x: 60, y: 18, arrow: "↓" },
      { n: 3, x: 32, y: 50, arrow: "↘" },
      { n: 4, x: 60, y: 52, arrow: "↓" },
    ],
  },
  {
    char: "月",
    hints: [
      { n: 1, x: 30, y: 22, arrow: "↓" },
      { n: 2, x: 70, y: 22, arrow: "↙" },
      { n: 3, x: 32, y: 44, arrow: "→" },
      { n: 4, x: 32, y: 66, arrow: "→" },
    ],
  },
];

// Encouragement phrases (Japanese)
const HYPE_CORRECT = ["おめでとう！", "よくできました！", "すごい！", "その調子！"];
const HYPE_WRONG = ["よくやったけど…", "諦めないで！", "もう一回！", "だいじょうぶ！"];
const HYPE_IDLE = ["がんばって！", "いっしょに勉強しよう！"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Mode = "flash" | "trace";

function SpeechBubble({ text, mood }: { text: string; mood: "idle" | "correct" | "wrong" }) {
  const bg =
    mood === "correct" ? "var(--mint)" : mood === "wrong" ? "var(--butter)" : "var(--cream)";
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, scale: 0.85, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="relative rounded-2xl border-[3px] border-[var(--color-ink)] px-4 py-2 text-center text-sm font-bold shadow-[4px_4px_0_0_var(--color-ink)]"
      style={{ background: bg, maxWidth: 220 }}
    >
      {text}
      <span
        aria-hidden
        className="absolute -bottom-3 left-6 h-0 w-0"
        style={{
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "12px solid var(--color-ink)",
        }}
      />
      <span
        aria-hidden
        className="absolute -bottom-[7px] left-[27px] h-0 w-0"
        style={{
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: `9px solid ${bg}`,
        }}
      />
    </motion.div>
  );
}

function DittoMascot({ mood }: { mood: "idle" | "correct" | "wrong" }) {
  const anim =
    mood === "correct" ? "animate-joy" : mood === "wrong" ? "animate-shake" : "animate-float";
  const face = mood === "correct" ? "joy" : mood === "wrong" ? "sad" : "happy";
  const bubble =
    mood === "correct" ? pick(HYPE_CORRECT) : mood === "wrong" ? pick(HYPE_WRONG) : pick(HYPE_IDLE);
  // Memoize bubble text per mood so it doesn't reshuffle every render
  const stableBubble = useMemo(() => bubble, [mood]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex flex-col items-center gap-3">
      <SpeechBubble text={stableBubble} mood={mood} />
      <div key={mood} className={anim}>
        <DittoSVG size={190} mood={face} />
      </div>
    </div>
  );
}

export function StudyCorner() {
  const { t } = useLang();
  const [mode, setMode] = useState<Mode>("flash");

  return (
    <section id="study" className="mx-auto mt-20 w-[min(1100px,94%)] scroll-mt-28">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("study_title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t("study_sub")}
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-3">
        <button
          onClick={() => setMode("flash")}
          className="pill-btn pill-btn-hover text-sm"
          style={{
            background: mode === "flash" ? "var(--ditto-pink)" : "var(--cream)",
            color: mode === "flash" ? "#fff" : "var(--ink)",
          }}
        >
          <Layers size={16} /> Kanji Flashcards
        </button>
        <button
          onClick={() => setMode("trace")}
          className="pill-btn pill-btn-hover text-sm"
          style={{
            background: mode === "trace" ? "var(--ditto-pink)" : "var(--cream)",
            color: mode === "trace" ? "#fff" : "var(--ink)",
          }}
        >
          <Brush size={16} /> Kanji Tracing
        </button>
      </div>

      {mode === "flash" ? <Flashcards /> : <TracingCanvas />}
    </section>
  );
}

function Flashcards() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [picked, setPicked] = useState<string | null>(null);

  const card = DECK[idx % DECK.length];
  const [shuffled, setShuffled] = useState<string[]>(card.choices);
  useEffect(() => {
    setShuffled(shuffle(card.choices));
  }, [idx, card.choices]);

  const choose = (choice: string) => {
    if (feedback !== "idle") return;
    setPicked(choice);
    if (choice === card.reading) {
      setFeedback("correct");
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
    } else {
      setFeedback("wrong");
      setStreak(0);
    }
  };

  const next = () => {
    setFeedback("idle");
    setPicked(null);
    setIdx((i) => i + 1);
  };

  return (
    <div className="card-doodle p-6 sm:p-8">
      <div
        className="mx-auto mb-6 inline-flex w-full max-w-md items-center justify-around rounded-2xl border-[3px] border-[var(--color-ink)] px-4 py-2 text-sm font-bold"
        style={{
          background: "linear-gradient(180deg, #D9A46B 0%, #B8814A 100%)",
          color: "#2D2A2E",
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.35), 4px 4px 0 0 var(--color-ink)",
        }}
      >
        <div className="inline-flex items-center gap-1.5">
          <Trophy size={16} /> {t("score")}: {score}
        </div>
        <div className="inline-flex items-center gap-1.5">
          <Flame size={16} /> {t("streak")}: {streak}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr] md:items-center">
        <div className="flex justify-center">
          <DittoMascot mood={feedback} />
        </div>

        <div>
          <motion.div
            key={idx}
            initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto flex min-h-[10rem] w-fit items-center justify-center rounded-[2rem] border-[3px] border-[var(--color-ink)] bg-[var(--ditto-pink)] px-8 py-4 font-bold text-white shadow-[5px_5px_0_0_var(--color-ink)]"
            style={{ fontSize: card.char.length > 2 ? "3.5rem" : "4.5rem", lineHeight: 1 }}
          >
            {card.char}
          </motion.div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {shuffled.map((c) => {
              const isPicked = picked === c;
              const isAnswer = c === card.reading;
              const revealed = feedback !== "idle";
              const bg =
                revealed && isAnswer
                  ? "var(--mint)"
                  : revealed && isPicked
                    ? "color-mix(in oklab, var(--destructive) 40%, white)"
                    : "var(--cream)";
              return (
                <motion.button
                  key={c}
                  whileHover={{ y: -3, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={revealed}
                  onClick={() => choose(c)}
                  className="card-doodle-sm px-3 py-3 text-xl font-bold"
                  style={{ background: bg }}
                >
                  {c}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {feedback === "correct" && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="mt-5 rounded-2xl border-[3px] border-[var(--color-ink)] p-4 text-center shadow-[5px_5px_0_0_var(--color-ink)]"
                style={{ background: "var(--butter)" }}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Meaning
                </div>
                <div className="text-2xl font-extrabold">{card.meaning}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Romaji
                </div>
                <div className="text-lg font-bold italic">{card.romaji}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex min-h-[2.5rem] items-center justify-between gap-3">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
              {feedback === "correct" && (
                <>
                  <Sparkles size={14} /> {t("correct")}
                </>
              )}
              {feedback === "wrong" && (
                <>
                  <RefreshCw size={14} /> {t("wrong")}
                </>
              )}
            </p>
            <button
              onClick={next}
              disabled={feedback === "idle"}
              className="pill-btn pill-btn-hover text-sm disabled:opacity-50"
              style={{ background: "var(--ditto-purple)" }}
            >
              {t("next")} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TracingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [idx, setIdx] = useState(0);
  const [mood, setMood] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHints, setShowHints] = useState(true);
  const item = TRACE_DECK[idx % TRACE_DECK.length];

  const size = 420;

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
  };

  useEffect(() => {
    clear();
    setMood("idle");
  }, [idx]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * c.width,
      y: ((e.clientY - rect.top) / rect.height) * c.height,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = getPos(e);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const p = getPos(e);
    ctx.strokeStyle = "#B892FF";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const done = () => {
    setMood("correct");
    setTimeout(() => {
      setMood("idle");
      setIdx((i) => i + 1);
    }, 1400);
  };

  return (
    <div className="card-doodle p-6 sm:p-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-center">
        <div className="flex justify-center">
          <DittoMascot mood={mood} />
        </div>

        <div className="flex flex-col items-center">
          <div
            className="relative rounded-3xl border-[3px] border-[var(--color-ink)] shadow-[6px_6px_0_0_var(--color-ink)] overflow-hidden"
            style={{ background: "var(--cream)", width: "min(100%, 420px)", aspectRatio: "1 / 1" }}
          >
            {/* Guide kanji */}
            <div
              className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-bold"
              style={{
                color: "rgba(74,44,91,0.14)",
                fontSize: "min(80vw, 340px)",
                lineHeight: 1,
              }}
              aria-hidden
            >
              {item.char}
            </div>

            {/* Stroke order overlay */}
            {showHints && (
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {item.hints.map((h) => (
                  <div
                    key={h.n}
                    className="absolute flex items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--color-ink)] text-[11px] font-extrabold text-[var(--color-ink)]"
                      style={{ background: "var(--butter)" }}
                    >
                      {h.n}
                    </span>
                    <span className="text-lg font-bold text-[var(--color-ink)]">{h.arrow}</span>
                  </div>
                ))}
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerCancel={end}
              onPointerLeave={end}
              className="relative h-full w-full touch-none"
              style={{ cursor: "crosshair" }}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowHints((v) => !v)}
              className="pill-btn pill-btn-hover text-sm"
              style={{ background: "var(--sky)" }}
            >
              {showHints ? "Hide" : "Show"} Stroke Order
            </button>
            <button
              onClick={clear}
              className="pill-btn pill-btn-hover text-sm"
              style={{ background: "var(--butter)" }}
            >
              <Eraser size={14} /> Clear
            </button>
            <button
              onClick={done}
              className="pill-btn pill-btn-hover text-sm"
              style={{ background: "var(--mint)" }}
            >
              <Sparkles size={14} /> I'm Done!
            </button>
            <button
              onClick={() => setIdx((i) => i + 1)}
              className="pill-btn pill-btn-hover text-sm"
              style={{ background: "var(--ditto-pink)", color: "#fff" }}
            >
              Next Kanji <ArrowRight size={14} />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Follow the numbered arrows to trace with proper stroke order.
          </p>
        </div>
      </div>
    </div>
  );
}

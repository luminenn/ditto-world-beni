import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

type KanjiCard = {
  char: string;
  reading: string; // hiragana answer
  romaji: string;
  meaning: string;
  choices: string[]; // hiragana readings
};

const DECK: KanjiCard[] = [
  { char: "水", reading: "みず", romaji: "mizu", meaning: "Water", choices: ["みず", "おん", "かわ", "いし"] },
  { char: "火", reading: "ひ", romaji: "hi", meaning: "Fire", choices: ["ひ", "き", "つち", "かぜ"] },
  { char: "木", reading: "き", romaji: "ki", meaning: "Tree", choices: ["は", "き", "ね", "もり"] },
  { char: "猫", reading: "ねこ", romaji: "neko", meaning: "Cat", choices: ["いぬ", "うま", "ねこ", "とり"] },
  { char: "友", reading: "とも", romaji: "tomo", meaning: "Friend", choices: ["とも", "かぞく", "せんせい", "がくせい"] },
  { char: "花", reading: "はな", romaji: "hana", meaning: "Flower", choices: ["はな", "くさ", "き", "たね"] },
  { char: "空", reading: "そら", romaji: "sora", meaning: "Sky", choices: ["うみ", "くも", "そら", "ほし"] },
  { char: "月", reading: "つき", romaji: "tsuki", meaning: "Moon", choices: ["ひ", "つき", "ほし", "よる"] },
  { char: "山", reading: "やま", romaji: "yama", meaning: "Mountain", choices: ["やま", "かわ", "うみ", "みち"] },
  { char: "川", reading: "かわ", romaji: "kawa", meaning: "River", choices: ["かわ", "うみ", "いけ", "たき"] },
];

const TRACE_DECK = ["友", "猫", "木", "水", "火", "花", "空", "月", "山", "川"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Mode = "flash" | "trace";

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

  const pick = (choice: string) => {
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

      <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-center">
        <div className="flex justify-center">
          <div
            key={feedback + idx}
            className={
              feedback === "correct"
                ? "animate-joy"
                : feedback === "wrong"
                  ? "animate-shake"
                  : "animate-float"
            }
          >
            <DittoSVG
              size={200}
              mood={feedback === "correct" ? "joy" : feedback === "wrong" ? "sad" : "happy"}
            />
          </div>
        </div>

        <div>
          <motion.div
            key={idx}
            initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto flex aspect-square w-40 items-center justify-center rounded-full border-[3px] border-[var(--color-ink)] bg-[var(--ditto-pink)] text-6xl font-bold text-white shadow-[5px_5px_0_0_var(--color-ink)] sm:w-48 sm:text-7xl"
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
                  onClick={() => pick(c)}
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
  const char = TRACE_DECK[idx % TRACE_DECK.length];

  const size = 420;

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
  };

  useEffect(() => {
    clear();
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
    ctx.strokeStyle = "#EC7CD2";
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

  return (
    <div className="card-doodle p-6 sm:p-8">
      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
        <div className="flex justify-center">
          <div className="animate-float">
            <DittoSVG size={180} mood="happy" />
          </div>
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
              {char}
            </div>
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
              onClick={clear}
              className="pill-btn pill-btn-hover text-sm"
              style={{ background: "var(--butter)" }}
            >
              <Eraser size={14} /> Clear Canvas
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
            Trace the faint kanji with your finger or mouse.
          </p>
        </div>
      </div>
    </div>
  );
}

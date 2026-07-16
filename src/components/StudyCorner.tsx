import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Trophy,
  Flame,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Eraser,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { DittoSVG } from "./DittoSVG";
import dittoRetroSprite from "@/assets/ditto-retro-sprite.png";

type VocabCard = {
  char: string;
  reading: string;
  romaji: string;
  meaning: string;
  choices: string[];
};

// JLPT N5 elementary-friendly vocab
const BASE_DECK: VocabCard[] = [
  { char: "木", reading: "き", romaji: "ki", meaning: "Tree", choices: ["き", "め", "ひ", "て"] },
  { char: "川", reading: "かわ", romaji: "kawa", meaning: "River", choices: ["かわ", "うみ", "いけ", "みず"] },
  { char: "山", reading: "やま", romaji: "yama", meaning: "Mountain", choices: ["やま", "かわ", "そら", "もり"] },
  { char: "魚", reading: "さかな", romaji: "sakana", meaning: "Fish", choices: ["さかな", "とり", "いぬ", "うし"] },
  { char: "雨", reading: "あめ", romaji: "ame", meaning: "Rain", choices: ["あめ", "ゆき", "くも", "かぜ"] },
  { char: "犬", reading: "いぬ", romaji: "inu", meaning: "Dog", choices: ["いぬ", "ねこ", "うま", "とり"] },
  { char: "猫", reading: "ねこ", romaji: "neko", meaning: "Cat", choices: ["ねこ", "いぬ", "うま", "とり"] },
  { char: "車", reading: "くるま", romaji: "kuruma", meaning: "Car", choices: ["くるま", "でんしゃ", "ふね", "ひこうき"] },
  { char: "空", reading: "そら", romaji: "sora", meaning: "Sky", choices: ["そら", "うみ", "くも", "ほし"] },
  { char: "花", reading: "はな", romaji: "hana", meaning: "Flower", choices: ["はな", "き", "くさ", "は"] },
  { char: "火山", reading: "かざん", romaji: "kazan", meaning: "Volcano", choices: ["かざん", "ふじさん", "やまび", "かじ"] },
  { char: "日本", reading: "にほん", romaji: "nihon", meaning: "Japan", choices: ["にほん", "ちゅうごく", "かんこく", "たいわん"] },
  { char: "子猫", reading: "こねこ", romaji: "koneko", meaning: "Kitten", choices: ["こねこ", "こいぬ", "こうし", "こぶた"] },
  { char: "花火", reading: "はなび", romaji: "hanabi", meaning: "Fireworks", choices: ["はなび", "たきび", "ひばな", "かじ"] },
  { char: "青空", reading: "あおぞら", romaji: "aozora", meaning: "Blue sky", choices: ["あおぞら", "よぞら", "ゆうぞら", "ほしぞら"] },
];

type StrokeHint = { n: number; x: number; y: number; arrow: "→" | "↓" | "↘" | "↙" | "↖" };
type TraceItem = { char: string; hints: StrokeHint[] };

const BASE_TRACE_DECK: TraceItem[] = [
  { char: "木", hints: [{ n: 1, x: 22, y: 34, arrow: "→" }, { n: 2, x: 50, y: 20, arrow: "↓" }, { n: 3, x: 44, y: 48, arrow: "↙" }, { n: 4, x: 58, y: 48, arrow: "↘" }] },
  { char: "川", hints: [{ n: 1, x: 28, y: 22, arrow: "↓" }, { n: 2, x: 50, y: 18, arrow: "↓" }, { n: 3, x: 72, y: 22, arrow: "↓" }] },
  { char: "山", hints: [{ n: 1, x: 50, y: 22, arrow: "↓" }, { n: 2, x: 26, y: 42, arrow: "↓" }, { n: 3, x: 74, y: 42, arrow: "↓" }] },
  { char: "火", hints: [{ n: 1, x: 34, y: 28, arrow: "↙" }, { n: 2, x: 62, y: 30, arrow: "↘" }, { n: 3, x: 46, y: 40, arrow: "↓" }, { n: 4, x: 58, y: 58, arrow: "↘" }] },
  { char: "雨", hints: [{ n: 1, x: 50, y: 14, arrow: "→" }, { n: 2, x: 22, y: 30, arrow: "↓" }, { n: 3, x: 40, y: 50, arrow: "↓" }, { n: 4, x: 60, y: 50, arrow: "↓" }] },
  { char: "空", hints: [{ n: 1, x: 30, y: 16, arrow: "↘" }, { n: 2, x: 70, y: 16, arrow: "↙" }, { n: 3, x: 50, y: 42, arrow: "↓" }, { n: 4, x: 30, y: 66, arrow: "→" }] },
  { char: "花", hints: [{ n: 1, x: 26, y: 18, arrow: "→" }, { n: 2, x: 60, y: 18, arrow: "↓" }, { n: 3, x: 32, y: 50, arrow: "↘" }, { n: 4, x: 60, y: 52, arrow: "↓" }] },
  { char: "犬", hints: [{ n: 1, x: 26, y: 32, arrow: "↘" }, { n: 2, x: 50, y: 20, arrow: "↓" }, { n: 3, x: 40, y: 58, arrow: "↙" }, { n: 4, x: 66, y: 30, arrow: "↘" }] },
];

type StoryChoice = { label: string; correct: boolean };
type Story = {
  passage: React.ReactNode;
  question: string;
  choices: StoryChoice[];
};

const BASE_STORIES: Story[] = [
  {
    passage: (
      <>
        きょうは <ruby>青空<rt>あおぞら</rt></ruby> です。かわいい{" "}
        <ruby>子猫<rt>こねこ</rt></ruby> が <ruby>山<rt>やま</rt></ruby> を{" "}
        <ruby>走<rt>はし</rt></ruby> ります。<ruby>山<rt>やま</rt></ruby> のうえには、きれいな{" "}
        <ruby>花<rt>はな</rt></ruby> が たくさん <ruby>咲<rt>さ</rt></ruby> いています。みんなで
        いっしょに <ruby>遊<rt>あそ</rt></ruby> びましょう！
      </>
    ),
    question: "Where is the cute kitten running?",
    choices: [
      { label: "In the river", correct: false },
      { label: "Up the mountain", correct: true },
      { label: "Inside the house", correct: false },
      { label: "Across the sky", correct: false },
    ],
  },
  {
    passage: (
      <>
        <ruby>雨<rt>あめ</rt></ruby> の <ruby>日<rt>ひ</rt></ruby> です。ちいさな{" "}
        <ruby>犬<rt>いぬ</rt></ruby> は おうちで しずかに <ruby>寝<rt>ね</rt></ruby> ています。
        まどの そとでは <ruby>雨<rt>あめ</rt></ruby> の <ruby>音<rt>おと</rt></ruby> が
        きこえます。あしたは <ruby>晴<rt>は</rt></ruby> れると いいですね。
      </>
    ),
    question: "What is the dog doing?",
    choices: [
      { label: "Playing outside", correct: false },
      { label: "Eating fish", correct: false },
      { label: "Sleeping at home", correct: true },
      { label: "Chasing a cat", correct: false },
    ],
  },
  {
    passage: (
      <>
        なつの よる、たくさんの <ruby>花火<rt>はなび</rt></ruby> が{" "}
        <ruby>夜空<rt>よぞら</rt></ruby> に ひかります。<ruby>子<rt>こ</rt></ruby> どもたちは
        ゆかたを きて わらっています。メタモンも いっしょに{" "}
        <ruby>見<rt>み</rt></ruby> あげています。とても きれいな よるです。
      </>
    ),
    question: "What lights up the sky in the story?",
    choices: [
      { label: "Stars", correct: false },
      { label: "Fireworks", correct: true },
      { label: "The moon", correct: false },
      { label: "Lanterns", correct: false },
    ],
  },
  {
    passage: (
      <>
        <ruby>川<rt>かわ</rt></ruby> に ちいさな <ruby>魚<rt>さかな</rt></ruby> が
        およいでいます。<ruby>木<rt>き</rt></ruby> の したで メタモンは そっと{" "}
        <ruby>見<rt>み</rt></ruby> ています。<ruby>魚<rt>さかな</rt></ruby> は キラキラ
        ひかって とても きれいです。メタモンは しずかに ほほえみます。
      </>
    ),
    question: "What is Ditto watching?",
    choices: [
      { label: "A little fish in the river", correct: true },
      { label: "A bird in the tree", correct: false },
      { label: "A cat on the mountain", correct: false },
      { label: "A car on the road", correct: false },
    ],
  },
  {
    passage: (
      <>
        <ruby>日本<rt>にほん</rt></ruby> には たくさんの{" "}
        <ruby>火山<rt>かざん</rt></ruby> が あります。<ruby>山<rt>やま</rt></ruby> のうえから
        <ruby>見<rt>み</rt></ruby> る <ruby>景色<rt>けしき</rt></ruby> は
        とても きれいです。はるには <ruby>花<rt>はな</rt></ruby> が さきます。
        あなたも いつか いっしょに <ruby>行<rt>い</rt></ruby> きましょう。
      </>
    ),
    question: "What does the story say Japan has many of?",
    choices: [
      { label: "Rivers", correct: false },
      { label: "Volcanoes", correct: true },
      { label: "Trains", correct: false },
      { label: "Cats", correct: false },
    ],
  },
];

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

type Mode = "flash" | "trace" | "story";

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
  const stableBubble = useMemo(
    () =>
      mood === "correct" ? pick(HYPE_CORRECT) : mood === "wrong" ? pick(HYPE_WRONG) : pick(HYPE_IDLE),
    [mood],
  );
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
      <div className="mb-6 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4">
        <motion.img
          src={dittoRetroSprite}
          alt="Retro Ditto sprite tutor"
          width={80}
          height={80}
          loading="lazy"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="h-16 w-16 shrink-0 rounded-xl border-[3px] border-[var(--color-ink)] bg-[var(--cream)] p-1 shadow-[3px_3px_0_0_var(--color-ink)] sm:h-20 sm:w-20"
          style={{ imageRendering: "pixelated" }}
        />
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">{t("study_title")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            {t("study_sub")}
          </p>
        </div>
      </div>


      <div className="mb-6 flex flex-wrap justify-center gap-3">
        <ModeBtn active={mode === "flash"} onClick={() => setMode("flash")}>
          Kanji Flashcards
        </ModeBtn>
        <ModeBtn active={mode === "trace"} onClick={() => setMode("trace")}>
          Kanji Tracing
        </ModeBtn>
        <ModeBtn active={mode === "story"} onClick={() => setMode("story")}>
          Ditto's Story Time
        </ModeBtn>
      </div>

      {mode === "flash" && <Flashcards />}
      {mode === "trace" && <TracingCanvas />}
      {mode === "story" && <StoryTime />}
    </section>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="pill-btn pill-btn-hover text-sm"
      style={{
        background: active ? "var(--ditto-purple)" : "var(--cream)",
        color: active ? "#fff" : "var(--ink)",
      }}
    >
      {children}
    </button>
  );
}

function Flashcards() {
  const { t } = useLang();
  // Randomize on mount
  const [deck] = useState(() => shuffle(BASE_DECK));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [picked, setPicked] = useState<string | null>(null);

  const card = deck[idx % deck.length];
  const [shuffled, setShuffled] = useState<string[]>(() => shuffle(card.choices));
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
    <div className="card-doodle p-6 sm:p-8" style={{ background: "#3A2A50", color: "#F4EFFF" }}>

      <ScoreBar score={score} streak={streak} scoreLabel={t("score")} streakLabel={t("streak")} />

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
            className="mx-auto flex min-h-[10rem] w-fit items-center justify-center rounded-[2rem] border-[3px] border-[var(--color-ink)] px-8 py-4 font-bold shadow-[5px_5px_0_0_var(--color-ink)]"
            style={{ fontSize: card.char.length > 2 ? "3.5rem" : "4.5rem", lineHeight: 1, background: "#FFFDF6", color: "#1A122B" }}
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
                    : "#3A2A50";
              const fg = revealed && isAnswer ? "#1A122B" : "#FFFFFF";
              return (
                <motion.button
                  key={c}
                  whileHover={{ y: -3, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={revealed}
                  onClick={() => choose(c)}
                  className="card-doodle-sm px-3 py-3 text-xl font-bold"
                  style={{ background: bg, color: fg }}
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
                style={{ background: "var(--butter)", color: "#1A122B" }}
              >
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1A122B", opacity: 0.75 }}>
                  Meaning
                </div>
                <div className="text-2xl font-extrabold" style={{ color: "#1A122B" }}>{card.meaning}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider" style={{ color: "#1A122B", opacity: 0.75 }}>
                  Romaji
                </div>
                <div className="text-lg font-bold italic" style={{ color: "#1A122B" }}>{card.romaji}</div>
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
              style={{ background: "var(--ditto-purple)", color: "#fff" }}
            >
              {t("next")} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({
  score,
  streak,
  scoreLabel,
  streakLabel,
}: {
  score: number;
  streak: number;
  scoreLabel: React.ReactNode;
  streakLabel: React.ReactNode;
}) {
  return (
    <div
      className="mx-auto mb-6 inline-flex w-full max-w-md items-center justify-around rounded-2xl border-[3px] border-[var(--color-ink)] px-4 py-2 text-sm font-bold"
      style={{
        background: "linear-gradient(180deg, #D9A46B 0%, #B8814A 100%)",
        color: "#2D2A2E",
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.35), 4px 4px 0 0 var(--color-ink)",
      }}
    >
      <div className="inline-flex items-center gap-1.5">
        <Trophy size={16} /> {scoreLabel}: {score}
      </div>
      <div className="inline-flex items-center gap-1.5">
        <Flame size={16} /> {streakLabel}: {streak}
      </div>
    </div>
  );
}

function TracingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [deck] = useState(() => shuffle(BASE_TRACE_DECK));
  const [idx, setIdx] = useState(0);
  const [mood, setMood] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHints, setShowHints] = useState(true);
  const item = deck[idx % deck.length];

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
    ctx.strokeStyle = "#1A122B";
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.lineWidth = 12;

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
    <div className="card-doodle p-6 sm:p-8" style={{ background: "#3A2A50", color: "#F4EFFF" }}>
      <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-center">
        <div className="flex justify-center">
          <DittoMascot mood={mood} />
        </div>

        <div className="flex flex-col items-center">
          <div
            className="relative rounded-3xl border-[3px] border-[var(--color-ink)] shadow-[6px_6px_0_0_var(--color-ink)] overflow-hidden"
            style={{ background: "#FFFDF6", width: "min(100%, 420px)", aspectRatio: "1 / 1", boxShadow: "6px 6px 0 0 var(--color-ink)" }}
          >

            <div
              className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-bold"
              style={{
                color: "#8A8A8A",
                fontSize: "min(80vw, 340px)",
                lineHeight: 1,
              }}
              aria-hidden
            >
              {item.char}
            </div>

            {showHints && (
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {item.hints.map((h) => (
                  <div
                    key={h.n}
                    className="absolute flex items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--color-ink)] text-[11px] font-extrabold"
                      style={{ background: "var(--butter)", color: "#1A122B" }}
                    >
                      {h.n}
                    </span>
                    <span className="text-lg font-bold" style={{ color: "#1A122B" }}>{h.arrow}</span>
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
              style={{ background: "var(--ditto-purple)", color: "#fff" }}
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

function StoryTime() {
  const { t } = useLang();
  const [deck] = useState(() => shuffle(BASE_STORIES));
  const [idx, setIdx] = useState(0);
  const story = deck[idx % deck.length];
  const [shuffledChoices, setShuffledChoices] = useState<StoryChoice[]>(() => shuffle(story.choices));
  const [picked, setPicked] = useState<StoryChoice | null>(null);
  const [mood, setMood] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setShuffledChoices(shuffle(story.choices));
    setPicked(null);
    setMood("idle");
  }, [idx, story.choices]);

  const choose = (c: StoryChoice) => {
    if (picked) return;
    setPicked(c);
    if (c.correct) {
      setMood("correct");
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
    } else {
      setMood("wrong");
      setStreak(0);
    }
  };

  const next = () => setIdx((i) => i + 1);

  return (
    <div className="card-doodle p-6 sm:p-8" style={{ background: "#3A2A50", color: "#F4EFFF" }}>

      <ScoreBar score={score} streak={streak} scoreLabel={t("score")} streakLabel={t("streak")} />

      <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
        <div className="flex justify-center md:pt-6">
          <DittoMascot mood={mood} />
        </div>

        <div>
          {/* Paper scroll passage */}
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative rounded-[2rem] border-[3px] border-[var(--color-ink)] p-6 sm:p-8 shadow-[6px_6px_0_0_var(--color-ink)]"
            style={{
              background:
                "repeating-linear-gradient(0deg, #FFF8EC 0px, #FFF8EC 28px, #F5EBD3 29px, #FFF8EC 30px)",
            }}
          >
            <div className="absolute -top-3 left-6 rounded-full border-[3px] border-[var(--color-ink)] bg-[var(--ditto-purple)] px-3 py-0.5 text-xs font-extrabold text-white">
              Story Time
            </div>
            <p
              className="text-lg sm:text-xl leading-[2.4] font-semibold text-[var(--color-ink)]"
              style={{ fontFamily: "inherit" }}
            >
              {story.passage}
            </p>
          </motion.div>

          <div className="mt-6 rounded-2xl border-[3px] border-[var(--color-ink)] p-4 shadow-[4px_4px_0_0_var(--color-ink)]" style={{ background: "#2E1A40", color: "#F4EFFF" }}>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#D7A1F9" }}>
              Question
            </div>
            <p className="text-base sm:text-lg font-bold" style={{ color: "#FFFFFF" }}>{story.question}</p>
          </div>


          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {shuffledChoices.map((c) => {
              const revealed = !!picked;
              const isThis = picked === c;
              const bg =
                revealed && c.correct
                  ? "var(--mint)"
                  : revealed && isThis
                    ? "color-mix(in oklab, var(--destructive) 40%, white)"
                    : "#4F3A66";
              const fg = revealed && c.correct ? "#1A122B" : "#FFFFFF";
              return (
                <motion.button
                  key={c.label}
                  whileHover={{ y: -3, rotate: -0.5 }}
                  whileTap={{ scale: 0.96 }}
                  disabled={revealed}
                  onClick={() => choose(c)}
                  className="card-doodle-sm px-4 py-3 text-left text-sm font-bold sm:text-base"
                  style={{ background: bg, color: fg }}
                >
                  {c.label}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 flex min-h-[2.5rem] items-center justify-between gap-3">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
              {mood === "correct" && (
                <>
                  <Sparkles size={14} /> {t("correct")}
                </>
              )}
              {mood === "wrong" && (
                <>
                  <RefreshCw size={14} /> {t("wrong")}
                </>
              )}
            </p>
            <button
              onClick={next}
              disabled={!picked}
              className="pill-btn pill-btn-hover text-sm disabled:opacity-50"
              style={{ background: "var(--ditto-purple)", color: "#fff" }}
            >
              Next Story <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

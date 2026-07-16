import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { DittoSVG } from "./DittoSVG";

type Card = { char: string; answer: string; choices: string[] };

const DECK: Card[] = [
  { char: "あ", answer: "a", choices: ["a", "i", "u", "e"] },
  { char: "ね", answer: "ne", choices: ["ne", "me", "nu", "wa"] },
  { char: "猫", answer: "cat", choices: ["cat", "dog", "fish", "bird"] },
  { char: "友", answer: "friend", choices: ["enemy", "friend", "family", "teacher"] },
  { char: "水", answer: "water", choices: ["fire", "wind", "water", "earth"] },
  { char: "花", answer: "flower", choices: ["tree", "flower", "leaf", "seed"] },
  { char: "空", answer: "sky", choices: ["sea", "cloud", "sky", "star"] },
  { char: "こ", answer: "ko", choices: ["ka", "ki", "ku", "ko"] },
  { char: "月", answer: "moon", choices: ["sun", "moon", "star", "night"] },
  { char: "食", answer: "eat", choices: ["sleep", "run", "eat", "play"] },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function StudyCorner() {
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
    if (choice === card.answer) {
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
    <section id="study" className="mx-auto mt-20 w-[min(1100px,94%)] scroll-mt-28">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("study_title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {t("study_sub")}
        </p>
      </div>

      <div className="card-doodle p-6 sm:p-8">
        {/* Wooden scoreboard */}
        <div
          className="mx-auto mb-6 inline-flex w-full max-w-md items-center justify-around rounded-2xl border-[3px] border-[var(--color-ink)] px-4 py-2 text-sm font-bold"
          style={{
            background: "linear-gradient(180deg, #D9A46B 0%, #B8814A 100%)",
            color: "#2D2A2E",
            boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.35), 4px 4px 0 0 var(--color-ink)",
          }}
        >
          <div>🏆 {t("score")}: {score}</div>
          <div>🔥 {t("streak")}: {streak}</div>
        </div>

        <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-center">
          {/* Ditto reaction */}
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

          {/* Flashcard */}
          <div>
            <motion.div
              key={idx}
              initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="mx-auto flex aspect-square w-40 items-center justify-center rounded-full border-[3px] border-[var(--color-ink)] bg-[var(--ditto-pink)] text-6xl font-bold shadow-[5px_5px_0_0_var(--color-ink)] sm:w-48 sm:text-7xl"
            >
              {card.char}
            </motion.div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {shuffled.map((c) => {
                const isPicked = picked === c;
                const isAnswer = c === card.answer;
                const revealed = feedback !== "idle";
                const bg = revealed && isAnswer
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
                    className="card-doodle-sm px-3 py-3 text-base font-bold capitalize"
                    style={{ background: bg }}
                  >
                    {c}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-4 flex min-h-[2.5rem] items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {feedback === "correct" && `✨ ${t("correct")}`}
                {feedback === "wrong" && `🌀 ${t("wrong")}`}
              </p>
              <button
                onClick={next}
                disabled={feedback === "idle"}
                className="pill-btn pill-btn-hover text-sm disabled:opacity-50"
                style={{ background: "var(--ditto-purple)" }}
              >
                {t("next")} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

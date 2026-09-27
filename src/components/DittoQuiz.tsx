import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Trophy, Flame, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import { DittoSVG } from "./DittoSVG";

type Question = { q: string; choices: string[]; answer: string; fact?: string };

// Sourced from the Ditto entry on the Pokémon Wiki (pokemon.fandom.com/wiki/Ditto)
const QUESTIONS: Question[] = [
  { q: "What type is Ditto?", choices: ["Normal", "Water", "Psychic", "Ghost"], answer: "Normal" },
  {
    q: "What is Ditto's official species classification?",
    choices: ["Transform Pokémon", "Duplicate Pokémon", "Mimic Pokémon", "Shape-Shifter Pokémon"],
    answer: "Transform Pokémon",
  },
  {
    q: "What is Ditto's Japanese name?",
    choices: ["Metamon", "Kopipe", "Utsusu", "Maneo"],
    answer: "Metamon",
  },
  { q: "What is the only move Ditto naturally knows?", choices: ["Transform", "Copycat", "Mimic", "Sketch"], answer: "Transform" },
  {
    q: "What is Ditto's Hidden Ability?",
    choices: ["Imposter", "Limber", "Technician", "Adaptability"],
    answer: "Imposter",
  },
  {
    q: "What is Ditto's regular (non-hidden) Ability?",
    choices: ["Limber", "Imposter", "Levitate", "Klutz"],
    answer: "Limber",
    fact: "Limber prevents Ditto from being paralyzed.",
  },
  {
    q: "How does a shiny Ditto's color differ from normal?",
    choices: ["It's light bluish", "It's bright red", "It's golden", "There's no difference"],
    answer: "It's light bluish",
  },
  {
    q: "What does Ditto disguise itself as while sleeping to avoid being attacked?",
    choices: ["A rock", "A tree", "A puddle", "Another Ditto"],
    answer: "A rock",
  },
  {
    q: "What makes Ditto's transformation fail?",
    choices: ["Being made to laugh", "Loud noises", "Bright light", "Cold weather"],
    answer: "Being made to laugh",
  },
  {
    q: "What generation was Ditto introduced in?",
    choices: ["Generation I", "Generation II", "Generation III", "Generation IV"],
    answer: "Generation I",
  },
  { q: "What color is Ditto's body?", choices: ["Purple", "Blue", "Pink", "Green"], answer: "Purple" },
  {
    q: "Ditto can breed with almost any Pokémon because of its own unique...?",
    choices: ["Egg Group", "Ability", "Nature", "Held Item"],
    answer: "Egg Group",
  },
  {
    q: "About how tall is Ditto?",
    choices: ["About 1 foot (0.3 m)", "About 3 feet (1 m)", "About 6 inches (0.15 m)", "About 5 feet (1.5 m)"],
    answer: "About 1 foot (0.3 m)",
  },
  {
    q: "Does Ditto evolve into another Pokémon?",
    choices: ["No, it doesn't evolve", "Yes, into Metamorph", "Yes, into Copycat", "Only when traded"],
    answer: "No, it doesn't evolve",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const HYPE_CORRECT = ["Yay! Ditto is so proud!", "Correct! Ditto approves!", "Nailed it!"];
const HYPE_WRONG = ["Oops, try the next one!", "So close! Keep going!", "Ditto believes in you!"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function DittoQuiz() {
  // Deterministic (unshuffled) order for the SSR pass and the first client
  // render, then shuffled client-side after mount — Math.random() during
  // render would otherwise mismatch between server and client output.
  const [deck, setDeck] = useState<Question[]>(QUESTIONS);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [mood, setMood] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => {
    setDeck(shuffle(QUESTIONS));
  }, []);

  const card = deck[idx % deck.length];
  const [choices, setChoices] = useState<string[]>(card.choices);
  useEffect(() => {
    setChoices(shuffle(card.choices));
  }, [idx, card.choices]);

  const choose = (c: string) => {
    if (picked) return;
    setPicked(c);
    if (c === card.answer) {
      setMood("correct");
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
    } else {
      setMood("wrong");
      setStreak(0);
    }
  };

  const next = () => {
    setPicked(null);
    setMood("idle");
    setIdx((i) => i + 1);
  };

  return (
    <div className="card-doodle p-5" style={{ background: "var(--cream)" }}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold" style={{ color: "#1A122B" }}>
          Ditto Quiz Challenge
        </h3>
        <div className="flex items-center gap-3 text-xs font-bold" style={{ color: "#6B5A85" }}>
          <span className="inline-flex items-center gap-1">
            <Trophy size={13} /> {score}
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame size={13} /> {streak}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[80px_1fr] sm:items-center">
        <div className="mx-auto sm:mx-0">
          <motion.div
            key={mood}
            animate={
              mood === "correct"
                ? { y: [0, -10, 0], scale: [1, 1.1, 1] }
                : mood === "wrong"
                  ? { x: [-4, 4, -4, 4, 0] }
                  : { y: [0, -3, 0] }
            }
            transition={{ duration: mood === "idle" ? 2.2 : 0.5, repeat: mood === "idle" ? Infinity : 0 }}
          >
            <DittoSVG size={64} mood={mood === "correct" ? "joy" : mood === "wrong" ? "sad" : "happy"} />
          </motion.div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-sm font-bold sm:text-base"
              style={{ color: "#1A122B" }}
            >
              {card.q}
            </motion.p>
          </AnimatePresence>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {choices.map((c) => {
              const revealed = !!picked;
              const isAnswer = c === card.answer;
              const isPicked = c === picked;
              const bg = revealed && isAnswer ? "var(--mint)" : revealed && isPicked ? "color-mix(in oklab, var(--destructive) 40%, white)" : "var(--muted)";
              return (
                <motion.button
                  key={c}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={revealed}
                  onClick={() => choose(c)}
                  className="card-doodle-sm px-3 py-2 text-left text-xs font-bold sm:text-sm"
                  style={{ background: bg, color: "#1A122B" }}
                >
                  {c}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-3 flex min-h-[2rem] items-center justify-between gap-3">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#1A122B" }}>
              {mood === "correct" && (
                <>
                  <Sparkles size={13} /> {pick(HYPE_CORRECT)}
                  {card.fact && <span className="font-normal" style={{ color: "#6B5A85" }}>— {card.fact}</span>}
                </>
              )}
              {mood === "wrong" && (
                <>
                  <RefreshCw size={13} /> {pick(HYPE_WRONG)}
                </>
              )}
            </p>
            <button
              onClick={next}
              disabled={!picked}
              className="pill-btn pill-btn-hover shrink-0 !rounded-full text-xs disabled:opacity-50"
              style={{ background: "var(--ditto-purple)", color: "#fff" }}
            >
              Next <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

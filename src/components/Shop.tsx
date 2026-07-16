import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Star, X, Mail, Send, Loader2, Pencil, Trash2, Plus, LogOut, ShieldCheck, Camera, Link as LinkIcon } from "lucide-react";
import { z } from "zod";
import { useLang } from "@/lib/i18n";
import { useAdmin } from "@/lib/admin";
const dittoPixelArt =
  "https://static.wikia.nocookie.net/pokewilds/images/0/03/Ditto.png/revision/latest/thumbnail/width/360/height/360?cb=20230829005808";

type Card = {
  id: string;
  title: string;
  desc: string;
  price: number;
  available: boolean;
  bg: string;
  ink: string;
  monogram: string;
  imageUrl?: string;
};

const DEFAULT_CARDS: Card[] = [
  {
    id: "pikachu-sunset",
    title: "Pikachu at Sunset",
    desc: "A sleepy Pikachu on a warm orange sky. Drawn with soft pastel pencils.",
    price: 18,
    available: true,
    bg: "linear-gradient(160deg, #FFD9A8 0%, #F4A6C0 100%)",
    ink: "#7A3A5B",
    monogram: "P",
  },
  {
    id: "charmander-ember",
    title: "Charmander & Ember",
    desc: "A tiny fire lizard toasting a marshmallow. Little embers dance around.",
    price: 22,
    available: true,
    bg: "linear-gradient(160deg, #FFCBB3 0%, #FF9C7A 100%)",
    ink: "#7A2E1B",
    monogram: "C",
  },
  {
    id: "bulbasaur-garden",
    title: "Bulbasaur in the Garden",
    desc: "A tiny Bulbasaur napping in a moss patch, tulips growing from the bulb.",
    price: 20,
    available: false,
    bg: "linear-gradient(160deg, #D6F0C9 0%, #A9D8B0 100%)",
    ink: "#2E5B3A",
    monogram: "B",
  },
  {
    id: "squirtle-rain",
    title: "Squirtle on a Rainy Day",
    desc: "Squirtle sharing an umbrella with Ditto. Puddles are little mirrors.",
    price: 22,
    available: true,
    bg: "linear-gradient(160deg, #CDE4F5 0%, #99C6E8 100%)",
    ink: "#1E3E63",
    monogram: "S",
  },
  {
    id: "eevee-dreams",
    title: "Eevee's Cozy Dreams",
    desc: "Eevee curled up on a cloud bed with a starry blanket.",
    price: 25,
    available: true,
    bg: "linear-gradient(160deg, #F3DFC7 0%, #D8B37A 100%)",
    ink: "#5B3B1E",
    monogram: "E",
  },
  {
    id: "ditto-selfie",
    title: "Ditto Selfie",
    desc: "The mascot of the shop. A blobby Ditto flashing a peace sign.",
    price: 30,
    available: false,
    bg: "linear-gradient(160deg, #FBD3E4 0%, #EC7CD2 100%)",
    ink: "#4A2C5B",
    monogram: "D",
  },
];

const CARDS_KEY = "dittoland_cards_v1";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(1000),
});

function CardArt({ card }: { card: Card }) {
  if (card.imageUrl) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--cream)]">
        <img
          src={card.imageUrl}
          alt={card.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span
          className="absolute bottom-2 right-2 rounded-full border-[2px] border-[var(--color-ink)] bg-white/85 px-2 py-0.5 text-[9px] font-bold tracking-widest"
          style={{ color: "#1A122B" }}
        >
          BENI · ORIGINAL
        </span>
      </div>
    );
  }
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: card.bg }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(${card.ink} 1px, transparent 1px)`,
          backgroundSize: "14px 14px",
        }}
      />
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] font-bold sm:h-24 sm:w-24"
        style={{
          borderColor: card.ink,
          color: card.ink,
          fontSize: "2.5rem",
          background: "rgba(255,255,255,0.55)",
          boxShadow: `3px 3px 0 0 ${card.ink}`,
        }}
      >
        {card.monogram}
      </div>
      <span
        className="absolute bottom-2 right-2 text-[9px] font-bold tracking-widest"
        style={{ color: card.ink }}
      >
        BENI · ORIGINAL
      </span>
    </div>
  );
}

function SoldOutBadge({ available, t }: { available: boolean; t: (k: any) => any }) {
  const soldStyle = { background: "#2E1547", color: "#FFFFFF" };
  const availStyle = { background: "var(--mint)", color: "#1A122B" };
  return (
    <span
      className="shrink-0 rounded-full border-[2px] border-[var(--color-ink)] px-2 py-0.5 text-[10px] font-bold"
      style={available ? availStyle : soldStyle}
    >
      {available ? t("available") : t("sold_out")}
    </span>
  );
}

function FloatingStars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, i) => {
        const dx = (Math.random() - 0.5) * 260;
        const delay = i * 55;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 text-[var(--ditto-pink)]"
            style={{
              animation: "heart-float 1.4s ease-out forwards",
              animationDelay: `${delay}ms`,
              // @ts-expect-error CSS var
              "--dx": `calc(-50% + ${dx}px)`,
            }}
          >
            <Star size={20} fill="currentColor" />
          </span>
        );
      })}
    </div>
  );
}

function OrderModal({ card, onClose }: { card: Card; onClose: () => void }) {
  const { t, ts } = useLang();
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Formspree endpoint — edit this string to change delivery target
  const [targetEmail] = useState("beni@example.com");
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgqgppp";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = contactSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    // Attach card metadata + target email so submissions include full context
    fd.set("card_name", card.title);
    fd.set("card_price", `$${card.price}`);
    fd.set("card_id", card.id);
    fd.set("target_email", targetEmail);
    fd.set("_subject", `New inquiry: ${card.title} ($${card.price})`);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      if (!res.ok) throw new Error("send failed");
      setState("done");
    } catch {
      setState("idle");
      setErrors({ message: "Something went wrong sending your inquiry. Please try again." });
    }
  };


  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="card-doodle relative w-full max-w-lg overflow-hidden"
        initial={{ scale: 0.85, y: 30, rotate: -1 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-md border-[2.5px] border-[var(--color-ink)] bg-white text-[#1A122B] shadow-[2px_2px_0_0_var(--color-ink)]"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="relative aspect-[5/3]">
          <CardArt card={card} />
        </div>


        <div className="border-t-[3px] border-[var(--color-ink)] p-5" style={{ background: "#261A36", color: "#F4EFFF" }}>
          {state === "done" ? (
            <div className="py-4 text-center">
              <img
                src={dittoPixelArt}
                alt="Ditto mascot"
                className="mx-auto mb-3 h-16 w-16 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <h3 className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>Inquiry Sent! Ditto is on it!</h3>
              <p className="mt-2 text-sm" style={{ color: "#F4EFFF" }}>
                Beni will reply to your email as soon as possible.
              </p>
              <button
                onClick={onClose}
                className="pill-btn pill-btn-hover mx-auto mt-5 text-sm"
                style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
              >
                {t("close")}
              </button>
            </div>

          ) : (
            <>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold leading-tight">{card.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{card.desc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-bold">${card.price}</div>
                  <div className="mt-1">
                    <SoldOutBadge available={card.available} t={t} />
                  </div>
                </div>
              </div>

              <p className="mb-3 text-sm font-semibold">{t("order_title")}</p>
              <p className="mb-4 text-xs text-muted-foreground">{t("order_sub")}</p>

              <form onSubmit={onSubmit} className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-bold">{t("name")}</span>
                  <input
                    name="name"
                    maxLength={80}
                    placeholder={ts("name_ph")}
                    className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none focus:shadow-[3px_3px_0_0_var(--color-ink)]"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-300">{errors.name}</p>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold">{t("email")}</span>
                  <input
                    name="email"
                    type="email"
                    maxLength={200}
                    placeholder={ts("email_ph")}
                    className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none focus:shadow-[3px_3px_0_0_var(--color-ink)]"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold">{t("message")}</span>
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={1000}
                    placeholder={ts("message_ph")}
                    className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none focus:shadow-[3px_3px_0_0_var(--color-ink)]"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-300">{errors.message}</p>
                  )}
                </label>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="pill-btn pill-btn-hover w-full justify-center text-sm disabled:opacity-70"
                  style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
                >
                  {state === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> {t("sending")}
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Contact Beni to Purchase
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CardEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: Card | null;
  onClose: () => void;
  onSave: (c: Card) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [price, setPrice] = useState<string>(String(initial?.price ?? 20));
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [available, setAvailable] = useState<boolean>(initial?.available ?? true);
  const [useUrl, setUseUrl] = useState<boolean>(
    !!initial?.imageUrl && /^https?:\/\//i.test(initial.imageUrl),
  );
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read failed"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("decode failed"));
        img.onload = () => {
          const MAX = 600;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("no ctx"));
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImage(file);
      setImageUrl(dataUrl);
    } catch {
      /* noop */
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const priceNum = Number(price);
    if (!title.trim() || Number.isNaN(priceNum)) return;
    const id = initial?.id ?? `card-${Date.now()}`;
    onSave({
      id,
      title: title.trim(),
      desc: desc.trim(),
      price: priceNum,
      available,
      bg: initial?.bg ?? "linear-gradient(160deg, #FBD3E4 0%, #B78CE0 100%)",
      ink: initial?.ink ?? "#4A2C5B",
      monogram: initial?.monogram ?? (title.trim()[0]?.toUpperCase() ?? "?"),
      imageUrl: imageUrl.trim() || undefined,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--color-ink)]/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        className="card-doodle relative w-full max-w-lg p-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border-[2.5px] border-[var(--color-ink)] bg-white text-[#1A122B] shadow-[2px_2px_0_0_var(--color-ink)]"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <h3 className="mb-4 text-xl font-bold">{initial ? "Edit Card" : "Add New Card"}</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Card Name</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
              maxLength={100}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Description</span>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
              maxLength={500}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Price (USD)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
              required
            />
          </label>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-bold">Card Photo</span>
              <button
                type="button"
                onClick={() => setUseUrl((v) => !v)}
                className="text-[11px] font-bold underline decoration-dotted underline-offset-2 text-[var(--ditto-pink)]"
              >
                {useUrl ? "← Upload from device" : "Use Image URL instead →"}
              </button>
            </div>
            {useUrl ? (
              <div className="relative">
                <LinkIcon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1A122B]/60" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white pl-8 pr-3 py-2 text-sm text-[#1A122B] outline-none"
                />
              </div>
            ) : (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="pill-btn pill-btn-hover w-full justify-center text-sm disabled:opacity-70"
                  style={{ background: "var(--cream)", color: "#1A122B" }}
                >
                  {uploading ? (
                    <><Loader2 size={16} className="animate-spin" /> Compressing…</>
                  ) : (
                    <><Camera size={16} /> {imageUrl ? "Change Card Photo" : "📸 Upload Card Photo"}</>
                  )}
                </button>
              </>
            )}
            {imageUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border-[2.5px] border-[var(--color-ink)] shadow-[3px_3px_0_0_var(--color-ink)]">
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-xs font-bold text-[var(--ditto-pink)] underline decoration-dotted underline-offset-2"
                >
                  Remove photo
                </button>
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={!available}
              onChange={(e) => setAvailable(!e.target.checked)}
              className="h-4 w-4"
            />
            Sold Out
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="pill-btn text-sm"
            style={{ background: "#4F3A66", color: "#FFFFFF" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="pill-btn pill-btn-hover text-sm"
            style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
          >
            Save Card
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function loadCards(): Card[] {
  if (typeof window === "undefined") return DEFAULT_CARDS;
  try {
    const raw = localStorage.getItem(CARDS_KEY);
    if (!raw) return DEFAULT_CARDS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Card[];
  } catch {
    /* noop */
  }
  return DEFAULT_CARDS;
}

export function Shop() {
  const { t } = useLang();
  const { isAdmin } = useAdmin();
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  const [open, setOpen] = useState<Card | null>(null);
  const [editing, setEditing] = useState<Card | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setCards(loadCards());
  }, []);

  const persist = (next: Card[]) => {
    setCards(next);
    try {
      localStorage.setItem(CARDS_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  const upsert = (c: Card) => {
    const exists = cards.some((x) => x.id === c.id);
    persist(exists ? cards.map((x) => (x.id === c.id ? c : x)) : [...cards, c]);
    setEditing(null);
    setAdding(false);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this card?")) return;
    persist(cards.filter((c) => c.id !== id));
  };

  return (
    <section id="shop" className="mx-auto mt-20 w-[min(1200px,94%)] scroll-mt-28">
      <div className="mb-6 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-5">
        <motion.img
          src={dittoPixelArt}
          alt="Pixel Ditto shopkeeper"
          width={96}
          height={96}
          loading="lazy"
          animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="h-20 w-20 shrink-0 rounded-2xl border-[3px] border-[var(--color-ink)] bg-[var(--cream)] p-1 shadow-[4px_4px_0_0_var(--color-ink)] sm:h-24 sm:w-24"
          style={{ imageRendering: "pixelated" }}
        />
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">{t("shop_title")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            {t("shop_sub")}
          </p>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.id}
            whileHover={{ y: -4, rotate: i % 2 ? 0.8 : -0.8 }}
            className="card-doodle group relative flex flex-col overflow-hidden p-0 text-left"
          >
            <button
              onClick={() => setOpen(c)}
              className="aspect-[4/5] w-full text-left"
              aria-label={`View ${c.title}`}
            >
              <CardArt card={c} />
            </button>
            <div className="flex flex-1 flex-col gap-2 border-t-[3px] border-[var(--color-ink)] bg-[var(--cream)] p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="min-w-0 flex-1 text-sm font-bold leading-tight" style={{ color: "#1A122B" }}>{c.title}</h3>
                <SoldOutBadge available={c.available} t={t} />
              </div>
              <p className="line-clamp-2 text-[11px]" style={{ color: "#3A2A50" }}>{c.desc}</p>
              <div className="mt-auto flex items-center justify-between gap-2">
                <span className="text-base font-bold" style={{ color: "#1A122B" }}>${c.price}</span>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setOpen(c)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border-[2px] border-[var(--color-ink)] px-3 py-1.5 text-[11px] font-extrabold shadow-[2px_2px_0_0_var(--color-ink)] transition-colors hover:brightness-110"
                  style={{ background: "#3A2A50", color: "#FFFFFF" }}
                >
                  <Mail size={12} /> {t("inquire")}
                </motion.button>
              </div>
              {isAdmin && (
                <div className="mt-2 flex gap-2 border-t-[2px] border-dashed border-[var(--color-ink)]/40 pt-2">
                  <button
                    onClick={() => setEditing(c)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border-[2px] border-[var(--color-ink)] bg-[var(--mint)] px-2 py-1 text-[11px] font-bold text-[#1A122B]"
                  >
                    <Pencil size={11} /> Edit
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border-[2px] border-[var(--color-ink)] bg-[#FF8A8A] px-2 py-1 text-[11px] font-bold text-[#1A122B]"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isAdmin && (
          <button
            onClick={() => setAdding(true)}
            className="card-doodle flex min-h-[300px] flex-col items-center justify-center gap-3 border-dashed p-6 text-center hover:bg-[var(--muted)]"
            style={{ background: "transparent" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-dashed border-[var(--ditto-pink)] text-[var(--ditto-pink)]">
              <Plus size={32} />
            </div>
            <span className="text-sm font-bold text-[var(--ditto-pink)]">Add New Card</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && <OrderModal card={open} onClose={() => setOpen(null)} />}
        {(editing || adding) && (
          <CardEditor
            initial={editing}
            onClose={() => {
              setEditing(null);
              setAdding(false);
            }}
            onSave={upsert}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export function AdminBanner() {
  const { isAdmin, logout } = useAdmin();
  if (!isAdmin) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <div
        className="hidden sm:inline-flex items-center gap-1.5 rounded-full border-[2px] border-[var(--color-ink)] px-3 py-1 text-[11px] font-bold shadow-[2px_2px_0_0_var(--color-ink)]"
        style={{ background: "#FFFDF6", color: "#1A122B" }}
      >
        <ShieldCheck size={12} />
        Admin Mode Active
      </div>
      <button
        onClick={logout}
        className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-[var(--color-ink)] px-3 py-1.5 text-[11px] font-extrabold shadow-[2px_2px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
        style={{ background: "#1A122B", color: "#FFFFFF" }}
      >
        <LogOut size={12} /> Exit Admin
      </button>
    </div>
  );
}


export function AdminLoginLink() {
  const { isAdmin, login } = useAdmin();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);

  if (isAdmin) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (login(code)) {
      setOpen(false);
      setCode("");
      setErr(false);
    } else {
      setErr(true);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[11px] text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-[var(--ditto-pink)]"
      >
        Admin Access
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--color-ink)]/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.form
              onSubmit={submit}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card-doodle relative w-full max-w-sm p-6 text-center"
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[var(--color-ink)] bg-[var(--ditto-pink)] text-[#0A0414]">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-xl font-bold">Admin Access</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter the passcode to manage Beni's cards.
              </p>
              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErr(false);
                }}
                placeholder="Passcode"
                className="mt-4 w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-center text-sm text-[#1A122B] outline-none"
                autoFocus
              />
              {err && <p className="mt-2 text-xs text-red-300">Wrong passcode, try again.</p>}
              <div className="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="pill-btn text-sm"
                  style={{ background: "#4F3A66", color: "#FFFFFF" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pill-btn pill-btn-hover text-sm"
                  style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
                >
                  Unlock
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

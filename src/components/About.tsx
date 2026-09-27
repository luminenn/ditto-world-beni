import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { Pencil, X, User } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useAdmin } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";
import { ImageField } from "./Events";

type AboutContent = {
  photoUrl: string | null;
  bio: string;
};

type AboutRow = {
  id: number;
  photo_url: string | null;
  bio: string;
};

function AboutEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: AboutContent;
  onClose: () => void;
  onSave: (c: AboutContent) => void;
}) {
  const [photoUrl, setPhotoUrl] = useState(initial.photoUrl ?? "");
  const [bio, setBio] = useState(initial.bio);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ photoUrl: photoUrl.trim() || null, bio: bio.trim() });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--color-ink)]/70 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        className="card-doodle relative my-8 w-full max-w-lg p-6"
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
        <h3 className="mb-4 text-xl font-bold">Edit About Beni</h3>
        <div className="space-y-3">
          <ImageField label="Beni's Photo" value={photoUrl} onChange={setPhotoUrl} maxDim={900} />
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Bio / Story</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={8}
              placeholder="Tell customers about Beni — her story as an artist, how she started drawing Pokemon cards, what she loves about it…"
              className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
              maxLength={4000}
            />
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
            Save
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export function About() {
  const { t } = useLang();
  const { isAdmin } = useAdmin();
  const [content, setContent] = useState<AboutContent>({ photoUrl: null, bio: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.from("about_content").select("id, photo_url, bio").eq("id", 1).single();
      if (!active) return;
      if (!error && data) {
        const row = data as AboutRow;
        setContent({ photoUrl: row.photo_url, bio: row.bio });
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const save = async (c: AboutContent) => {
    const { data, error } = await supabase
      .from("about_content")
      .update({ photo_url: c.photoUrl, bio: c.bio })
      .eq("id", 1)
      .select("id, photo_url, bio")
      .single();
    if (!error && data) {
      const row = data as AboutRow;
      setContent({ photoUrl: row.photo_url, bio: row.bio });
    }
    setEditing(false);
  };

  const paragraphs = content.bio.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <section id="about" className="mx-auto mt-20 w-[min(1000px,94%)] scroll-mt-28">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("about_title")}</h2>
        {isAdmin && (
          <button
            onClick={() => setEditing(true)}
            className="pill-btn pill-btn-hover mt-4 text-sm"
            style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
          >
            <Pencil size={14} /> Edit
          </button>
        )}
      </div>

      {loading ? (
        <div className="card-doodle grid gap-6 p-6 sm:grid-cols-[220px_1fr] sm:p-8">
          <div className="aspect-square w-full animate-pulse rounded-md bg-[var(--muted)]" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-black/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ) : (
        <div className="card-doodle grid gap-6 p-6 sm:grid-cols-[220px_1fr] sm:p-8" style={{ background: "var(--cream)" }}>
          <div
            className="aspect-square w-full shrink-0 overflow-hidden rounded-md border-[2.5px] shadow-[4px_4px_0_0_var(--color-ink)]"
            style={{ borderColor: "#1A122B" }}
          >
            {content.photoUrl ? (
              <img src={content.photoUrl} alt="Beni" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[var(--muted)] text-[var(--ditto-purple)]">
                <User size={40} />
                <span className="text-xs font-bold">photo coming soon</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-3" style={{ color: "#1A122B" }}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed sm:text-base">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-sm italic" style={{ color: "#6B5A85" }}>
                Beni's story is coming soon!
              </p>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {editing && <AboutEditor initial={content} onClose={() => setEditing(false)} onSave={save} />}
      </AnimatePresence>
    </section>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { format, isSameMonth, isSameYear } from "date-fns";
import { Calendar, MapPin, Loader2, Pencil, Trash2, Plus, X, Camera, ImageIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useAdmin } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";

type EventFormat = "in-person" | "virtual" | "hybrid";

type EventItem = {
  id: string;
  name: string;
  startDate: string; // ISO date, yyyy-mm-dd
  endDate: string;
  location: string;
  format: EventFormat;
  bannerUrl: string | null;
  iconUrl: string | null;
};

type EventRow = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  format: string;
  banner_url: string | null;
  icon_url: string | null;
};

function rowToEvent(r: EventRow): EventItem {
  return {
    id: r.id,
    name: r.name,
    startDate: r.start_date,
    endDate: r.end_date,
    location: r.location,
    format: (r.format as EventFormat) ?? "in-person",
    bannerUrl: r.banner_url,
    iconUrl: r.icon_url,
  };
}

function eventToRow(e: EventItem): Omit<EventRow, "id"> & { id?: string } {
  return {
    name: e.name,
    start_date: e.startDate,
    end_date: e.endDate,
    location: e.location,
    format: e.format,
    banner_url: e.bannerUrl,
    icon_url: e.iconUrl,
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDateRange(startISO: string, endISO: string): string {
  const start = new Date(`${startISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);
  if (startISO === endISO) return format(start, "MMM d").toUpperCase();
  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return `${format(start, "MMM d").toUpperCase()} - ${format(end, "d").toUpperCase()}`;
  }
  if (isSameYear(start, end)) {
    return `${format(start, "MMM d").toUpperCase()} - ${format(end, "MMM d").toUpperCase()}`;
  }
  return `${format(start, "MMM d, yyyy").toUpperCase()} - ${format(end, "MMM d, yyyy").toUpperCase()}`;
}

const FORMAT_LABEL: Record<EventFormat, string> = {
  "in-person": "In-Person",
  virtual: "Virtual",
  hybrid: "Hybrid",
};

function EventCard({
  event,
  isAdmin,
  onEdit,
  onDelete,
  dimmed = false,
}: {
  event: EventItem;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  dimmed?: boolean;
}) {
  return (
    <motion.div
      whileHover={dimmed ? undefined : { y: -4, rotate: -0.6 }}
      className="card-doodle relative flex flex-col overflow-hidden p-0 text-left"
      style={dimmed ? { opacity: 0.72 } : undefined}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--muted)]">
        {event.bannerUrl ? (
          <img src={event.bannerUrl} alt={event.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--ditto-purple)]">
            <ImageIcon size={32} />
          </div>
        )}
        {event.iconUrl && (
          <div
            className="absolute bottom-2 left-2 h-14 w-14 overflow-hidden rounded-md border-[2.5px] bg-white shadow-[2px_2px_0_0_var(--color-ink)]"
            style={{ borderColor: "#1A122B" }}
          >
            <img src={event.iconUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t-[3px] border-[var(--color-ink)] bg-[var(--cream)] p-3">
        <h3 className="text-base font-bold leading-tight" style={{ color: "#1A122B" }}>
          {event.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B5A85" }}>
          <Calendar size={13} /> {formatDateRange(event.startDate, event.endDate)}
        </div>
        {event.location && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B5A85" }}>
            <MapPin size={13} /> {event.location}
          </div>
        )}
        <span
          className="mt-1 inline-flex w-fit items-center rounded-full border-[2px] px-2 py-0.5 text-[10px] font-bold"
          style={{ borderColor: "#1A122B", background: "var(--mint)", color: "#1A122B" }}
        >
          {FORMAT_LABEL[event.format]}
        </span>

        {isAdmin && (
          <div className="mt-2 flex gap-2 border-t-[2px] border-dashed border-[var(--color-ink)]/40 pt-2">
            <button
              onClick={onEdit}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border-[2px] border-[var(--color-ink)] bg-[var(--mint)] px-2 py-1 text-[11px] font-bold text-[#1A122B]"
            >
              <Pencil size={11} /> Edit
            </button>
            <button
              onClick={onDelete}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border-[2px] border-[var(--color-ink)] bg-[#FF8A8A] px-2 py-1 text-[11px] font-bold text-[#1A122B]"
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="card-doodle relative flex flex-col overflow-hidden p-0">
      <div className="aspect-[16/9] w-full animate-pulse bg-[var(--muted)]" />
      <div className="flex flex-1 flex-col gap-2 border-t-[3px] border-[var(--color-ink)] bg-[var(--cream)] p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-black/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-black/10" />
      </div>
    </div>
  );
}

export const compressImage = (file: File, maxDim: number): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

export function ImageField({
  label,
  value,
  onChange,
  maxDim,
  square = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxDim: number;
  square?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await compressImage(file, maxDim));
    } catch {
      /* noop */
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-bold">{label}</span>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="pill-btn pill-btn-hover w-full justify-center text-sm disabled:opacity-70"
        style={{ background: "var(--cream)", color: "#1A122B" }}
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Compressing…
          </>
        ) : (
          <>
            <Camera size={16} /> {value ? "Change Photo" : "Upload Photo"}
          </>
        )}
      </button>
      {value && (
        <div className="mt-3 flex items-center gap-3">
          <div
            className={`shrink-0 overflow-hidden border-[2.5px] border-[var(--color-ink)] shadow-[3px_3px_0_0_var(--color-ink)] ${square ? "h-16 w-16 rounded-md" : "h-16 w-28 rounded-md"}`}
          >
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-bold text-[var(--ditto-pink)] underline decoration-dotted underline-offset-2"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function EventEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: EventItem | null;
  onClose: () => void;
  onSave: (e: EventItem) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayISO());
  const [endDate, setEndDate] = useState(initial?.endDate ?? todayISO());
  const [location, setLocation] = useState(initial?.location ?? "");
  const [eventFormat, setEventFormat] = useState<EventFormat>(initial?.format ?? "in-person");
  const [bannerUrl, setBannerUrl] = useState(initial?.bannerUrl ?? "");
  const [iconUrl, setIconUrl] = useState(initial?.iconUrl ?? "");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;
    onSave({
      id: initial?.id ?? `event-${Date.now()}`,
      name: name.trim(),
      startDate,
      endDate: endDate < startDate ? startDate : endDate,
      location: location.trim(),
      format: eventFormat,
      bannerUrl: bannerUrl.trim() || null,
      iconUrl: iconUrl.trim() || null,
    });
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
        <h3 className="mb-4 text-xl font-bold">{initial ? "Edit Event" : "Add New Event"}</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Event Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
              maxLength={120}
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-bold">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold">End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
                required
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Location (city, state)</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Miami, FL"
              className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
              maxLength={120}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold">Format</span>
            <select
              value={eventFormat}
              onChange={(e) => setEventFormat(e.target.value as EventFormat)}
              className="w-full rounded-md border-[2.5px] border-[var(--color-ink)] bg-white px-3 py-2 text-sm text-[#1A122B] outline-none"
            >
              <option value="in-person">In-Person</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <ImageField label="Banner Image" value={bannerUrl} onChange={setBannerUrl} maxDim={1200} />
          <ImageField label="Event Icon (small square logo)" value={iconUrl} onChange={setIconUrl} maxDim={240} square />
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
            Save Event
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export function Events() {
  const { t } = useLang();
  const { isAdmin } = useAdmin();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, name, start_date, end_date, location, format, banner_url, icon_url")
        .order("start_date", { ascending: true });
      if (!active) return;
      if (!error && data) setEvents(data.map((r) => rowToEvent(r as EventRow)));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const upsert = async (ev: EventItem) => {
    const exists = events.some((x) => x.id === ev.id);
    const row = eventToRow(ev);
    if (exists) {
      const { data, error } = await supabase
        .from("events")
        .update(row)
        .eq("id", ev.id)
        .select("id, name, start_date, end_date, location, format, banner_url, icon_url")
        .single();
      if (!error && data) {
        setEvents((prev) => prev.map((x) => (x.id === ev.id ? rowToEvent(data as EventRow) : x)));
      }
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert(row)
        .select("id, name, start_date, end_date, location, format, banner_url, icon_url")
        .single();
      if (!error && data) {
        setEvents((prev) => [...prev, rowToEvent(data as EventRow)]);
      }
    }
    setEditing(null);
    setAdding(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const today = todayISO();
  const upcoming = events.filter((e) => e.endDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = events.filter((e) => e.endDate < today).sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <section id="events" className="mx-auto mt-20 w-[min(1200px,94%)] scroll-mt-28">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("events_title")}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{t("events_sub")}</p>
        {isAdmin && (
          <button
            onClick={() => setAdding(true)}
            className="pill-btn pill-btn-hover mt-4 text-sm"
            style={{ background: "var(--ditto-pink)", color: "#0A0414" }}
          >
            <Plus size={16} /> {t("events_add")}
          </button>
        )}
      </div>

      <h3 className="mb-4 text-xl font-bold">{t("events_upcoming")}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={`sk-${i}`} />)}
        {!loading && upcoming.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            isAdmin={isAdmin}
            onEdit={() => setEditing(ev)}
            onDelete={() => remove(ev.id)}
          />
        ))}
      </div>
      {!loading && upcoming.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">{t("events_empty")}</p>
      )}

      {(loading || past.length > 0) && (
        <>
          <h3 className="mb-4 mt-12 text-xl font-bold">{t("events_archive")}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {!loading && past.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                isAdmin={isAdmin}
                onEdit={() => setEditing(ev)}
                onDelete={() => remove(ev.id)}
                dimmed
              />
            ))}
          </div>
          {!loading && past.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">{t("events_archive_empty")}</p>
          )}
        </>
      )}

      <AnimatePresence>
        {(editing || adding) && (
          <EventEditor
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

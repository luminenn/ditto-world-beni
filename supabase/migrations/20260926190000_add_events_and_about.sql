-- Events (Upcoming Events + Past Events archive share this table;
-- "upcoming" vs "past" is derived client-side from end_date, not a manual flag)
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT 'in-person',
  banner_url TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert events"
  ON public.events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON public.events FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete events"
  ON public.events FOR DELETE
  USING (true);

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- About Beni — a single editable row (photo + bio), so Beni can update it
-- from the admin UI without a code deploy.
CREATE TABLE public.about_content (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  photo_url TEXT,
  bio TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.about_content (id, bio) VALUES (
  1,
  'Hi, my name is Beni. I am 10 years old and I am in 5th grade, and I love drawing Pokémon cards. I am based in Southern California, and I frequently pop up at various Pokémon-related events. I have pre-drawn Pokémon cards you can find on my website, but you can also contact me for personalized commissions.'
) ON CONFLICT (id) DO NOTHING;

GRANT SELECT, INSERT, UPDATE ON public.about_content TO anon;
GRANT SELECT, INSERT, UPDATE ON public.about_content TO authenticated;
GRANT ALL ON public.about_content TO service_role;

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about content"
  ON public.about_content FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update about content"
  ON public.about_content FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

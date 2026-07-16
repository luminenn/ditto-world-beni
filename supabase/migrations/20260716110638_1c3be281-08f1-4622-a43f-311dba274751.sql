
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  availability TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cards TO anon;
GRANT ALL ON public.cards TO service_role;

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cards"
  ON public.cards FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert cards"
  ON public.cards FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update cards"
  ON public.cards FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete cards"
  ON public.cards FOR DELETE
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.cards (name, price, description, availability) VALUES
  ('Pikachu at Sunset', 18, 'A sleepy Pikachu on a warm orange sky. Drawn with soft pastel pencils.', 'available'),
  ('Charmander & Ember', 22, 'A tiny fire lizard toasting a marshmallow. Little embers dance around.', 'available'),
  ('Bulbasaur in the Garden', 20, 'A tiny Bulbasaur napping in a moss patch, tulips growing from the bulb.', 'sold_out'),
  ('Squirtle on a Rainy Day', 22, 'Squirtle sharing an umbrella with Ditto. Puddles are little mirrors.', 'available'),
  ('Eevee''s Cozy Dreams', 25, 'Eevee curled up on a cloud bed with a starry blanket.', 'available'),
  ('Ditto Selfie', 30, 'The mascot of the shop. A blobby Ditto flashing a peace sign.', 'sold_out');

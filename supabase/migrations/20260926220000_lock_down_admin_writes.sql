-- Previously, cards/events/about_content granted the public `anon` role
-- INSERT/UPDATE/DELETE with `USING (true)` policies — meaning anyone who knew
-- the (necessarily public) Supabase anon key could write directly via the API,
-- bypassing the client-side admin passcode entirely. Reads must stay public
-- (the shop/events/about pages are public pages), but writes now require a
-- real authenticated session (the single Supabase Auth admin account).

-- cards
REVOKE INSERT, UPDATE, DELETE ON public.cards FROM anon;

DROP POLICY IF EXISTS "Anyone can insert cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can update cards" ON public.cards;
DROP POLICY IF EXISTS "Anyone can delete cards" ON public.cards;

CREATE POLICY "Authenticated can insert cards"
  ON public.cards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update cards"
  ON public.cards FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete cards"
  ON public.cards FOR DELETE
  TO authenticated
  USING (true);

-- events
REVOKE INSERT, UPDATE, DELETE ON public.events FROM anon;

DROP POLICY IF EXISTS "Anyone can insert events" ON public.events;
DROP POLICY IF EXISTS "Anyone can update events" ON public.events;
DROP POLICY IF EXISTS "Anyone can delete events" ON public.events;

CREATE POLICY "Authenticated can insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (true);

-- about_content
REVOKE INSERT, UPDATE ON public.about_content FROM anon;

DROP POLICY IF EXISTS "Anyone can update about content" ON public.about_content;

CREATE POLICY "Authenticated can update about content"
  ON public.about_content FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can insert about content"
  ON public.about_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

/*
# Create confessions table for global real-time confessions feed

1. New Tables
- `confessions`
  - `id` (uuid, primary key, auto-generated)
  - `content` (text, not null, 1-280 chars) — the confession text
  - `category` (text, not null) — one of: crush, ick, regret, flex, rant, random
  - `user_id` (uuid, not null, defaults to auth.uid()) — author
  - `created_at` (timestamptz, defaults to now())
- References `auth.users(id)` with ON DELETE CASCADE so confessions are removed when a user is deleted.

2. Security
- Enable RLS on `confessions`.
- All authenticated users can READ all confessions (public feed).
- Only the author can INSERT/UPDATE/DELETE their own confessions.
- `user_id` defaults to `auth.uid()` so frontend inserts that omit it still pass the WITH CHECK.

3. Realtime
- Add `confessions` to the `supabase_realtime` publication so INSERT events are broadcast live.

4. Index
- Index on `created_at DESC` for the "newest first" feed query.
*/

CREATE TABLE IF NOT EXISTS public.confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 280),
  category text NOT NULL CHECK (category IN ('crush','ick','regret','flex','rant','random')),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS confessions_created_at_idx ON public.confessions (created_at DESC);

ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_confessions" ON public.confessions;
CREATE POLICY "select_confessions" ON public.confessions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_confession" ON public.confessions;
CREATE POLICY "insert_own_confession" ON public.confessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_confession" ON public.confessions;
CREATE POLICY "update_own_confession" ON public.confessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_confession" ON public.confessions;
CREATE POLICY "delete_own_confession" ON public.confessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions;

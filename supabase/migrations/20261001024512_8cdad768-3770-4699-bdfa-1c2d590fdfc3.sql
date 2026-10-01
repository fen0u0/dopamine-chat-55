CREATE TABLE public.confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 280),
  category text NOT NULL DEFAULT 'random' CHECK (category IN ('crush','ick','regret','flex','rant','random')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.confessions TO authenticated;
GRANT ALL ON public.confessions TO service_role;
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "signed in read confessions" ON public.confessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "post own confessions" ON public.confessions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete own confessions" ON public.confessions FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE INDEX confessions_created_idx ON public.confessions (created_at DESC);
ALTER TABLE public.confessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions;
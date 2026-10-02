CREATE TABLE public.global_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.global_chat_messages TO authenticated;
GRANT ALL ON public.global_chat_messages TO service_role;
ALTER TABLE public.global_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "signed in read global chat" ON public.global_chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "send own global messages" ON public.global_chat_messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY "delete own global messages" ON public.global_chat_messages FOR DELETE TO authenticated USING (sender_id = auth.uid());
ALTER TABLE public.global_chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_chat_messages;
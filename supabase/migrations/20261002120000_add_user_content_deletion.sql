-- Allow users to permanently delete only content they own.
-- Messages and reactions are already cascaded when their conversation is deleted.
GRANT DELETE ON public.conversations TO authenticated;
DROP POLICY IF EXISTS "members delete conversations" ON public.conversations;
CREATE POLICY "members delete conversations"
  ON public.conversations FOR DELETE TO authenticated
  USING ((select auth.uid()) IN (user_a, user_b));

GRANT DELETE ON public.confessions TO authenticated;
DROP POLICY IF EXISTS "delete own confessions" ON public.confessions;
CREATE POLICY "delete own confessions"
  ON public.confessions FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- Keep realtime DELETE payloads usable by the clients.
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.confessions REPLICA IDENTITY FULL;

NOTIFY pgrst, 'reload schema';

-- Verify ownership policies are present after migration.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'conversations'
      AND policyname = 'members delete conversations'
  ) THEN
    RAISE EXCEPTION 'conversation deletion policy was not created';
  END IF;
END $$;

-- user-owned message deletion already exists in the base schema; this keeps
-- deployments that were created before that migration aligned.
GRANT DELETE ON public.messages TO authenticated;
DROP POLICY IF EXISTS "delete own messages" ON public.messages;
CREATE POLICY "delete own messages"
  ON public.messages FOR DELETE TO authenticated
  USING ((select auth.uid()) = sender_id);

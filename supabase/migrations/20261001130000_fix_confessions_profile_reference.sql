-- Confessions belong to app profiles, not directly to auth.users.
-- This keeps the feed relationship consistent with the rest of the app.
ALTER TABLE public.confessions
  DROP CONSTRAINT IF EXISTS confessions_user_id_fkey;

ALTER TABLE public.confessions
  ADD CONSTRAINT confessions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

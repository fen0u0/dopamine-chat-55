ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS aura_color text NOT NULL DEFAULT 'violet',
  ADD COLUMN IF NOT EXISTS bio_currently text,
  ADD COLUMN IF NOT EXISTS unpopular_opinion text,
  ADD COLUMN IF NOT EXISTS green_flags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS red_flags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS into_tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx ON public.profiles (lower(username));
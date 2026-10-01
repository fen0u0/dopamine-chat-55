import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface VibeProfile {
  id: string;
  username: string;
  avatar: string;
  mood: string | null;
  aura_color?: string;
  bio_currently?: string | null;
  unpopular_opinion?: string | null;
  green_flags?: string[];
  red_flags?: string[];
  into_tags?: string[];
  looking_for?: string | null;
  anonymity?: string | null;
  energy?: string | null;
  active_hours?: string | null;
  reply_speed?: string | null;
  onboarding_completed?: boolean;
}

export const PROFILE_COLUMNS =
  "id, username, avatar, mood, aura_color, bio_currently, unpopular_opinion, green_flags, red_flags, into_tags, looking_for, anonymity, energy, active_hours, reply_speed, onboarding_completed";

interface AuthContextType {
  session: Session | null;
  profile: VibeProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const syncLegacyStorage = (p: VibeProfile | null) => {
  if (p) {
    localStorage.setItem("currentUser", p.username);
    localStorage.setItem("userAvatar", p.avatar);
  } else {
    localStorage.removeItem("currentUser");
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<VibeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const reqId = useRef(0);
  const loadProfile = useCallback(async (userId: string | undefined) => {
    // Sequence guard: a slow, stale lookup (e.g. fired before the guest profile
    // was saved) must never overwrite a newer result with "no profile".
    const id = ++reqId.current;
    if (!userId) {
      setProfile(null);
      syncLegacyStorage(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", userId)
      .maybeSingle();
    if (id !== reqId.current) return;
    const p = (data as VibeProfile | null) ?? null;
    setProfile(p);
    syncLegacyStorage(p);
  }, []);

  useEffect(() => {
    let lastUserId: string | undefined | null = null;
    // Single source of truth: INITIAL_SESSION fires immediately, so no separate getSession race.
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      const uid = s?.user.id;
      if (uid === lastUserId) return; // same user (token refresh / re-emit): no reload, no flicker
      lastUserId = uid;
      setLoading(true);
      setTimeout(() => {
        loadProfile(uid).finally(() => setLoading(false));
      }, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  // Read the live session (not a possibly-stale closure) so a just-created
  // guest never gets their fresh profile wiped right after sign-in.
  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await loadProfile(data.session?.user.id);
  }, [loadProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    syncLegacyStorage(null);
  };

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

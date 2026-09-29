import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface VibeProfile {
  id: string;
  username: string;
  avatar: string;
  mood: string | null;
}

interface AuthContextType {
  session: Session | null;
  profile: VibeProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Keeps older, localStorage-based features working with the real account. */
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

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      syncLegacyStorage(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, username, avatar, mood")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);
    syncLegacyStorage(data ?? null);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // defer DB call out of the auth callback
      setTimeout(() => {
        loadProfile(s?.user.id).finally(() => setLoading(false));
      }, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user.id).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(
    () => loadProfile(session?.user.id),
    [loadProfile, session]
  );

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

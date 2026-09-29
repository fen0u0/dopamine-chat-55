import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AVATARS, randomAlias } from "@/lib/chat";
import { useAliasCheck } from "@/lib/useAliasCheck";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const { session, profile, loading, refreshProfile } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [alias, setAlias] = useState(randomAlias());
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status, message } = useAliasCheck(alias, session?.user.id);

  // Short splash; skipped entirely when coming back from Google with a session
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), session ? 0 : 1200);
    return () => clearTimeout(t);
  }, [session]);

  useEffect(() => {
    // OAuth restores the session before the profile query finishes. Let the
    // app-level onboarding gate decide whether setup is still needed.
    if (!loading && session) navigate("/", { replace: true });
  }, [loading, session, navigate]);

  const saveProfile = async (userId: string) => {
    // upsert on id: re-running setup never collides with your own row
    const { error: e } = await supabase
      .from("profiles")
      .upsert({ id: userId, username: alias, avatar }, { onConflict: "id" });
    if (e) {
      setError(e.code === "23505" ? "alias taken, roll again 🎲" : e.message);
      return false;
    }
    await refreshProfile();
    return true;
  };

  const handleGuest = async () => {
    if (status === "invalid" || status === "taken") return setError(message);
    setBusy(true);
    setError(null);
    let userId = session?.user.id;
    if (!userId) {
      const { data, error: e } = await supabase.auth.signInAnonymously();
      if (e || !data.user) {
        setBusy(false);
        return setError(e?.message ?? "couldn't sign in");
      }
      userId = data.user.id;
    }
    const ok = await saveProfile(userId);
    setBusy(false);
    if (ok) navigate("/", { replace: true });
  };

  const handleGoogleLogin = async () => {
    setGoogleBusy(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (authError) {
      console.error("Auth error:", authError.message);
      setError(authError.message);
      setGoogleBusy(false);
    }
  };

  const needsSetup = !!session && !profile;
  const shownError = error ?? (status === "taken" || status === "invalid" ? message : null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {showSplash || loading ? (
          <motion.div
            key="splash"
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-6xl font-bold gradient-text"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              vibe~
            </motion.h1>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="max-w-sm w-full text-center space-y-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold gradient-text">vibe~</h1>
            <p className="text-muted-foreground">
              {needsSetup ? "pick your anon identity" : "no names. no faces. just vibes."}
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={cn(
                    "w-11 h-11 rounded-full text-2xl bg-secondary transition-all",
                    avatar === a ? "ring-2 ring-primary scale-110" : "opacity-60 hover:opacity-100"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                value={alias}
                onChange={(e) => { setError(null); setAlias(e.target.value.toLowerCase().replace(/\s/g, "_")); }}
                maxLength={20}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary border border-foreground/5 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => { setError(null); setAlias(randomAlias()); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                aria-label="Random alias"
              >
                <Dices className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs font-mono h-4 text-muted-foreground">
              {shownError ? <span className="text-destructive">{shownError}</span>
                : status === "checking" ? "checking…"
                : status === "available" ? "✓ available" : ""}
            </p>

            <button
              onClick={handleGuest}
              disabled={busy || status === "checking" || status === "taken" || status === "invalid"}
              className="w-full py-3 rounded-xl font-semibold bg-primary text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {needsSetup ? "let's go ✨" : busy ? "entering..." : "enter as guest 👻"}
            </button>

            {!needsSetup && (
              <>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
                </div>
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleBusy}
                  className="w-full py-3 rounded-xl font-semibold bg-secondary border border-border hover:bg-secondary/70 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {googleBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                  {googleBusy ? "opening google…" : "continue with Google"}
                </button>
                <p className="text-[11px] text-muted-foreground">
                  google only saves your chats across devices — others only ever see your alias
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;

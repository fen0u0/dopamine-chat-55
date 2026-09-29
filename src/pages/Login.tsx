import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { AVATARS, randomAlias, validateAlias } from "@/lib/chat";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const { session, profile, loading, refreshProfile } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [alias, setAlias] = useState(randomAlias());
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && session && profile) navigate("/", { replace: true });
  }, [loading, session, profile, navigate]);

  const createProfile = async (userId: string) => {
    const { error: e } = await supabase
      .from("profiles")
      .insert({ id: userId, username: alias, avatar });
    if (e) {
      setError(e.code === "23505" ? "alias taken, roll again 🎲" : e.message);
      return false;
    }
    await refreshProfile();
    return true;
  };

  const handleGuest = async () => {
    const v = validateAlias(alias);
    if (v) return setError(v);
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
    await createProfile(userId);
    setBusy(false);
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError(result.error.message ?? "google sign-in failed");
  };

  const needsSetup = !!session && !profile;

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
            transition={{ duration: 0.6 }}
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

            {/* Avatar picker */}
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

            {/* Alias */}
            <div className="relative">
              <input
                value={alias}
                onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                maxLength={20}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary border border-foreground/5 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => setAlias(randomAlias())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                aria-label="Random alias"
              >
                <Dices className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              onClick={handleGuest}
              disabled={busy}
              className="w-full py-3 rounded-xl font-semibold bg-primary text-primary-foreground disabled:opacity-50"
            >
              {needsSetup ? "let's go ✨" : busy ? "entering..." : "enter as guest 👻"}
            </button>

            {!needsSetup && (
              <>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
                </div>
                <button
                  onClick={handleGoogle}
                  className="w-full py-3 rounded-xl font-semibold bg-secondary border border-border hover:bg-secondary/70"
                >
                  continue with Google
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Short splash; skipped entirely when coming back from Google with a session
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), session ? 0 : 1200);
    return () => clearTimeout(t);
  }, [session]);

  useEffect(() => {
    if (!loading && session && profile) navigate("/", { replace: true });
  }, [loading, session, profile, navigate]);

  const handleGuest = async () => {
    setBusy(true);
    setError(null);
    try {
      if (!session) {
        const { data, error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) {
          setError("guest access is unavailable right now");
          return;
        }
        if (!data.session) {
          setError("guest access is unavailable right now");
          return;
        }
      }

      // Leave the login screen as soon as auth succeeds. The auth provider and
      // onboarding gate continue loading the profile in the background.
      navigate("/", { replace: true });
    } catch {
      setError("guest access is unavailable right now");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.redirected) return; // browser is leaving; keep spinner
    setGoogleBusy(false);
    if (result.error) setError(result.error.message ?? "google sign-in failed");
  };

  const shownError = error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] retro-scanlines" aria-hidden="true" />
      <div className="pointer-events-none absolute left-6 top-8 font-jb text-xs text-primary/70" aria-hidden="true">[vibe.exe]</div>
      <div className="pointer-events-none absolute right-6 bottom-8 font-jb text-xs text-muted-foreground" aria-hidden="true">status: online</div>
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
            <div className="mb-8">
              <div className="mb-3 font-jb text-xs tracking-[0.3em] text-primary/80">✦ WELCOME TO THE VOID ✦</div>
              <h1 className="font-jb text-4xl font-bold tracking-tight text-primary retro-glow">vibe~</h1>
              <p className="mt-3 font-jb text-sm text-muted-foreground">meet strangers online</p>
            </div>

            {shownError && <p className="text-sm text-destructive">{shownError}</p>}

            <button
              onClick={handleGuest}
              disabled={busy}
              className="w-full border-2 border-primary py-3 font-jb text-sm font-semibold uppercase tracking-wide bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--foreground)/0.18)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {busy ? "entering..." : "enter as guest"}
            </button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
            </div>
            <button
              onClick={handleGoogle}
              disabled={googleBusy}
              className="w-full border-2 border-border py-3 font-jb text-sm font-semibold uppercase tracking-wide bg-secondary hover:border-primary/60 hover:bg-secondary/80 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {googleBusy && <Loader2 className="w-4 h-4 animate-spin" />}
              {googleBusy ? "opening google…" : "continue with Google"}
            </button>
            <p className="text-[11px] text-muted-foreground">
              google only saves your chats across devices — others only ever see your alias
            </p>
            <div className="pt-3 font-jb text-[10px] tracking-[0.18em] text-muted-foreground/70">
              <span className="mr-1 text-primary/80" aria-hidden="true">✦</span>
              made by fen
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;

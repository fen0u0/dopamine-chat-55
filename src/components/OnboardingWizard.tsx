import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Loader2, X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { randomAlias } from "@/lib/chat";
import { useAliasCheck } from "@/lib/useAliasCheck";
import { cn } from "@/lib/utils";

export const AURAS: Record<string, string> = {
  violet: "from-primary to-accent",
  sunset: "from-accent to-destructive",
  ocean: "from-primary/60 to-secondary",
  lime: "from-accent/70 to-primary/40",
  void: "from-muted to-foreground/40",
  candy: "from-destructive/70 to-primary",
};
const INTO = ["coffee ☕", "music 🎧", "gaming 🎮", "travel ✈️", "anime 🌸", "books 📚", "memes 🐸", "gym 💪", "art 🎨", "films 🎬", "cooking 🍜", "astrology 🔮"];
const GREEN = ["replies fast", "sends memes", "good listener", "no ego", "late-night talks", "hypes you up", "shares playlists"];
const RED = ["dry texter", "leaves on read", "pineapple pizza", "3am overthinker", "too many tabs open", "says 'k'", "horoscope believer"];

const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

interface Props {
  open: boolean;
  onClose?: () => void;
  editMode?: boolean;
}

const Chip = ({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-full text-sm border transition-colors",
      on ? "bg-primary text-primary-foreground border-primary" : "border-foreground/10 bg-foreground/5 text-foreground/80 hover:border-foreground/30"
    )}
  >
    {children}
  </motion.button>
);

const OnboardingWizard = ({ open, onClose, editMode }: Props) => {
  const { session, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [alias, setAlias] = useState("");
  const [aura, setAura] = useState("violet");
  const [into, setInto] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [currently, setCurrently] = useState("");
  const [opinion, setOpinion] = useState("");
  const [green, setGreen] = useState<string[]>([]);
  const [red, setRed] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { status, message } = useAliasCheck(alias, session?.user.id);

  useEffect(() => {
    if (!open || !profile) return;
    setStep(0);
    setAlias(profile.username);
    setAura(profile.aura_color || "violet");
    setInto(profile.into_tags ?? []);
    setCurrently(profile.bio_currently ?? "");
    setOpinion(profile.unpopular_opinion ?? "");
    setGreen(profile.green_flags ?? []);
    setRed(profile.red_flags ?? []);
    setErr(null);
  }, [open, profile]);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const go = (d: number) => { setDir(d); setStep((s) => s + d); };
  const aliasOk = status === "available" || status === "idle";

  const finish = async () => {
    if (!session) return;
    if (!alias.trim() || !currently.trim()) {
      setErr("add an alias and what you're currently into to publish your profile");
      setStep(!alias.trim() ? 0 : 2);
      return;
    }
    setSaving(true);
    setErr(null);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: alias,
        aura_color: aura,
        into_tags: into,
        bio_currently: currently.trim() || null,
        unpopular_opinion: opinion.trim() || null,
        green_flags: green,
        red_flags: red,
        onboarding_completed: true,
      })
      .eq("id", session.user.id);
    setSaving(false);
    if (error) {
      setErr(error.code === "23505" ? "alias taken, roll again 🎲" : error.message);
      if (error.code === "23505") { setDir(-1); setStep(0); }
      return;
    }
    await refreshProfile();
    onClose?.();
  };

  const steps = [
    <div key="0" className="space-y-5">
      <h2 className="text-2xl font-bold">pick your aura ✨</h2>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(AURAS).map(([k, g]) => (
          <motion.button key={k} whileTap={{ scale: 0.9 }} onClick={() => setAura(k)}
            className={cn("aspect-square rounded-2xl bg-gradient-to-br flex items-end p-2 transition-all", g,
              aura === k ? "ring-2 ring-foreground scale-105" : "opacity-70")}>
            <span className="font-jb text-[10px] text-foreground">{k}</span>
          </motion.button>
        ))}
      </div>
      <div className="relative">
        <input value={alias} maxLength={20}
          onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/\s/g, "_"))}
          className="w-full px-4 py-3 pr-12 rounded-2xl bg-foreground/5 border border-foreground/10 font-jb focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <button onClick={() => setAlias(randomAlias())} aria-label="Reroll alias"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
          <Dices className="w-5 h-5" />
        </button>
      </div>
      <p className="font-jb text-xs h-4">
        {status === "checking" ? <span className="text-muted-foreground">checking…</span>
          : status === "available" ? <span className="text-primary">✓ available</span>
          : message ? <span className="text-destructive">{message}</span> : null}
      </p>
    </div>,
    <div key="1" className="space-y-5">
      <h2 className="text-2xl font-bold">what are you into? 🌀</h2>
      <div className="flex flex-wrap gap-2">
        {[...INTO, ...into.filter((t) => !INTO.includes(t))].map((t) => (
          <Chip key={t} on={into.includes(t)} onClick={() => toggle(into, setInto, t)}>{t}</Chip>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={(e) => {
        e.preventDefault();
        const v = custom.trim().toLowerCase().slice(0, 24);
        if (v && !into.includes(v)) setInto([...into, v]);
        setCustom("");
      }}>
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="add your own…"
          className="flex-1 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 text-sm focus:outline-none" />
        <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center" aria-label="Add tag">
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>,
    <div key="2" className="space-y-4">
      <h2 className="text-2xl font-bold">currently & hot takes 🔥</h2>
      <label className="block space-y-1">
        <span className="font-jb text-[11px] text-muted-foreground">// currently (on repeat, rabbit holes)</span>
        <textarea value={currently} onChange={(e) => setCurrently(e.target.value)} maxLength={140} rows={2}
          className="w-full px-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </label>
      <label className="block space-y-1">
        <span className="font-jb text-[11px] text-muted-foreground">// unpopular opinion</span>
        <textarea value={opinion} onChange={(e) => setOpinion(e.target.value)} maxLength={140} rows={2}
          className="w-full px-4 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </label>
    </div>,
    <div key="3" className="space-y-5">
      <h2 className="text-2xl font-bold">vibe check ✅🚩</h2>
      <div className="space-y-2">
        <p className="font-jb text-[11px] text-muted-foreground">// green flags</p>
        <div className="flex flex-wrap gap-2">
          {GREEN.map((t) => <Chip key={t} on={green.includes(t)} onClick={() => toggle(green, setGreen, t)}>🟢 {t}</Chip>)}
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-jb text-[11px] text-muted-foreground">// red flags (affectionate)</p>
        <div className="flex flex-wrap gap-2">
          {RED.map((t) => <Chip key={t} on={red.includes(t)} onClick={() => toggle(red, setRed, t)}>🚩 {t}</Chip>)}
        </div>
      </div>
    </div>,
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] vibe-wizard-bg flex items-center justify-center p-4 text-foreground"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="vibe-glass w-full max-w-md p-6 space-y-6 overflow-hidden"
            initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} transition={spring}>
            <div className="flex items-center justify-between">
              <span className="font-jb text-xs text-muted-foreground">[{String(step + 1).padStart(2, "0")}/04]</span>
              {editMode && (
                <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="h-px w-full bg-foreground/10 overflow-hidden">
              <motion.div className="h-full bg-primary" animate={{ width: `${((step + 1) / 4) * 100}%` }} transition={spring} />
            </div>

            <div className="relative min-h-[320px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={step} custom={dir}
                  initial={{ x: dir * 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 60, opacity: 0 }}
                  transition={spring}>
                  {steps[step]}
                </motion.div>
              </AnimatePresence>
            </div>

            {err && <p className="text-sm text-destructive font-jb">{err}</p>}

            <div className="flex items-center gap-3">
              {!editMode && (
                <button onClick={onClose} className="px-2 py-3 rounded-2xl font-jb text-xs text-muted-foreground hover:text-foreground">
                  skip for now
                </button>
              )}
              {step > 0 && (
                <button onClick={() => go(-1)} className="px-5 py-3 rounded-2xl border border-foreground/10 font-jb text-sm">back</button>
              )}
              {step < 3 ? (
                <button onClick={() => go(1)} disabled={step === 0 && !aliasOk}
                  className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-40">
                  next →
                </button>
              ) : (
                <button onClick={finish} disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editMode ? "save vibe" : "enter the vibe ✨"}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const OnboardingGate = () => {
  const { session, profile, loading } = useAuth();
  const show = !loading && !!session && !!profile && !profile.onboarding_completed;
  return <OnboardingWizard open={show} />;
};

export default OnboardingWizard;

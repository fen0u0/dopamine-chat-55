import { useState } from "react";
import SignOutButton from "@/components/SignOutButton";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Bell,
  Moon,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Globe,
  Ghost,
  Shuffle,
  MessageCircle,
  Shield,
  Trash2,
  Download,
  HelpCircle,
  FileText,
  Heart,
  Palette,
  Vibrate,
  UserX,
  Ban,
  Coffee,
  Brain,
  Skull,
  PartyPopper,
  Sun,
} from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import BottomNav from "@/components/BottomNav";
import MoodMatchModal from "@/components/MoodMatchModal";
import AppGuideModal from "@/components/AppGuideModal";
import { toast } from "sonner";
import { soundManager } from "@/lib/sounds";
import { Profile } from "@/types/profile";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const navigate = useNavigate();
  const settings = useSettings();
  const [showMoodMatch, setShowMoodMatch] = useState(false);
  const [showAppGuide, setShowAppGuide] = useState(false);

  const handleMoodMatch = (profile: Profile) => {
    navigate(`/chat/${profile.id}`);
  };

  const SettingToggle = ({ 
    icon, 
    label, 
    description, 
    value, 
    onChange,
    quirky = false 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    description?: string;
    value: boolean; 
    onChange: (v: boolean) => void;
    quirky?: boolean;
  }) => (
    <div className={`flex items-center justify-between py-3.5 ${quirky ? 'opacity-90' : ''}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className={`flex-shrink-0 ${quirky ? "text-coral" : "text-muted-foreground"}`}>{icon}</span>
        <div className="min-w-0">
          <p className={`font-medium ${quirky ? 'text-coral' : 'text-foreground'}`}>{label}</p>
          {description && <p className="text-xs text-muted-foreground truncate">{description}</p>}
        </div>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        className={quirky ? "data-[state=checked]:bg-coral" : ""}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="flex items-center justify-between px-4 h-16 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-secondary/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">settings</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto space-y-6">
        {/* Discovery */}
        <motion.div
          className="grid grid-cols-1 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => setShowMoodMatch(true)}
            className="glass rounded-2xl p-4 text-left flex items-center gap-4"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-coral flex items-center justify-center">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">mood match</p>
              <p className="text-xs text-muted-foreground">find someone on your wavelength</p>
            </div>
          </motion.button>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          className="glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">notifications</h3>
          </div>
          <div className="divide-y divide-border/50">
            <SettingToggle
              icon={<Bell className="w-4 h-4" />}
              label="push notifications"
              description="get notified about activity"
              value={settings.notifications}
              onChange={(v) => settings.updateSetting("notifications", v)}
            />
            <SettingToggle
              icon={<MessageCircle className="w-4 h-4" />}
              label="new messages"
              value={settings.messageNotifs}
              onChange={(v) => settings.updateSetting("messageNotifs", v)}
            />
            <SettingToggle
              icon={<Heart className="w-4 h-4" />}
              label="new connections"
              value={settings.matchNotifs}
              onChange={(v) => settings.updateSetting("matchNotifs", v)}
            />
          </div>
        </motion.div>

        {/* Sounds & Haptics */}
        <motion.div
          className="glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">sounds & haptics</h3>
          </div>
          <div className="divide-y divide-border/50">
            <SettingToggle
              icon={settings.sounds ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              label="sound effects"
              value={settings.sounds}
              onChange={(v) => settings.updateSetting("sounds", v)}
            />
            <SettingToggle
              icon={<Vibrate className="w-4 h-4" />}
              label="haptic feedback"
              value={settings.vibration}
              onChange={(v) => settings.updateSetting("vibration", v)}
            />
          </div>
        </motion.div>

        {/* Privacy Section */}
        <motion.div
          className="glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">privacy</h3>
          </div>
          <div className="divide-y divide-border/50">
            <SettingToggle
              icon={settings.showOnline ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              label="show online status"
              description="let others see when you're active"
              value={settings.showOnline}
              onChange={(v) => settings.updateSetting("showOnline", v)}
            />
            <SettingToggle
              icon={<Globe className="w-4 h-4" />}
              label="show timezone"
              value={settings.showTimezone}
              onChange={(v) => settings.updateSetting("showTimezone", v)}
            />
            <SettingToggle
              icon={<Check className="w-4 h-4" />}
              label="read receipts"
              description="show when you've read messages"
              value={settings.readReceipts}
              onChange={(v) => settings.updateSetting("readReceipts", v)}
            />
            <SettingToggle
              icon={<MessageCircle className="w-4 h-4" />}
              label="typing indicator"
              value={settings.typingIndicator}
              onChange={(v) => settings.updateSetting("typingIndicator", v)}
            />
          </div>
        </motion.div>

        {/* Appearance & Themes */}
        <motion.div
          className="glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">appearance</h3>
          </div>
          
          {/* Theme Selection */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-3">choose your vibe</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "dark", label: "dark", color: "bg-zinc-900", icon: "🌙" },
                { id: "light", label: "light", color: "bg-zinc-100", icon: "☀️" },
                { id: "grey", label: "grey", color: "bg-zinc-600", icon: "🌫️" },
                { id: "void", label: "void", color: "bg-purple-950", icon: "🕳️" },
                { id: "neon", label: "neon", color: "bg-pink-600", icon: "⚡" },
                { id: "sunset", label: "sunset", color: "bg-orange-500", icon: "🌅" },
                { id: "forest", label: "forest", color: "bg-emerald-700", icon: "🌲" },
                { id: "candy", label: "candy", color: "bg-pink-400", icon: "🍬" },
              ].map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    if (settings.sounds) soundManager.playClick();
                    settings.updateSetting("theme", theme.id as any);
                    toast.success(`${theme.label} mode activated ${theme.icon}`);
                  }}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    settings.theme === theme.id 
                      ? "border-primary bg-primary/10" 
                      : "border-transparent bg-secondary/50 hover:bg-secondary"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-6 h-6 rounded-full ${theme.color} mx-auto mb-1`} />
                  <p className="text-[10px] text-center text-foreground">{theme.label}</p>
                  {settings.theme === theme.id && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quirky Settings */}
        <motion.div
          className="glass rounded-3xl p-4 border border-coral/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <PartyPopper className="w-5 h-5 text-coral" />
            <h3 className="font-semibold text-coral">unhinged settings 🌀</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">for the chronically chaotic</p>
          <div className="divide-y divide-border/50">
            <SettingToggle
              icon={<Brain className="w-4 h-4" />}
              label="chaotic mode"
              description="random UI surprises"
              value={settings.chaoticMode}
              onChange={(v) => {
                settings.updateSetting("chaoticMode", v);
                if (v) toast.success("chaos activated 🌀");
              }}
              quirky
            />
            <SettingToggle
              icon={<Coffee className="w-4 h-4" />}
              label="goblin hours"
              description="enhanced features after midnight"
              value={settings.goblinHours}
              onChange={(v) => {
                settings.updateSetting("goblinHours", v);
                if (v) toast.success("goblin mode: on 🧌");
              }}
              quirky
            />
            <SettingToggle
              icon={<Ghost className="w-4 h-4" />}
              label="cryptid mode"
              description="become extra mysterious"
              value={settings.cryptidMode}
              onChange={(v) => {
                settings.updateSetting("cryptidMode", v);
                if (v) toast.success("*vanishes mysteriously* 👻");
              }}
              quirky
            />
            <SettingToggle
              icon={<Skull className="w-4 h-4" />}
              label="unhinged replies"
              description="AI suggests chaotic responses"
              value={settings.unhingedReplies}
              onChange={(v) => {
                settings.updateSetting("unhingedReplies", v);
                if (v) toast.success("prepare for chaos 💀");
              }}
              quirky
            />
          </div>
        </motion.div>

        {/* Support & Info */}
        <motion.div
          className="glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">support & info</h3>
          </div>
          <div className="space-y-1">
            {[
              { icon: <Sparkles className="w-4 h-4" />, label: "app guide", action: () => setShowAppGuide(true) },
              { icon: <HelpCircle className="w-4 h-4" />, label: "help center", action: () => toast.info("help center coming soon") },
              { icon: <FileText className="w-4 h-4" />, label: "terms of service", action: () => toast.info("terms of service") },
              { icon: <Shield className="w-4 h-4" />, label: "privacy policy", action: () => toast.info("privacy policy") },
              { icon: <Download className="w-4 h-4" />, label: "download my data", action: () => toast.info("data download requested") },
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-secondary/50 transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="text-muted-foreground">{item.icon}</span>
                <span className="text-foreground">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="glass rounded-3xl p-4 border border-destructive/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-destructive">danger zone</h3>
          </div>
          <div className="space-y-1">
            {[
              { icon: <UserX className="w-4 h-4" />, label: "deactivate account", danger: false },
              { icon: <Ban className="w-4 h-4" />, label: "blocked users", danger: false },
              { icon: <Trash2 className="w-4 h-4" />, label: "delete account", danger: true },
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={() => toast.error("this would do something scary")}
                className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-destructive/10 transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="text-destructive">{item.icon}</span>
                <span className={item.danger ? "text-destructive font-medium" : "text-foreground"}>{item.label}</span>
              </motion.button>
            ))}
          </div>
          <SignOutButton />
        </motion.div>

        {/* Version */}
        <motion.p
          className="text-center text-xs text-muted-foreground py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          cupid v1.0.0 · made with 💀 and chaos
        </motion.p>
      </main>

      <BottomNav />

      {/* Modals */}
      <MoodMatchModal
        isOpen={showMoodMatch}
        onClose={() => setShowMoodMatch(false)}
        onMatch={handleMoodMatch}
      />
      <AppGuideModal
        isOpen={showAppGuide}
        onClose={() => setShowAppGuide(false)}
      />
    </div>
  );
};

export default Settings;

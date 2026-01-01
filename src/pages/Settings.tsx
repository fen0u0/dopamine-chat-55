import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Gem,
  Play,
  Zap,
  Crown,
  Sparkles,
  Gift,
  Star,
  Check,
  Rocket,
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
import { useGems } from "@/contexts/GemsContext";
import { useSettings } from "@/contexts/SettingsContext";
import BottomNav from "@/components/BottomNav";
import DailyRewardsModal from "@/components/DailyRewardsModal";
import ProfileBoostModal from "@/components/ProfileBoostModal";
import MoodMatchModal from "@/components/MoodMatchModal";
import AppGuideModal from "@/components/AppGuideModal";
import { toast } from "sonner";
import { soundManager } from "@/lib/sounds";
import { Profile } from "@/types/profile";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const navigate = useNavigate();
  const { gems, addGems, streak, canClaimDaily, boostEndTime, isBoostActive } = useGems();
  const settings = useSettings();
  const [watchingAd, setWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showMoodMatch, setShowMoodMatch] = useState(false);
  const [showAppGuide, setShowAppGuide] = useState(false);

  const boostTimeRemaining = isBoostActive
    ? Math.ceil((boostEndTime! - Date.now()) / 60000)
    : 0;

  const gemPackages = [
    { gems: 50, price: "$0.99", popular: false, icon: <Gem className="w-6 h-6" /> },
    { gems: 150, price: "$2.99", popular: true, icon: <Star className="w-6 h-6" /> },
    { gems: 500, price: "$7.99", popular: false, icon: <Crown className="w-6 h-6" /> },
    { gems: 1200, price: "$14.99", popular: false, icon: <Zap className="w-6 h-6" /> },
  ];

  const handleWatchAd = () => {
    setWatchingAd(true);
    setAdProgress(0);
    
    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setWatchingAd(false);
          if (settings.sounds) soundManager.playGemCollect();
          addGems(5);
          toast.success("you earned 5 gems! 💎");
          return 0;
        }
        return prev + 2;
      });
    }, 60);
  };

  const handleBuyGems = (amount: number, price: string) => {
    if (settings.sounds) soundManager.playGemCollect();
    addGems(amount);
    toast.success(`you purchased ${amount} gems! 💎`);
  };

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
        {/* Current Gems */}
        <motion.div
          className="glass rounded-3xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Gem className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold gradient-text mb-1">{gems}</h2>
          <p className="text-muted-foreground">your gems balance</p>
        </motion.div>

        {/* Quick Actions Row */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {/* Daily Rewards */}
          <motion.button
            onClick={() => setShowDailyRewards(true)}
            className="glass rounded-2xl p-4 text-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {canClaimDaily && (
              <motion.div
                className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-2">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-semibold text-foreground">daily</p>
            <p className="text-[10px] text-muted-foreground">{streak} streak</p>
          </motion.button>

          {/* Profile Boost */}
          <motion.button
            onClick={() => setShowBoostModal(true)}
            className="glass rounded-2xl p-4 text-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isBoostActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-semibold text-foreground">boost</p>
            <p className="text-[10px] text-muted-foreground">
              {isBoostActive ? `${boostTimeRemaining}m left` : 'get views'}
            </p>
          </motion.button>

          {/* Mood Match */}
          <motion.button
            onClick={() => setShowMoodMatch(true)}
            className="glass rounded-2xl p-4 text-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-coral flex items-center justify-center mx-auto mb-2">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-semibold text-foreground">mood</p>
            <p className="text-[10px] text-muted-foreground">find match</p>
          </motion.button>
        </motion.div>

        {/* Watch Ads Section */}
        <motion.div
          className="glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">watch ads</h3>
              <p className="text-sm text-muted-foreground">earn 5 gems per video</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {watchingAd ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${adProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  watching ad... {Math.floor(adProgress)}%
                </p>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                onClick={handleWatchAd}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Gift className="w-5 h-5" />
                watch & earn
              </motion.button>
            )}
          </AnimatePresence>
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

        {/* Appearance */}
        <motion.div
          className="glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">appearance</h3>
          </div>
          <div className="divide-y divide-border/50">
            <SettingToggle
              icon={settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              label="dark mode"
              description="easier on the eyes at 3am"
              value={settings.darkMode}
              onChange={(v) => settings.updateSetting("darkMode", v)}
            />
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

        {/* Buy Gems Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            buy gems
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {gemPackages.map((pkg, index) => (
              <motion.button
                key={pkg.gems}
                onClick={() => handleBuyGems(pkg.gems, pkg.price)}
                className={`relative glass rounded-2xl p-4 text-center ${
                  pkg.popular ? "ring-2 ring-primary" : ""
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-[10px] text-primary-foreground font-semibold">
                    POPULAR
                  </span>
                )}
                <div className="text-purple-400 mb-2 flex justify-center">{pkg.icon}</div>
                <p className="text-xl font-bold text-foreground">{pkg.gems}</p>
                <p className="text-sm text-muted-foreground mb-2">gems</p>
                <div className="py-2 rounded-xl bg-primary/20 text-primary font-semibold text-sm">
                  {pkg.price}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Premium Features */}
        <motion.div
          className="glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">premium</h3>
              <p className="text-sm text-muted-foreground">unlock everything</p>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {[
              "unlimited profile unlocks",
              "see who vibed with you",
              "no ads ever",
              "priority mood matching",
              "exclusive quirky features",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => toast.info("premium coming soon! 👑")}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            upgrade to premium - $9.99/mo
          </button>
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
      <DailyRewardsModal
        isOpen={showDailyRewards}
        onClose={() => setShowDailyRewards(false)}
      />
      <ProfileBoostModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
      />
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

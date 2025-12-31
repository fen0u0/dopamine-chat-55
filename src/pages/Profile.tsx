import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Edit2,
  Globe,
  Shield,
  LogOut,
  ChevronRight,
  Gem,
  Sparkles,
  Coffee,
  Moon,
  Music,
  Plane,
  Gamepad2,
  BookOpen,
  Camera,
  Dumbbell,
  Users,
  MessageCircle,
  Zap,
  Shuffle,
  Ghost,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import EditProfileModal from "@/components/EditProfileModal";
import SafetyCenterModal from "@/components/SafetyCenterModal";
import { useGems } from "@/contexts/GemsContext";
import { toast } from "sonner";
import { generateRandomAlias, quirkyPrompts, moodOptions, vibeOptions } from "@/data/profiles";

const Profile = () => {
  const navigate = useNavigate();
  const { gems } = useGems();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [alias] = useState(() => {
  const saved = JSON.parse(localStorage.getItem("profile_data") || "{}");
  return saved.alias || "sleepy_potato42";
});
  const [currentMood, setCurrentMood] = useState("✨ manifesting");
  
  const savedProfile = JSON.parse(localStorage.getItem("profile_data") || "{}");

const user = {
  bio:
    savedProfile.bio ||
    "chronically online | 3am thoughts enthusiast | probably overthinking rn",
  timezone: savedProfile.timezone || "GMT+5",
  vibe: savedProfile.vibe || "chaotic good",
  quirkyPrompt: {
    prompt: savedProfile.quirkyPrompt || "my roman empire:",
    answer:
      savedProfile.quirkyAnswer || "that one embarrassing thing from 2016",
  },
  interests:
    savedProfile.interests || [
      "memes",
      "late night talks",
      "chaos",
      "overthinking",
      "music",
    ],
};


  // Gen Z quirky features
  const [currentlyStatus] = useState({
    watching: "that show everyone's talking about",
    listening: "the same 3 songs on repeat",
    obsessing: "random wikipedia rabbit holes"
  });

  const [energyLevel] = useState(73);
  const [auraPoints] = useState(847);
  
  const vibeFlags = {
    green: ["good listener", "sends memes", "no small talk"],
    red: ["double texts", "3am overthinking", "spotify wrapped anxiety"]
  };

  const handleRegenerateAlias = () => {
    const newAlias = generateRandomAlias();
    setAlias(newAlias);
    toast.success(`you're now ${newAlias} 👻`);
  };

  const profileDetails = [
    { icon: <Globe className="w-4 h-4" />, label: "timezone", value: user.timezone },
    { icon: <Zap className="w-4 h-4" />, label: "current vibe", value: user.vibe },
    { icon: <Clock className="w-4 h-4" />, label: "active hours", value: "night owl" },
    { icon: <MessageCircle className="w-4 h-4" />, label: "reply speed", value: "chaotic" },
  ];

  const lookingFor = [
    { icon: <Users className="w-4 h-4" />, label: "here for", value: "random convos" },
    { icon: <Ghost className="w-4 h-4" />, label: "anonymity", value: "100% anon" },
    { icon: <Sparkles className="w-4 h-4" />, label: "energy", value: "unhinged welcomed" },
  ];

  const passions = [
    { icon: <Coffee className="w-4 h-4" />, label: "coffee" },
    { icon: <Music className="w-4 h-4" />, label: "music" },
    { icon: <Plane className="w-4 h-4" />, label: "travel" },
    { icon: <Gamepad2 className="w-4 h-4" />, label: "gaming" },
    { icon: <BookOpen className="w-4 h-4" />, label: "reading" },
    { icon: <Camera className="w-4 h-4" />, label: "photography" },
    { icon: <Dumbbell className="w-4 h-4" />, label: "fitness" },
    { icon: <Moon className="w-4 h-4" />, label: "3am talks" },
  ];

  const handleLogout = () => {
    toast.success("vanished into the void ✌️");
  };

  const menuItems = [
    { icon: <Gem className="w-5 h-5" />, label: "get gems", chevron: true, action: () => navigate("/settings") },
    { icon: <Shield className="w-5 h-5" />, label: "safety center", chevron: true, action: () => setShowSafetyModal(true) },
    { icon: <Settings className="w-5 h-5" />, label: "settings", chevron: true, action: () => navigate("/settings") },
    { icon: <Sparkles className="w-5 h-5" />, label: "go premium ✨", highlight: true, action: () => navigate("/settings") },
    { icon: <LogOut className="w-5 h-5" />, label: "vanish", danger: true, action: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="your alias" showLogo={false} />

      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {/* Profile Card */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative rounded-3xl overflow-hidden glass p-8">
            <div className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 30% 20%, hsl(var(--rose) / 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(var(--coral) / 0.4) 0%, transparent 50%)'
              }} 
            />
            
            <div className="relative flex flex-col items-center">
              <motion.div 
                className="w-28 h-28 rounded-full gradient-border flex items-center justify-center bg-card mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-5xl">👻</span>
              </motion.div>

              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button 
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-foreground/10"
                  onClick={handleRegenerateAlias}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Shuffle className="w-4 h-4 text-foreground" />
                </motion.button>
                <motion.button 
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-foreground/10"
                  onClick={() => setShowEditModal(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit2 className="w-4 h-4 text-foreground" />
                </motion.button>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-1 font-mono">
                {alias}
              </h1>
              <motion.span 
                className="pill active cursor-pointer"
                onClick={() => {
                  const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
                  setCurrentMood(randomMood);
                  toast.success(`mood updated to ${randomMood}`);
                }}
                whileHover={{ scale: 1.05 }}
              >
                {currentMood}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: "gems", value: gems.toString(), icon: "💎" },
            { label: "strangers met", value: "47", icon: "👻" },
            { label: "convos", value: "124", icon: "💬" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              onClick={() => stat.label === "gems" && navigate("/settings")}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Aura & Energy */}
        <motion.div
          className="flex gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <div className="flex-1 section-card !p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">aura</span>
              <span className="text-lg">✨</span>
            </div>
            <p className="text-xl font-bold text-foreground">{auraPoints}</p>
          </div>
          <div className="flex-1 section-card !p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">energy</span>
              <span className="text-lg">⚡</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${energyLevel}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{energyLevel}%</span>
            </div>
          </div>
        </motion.div>

        {/* Currently */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <h2 className="font-semibold text-foreground mb-3 text-sm">currently</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">📺</span>
              <span className="text-foreground/80">{currentlyStatus.watching}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">🎧</span>
              <span className="text-foreground/80">{currentlyStatus.listening}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">🧠</span>
              <span className="text-foreground/80">{currentlyStatus.obsessing}</span>
            </div>
          </div>
        </motion.div>

        {/* Quirky Prompt */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎭</span>
            <h2 className="font-semibold text-muted-foreground text-sm">{user.quirkyPrompt.prompt}</h2>
          </div>
          <p className="text-foreground font-medium">{user.quirkyPrompt.answer}</p>
        </motion.div>

        {/* Vibe Flags */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <h2 className="font-semibold text-foreground mb-3 text-sm">vibe check</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">🟢 green flags</p>
              <div className="flex flex-wrap gap-1.5">
                {vibeFlags.green.map((flag) => (
                  <span key={flag} className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    {flag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">🔴 red flags (affectionate)</p>
              <div className="flex flex-wrap gap-1.5">
                {vibeFlags.red.map((flag) => (
                  <span key={flag} className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            about this stranger
          </h2>
          <p className="text-sm text-foreground/80">{user.bio}</p>
        </motion.div>

        {/* Here For */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Ghost className="w-4 h-4 text-primary" />
            the vibe
          </h2>
          <div className="space-y-3">
            {lookingFor.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="text-sm text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-semibold text-foreground mb-4">details</h2>
          <div className="space-y-3">
            {profileDetails.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="text-sm text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="font-semibold text-foreground mb-3">into</h2>
          <div className="flex flex-wrap gap-2">
            {passions.map((passion) => (
              <span
                key={passion.label}
                className="pill flex items-center gap-2"
              >
                {passion.icon}
                {passion.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div
          className="glass rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              className={`menu-item ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-3">
                <span className={item.danger ? "text-destructive" : item.highlight ? "text-primary" : "text-muted-foreground"}>
                  {item.icon}
                </span>
                <span className={`font-medium ${item.danger ? "text-destructive" : item.highlight ? "text-primary" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
              {item.chevron && (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.button>
          ))}
        </motion.div>
      </main>

      <BottomNav />

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
      <SafetyCenterModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />
    </div>
  );
};

export default Profile;

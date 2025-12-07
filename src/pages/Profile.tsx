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
  const [alias, setAlias] = useState("sleepy_potato42");
  const [currentMood, setCurrentMood] = useState("✨ manifesting");
  
  const user = {
    bio: "chronically online | 3am thoughts enthusiast | probably overthinking rn",
    timezone: "GMT+5",
    vibe: "chaotic good",
    quirkyPrompt: {
      prompt: "my roman empire:",
      answer: "that one embarrassing thing from 2016"
    },
    interests: ["memes", "late night talks", "chaos", "overthinking", "music"],
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

        {/* Quirky Prompt */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎭</span>
            <h2 className="font-semibold text-muted-foreground text-sm">{user.quirkyPrompt.prompt}</h2>
          </div>
          <p className="text-foreground font-medium">{user.quirkyPrompt.answer}</p>
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

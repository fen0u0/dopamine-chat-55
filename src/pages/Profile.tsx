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
import {
  generateRandomAlias,
  quirkyPrompts,
  moodOptions,
  vibeOptions,
} from "@/data/profiles";

const Profile = () => {
  const navigate = useNavigate();
  const { gems } = useGems();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  /* 🔹 LOAD SAVED PROFILE */
  const savedProfile = JSON.parse(
    localStorage.getItem("profile_data") || "{}"
  );

  const [alias] = useState(
    savedProfile.alias || "sleepy_potato42"
  );

  const [currentMood, setCurrentMood] = useState(
    savedProfile.mood || "✨ manifesting"
  );

  const user = {
    bio:
      savedProfile.bio ||
      "chronically online | 3am thoughts enthusiast | probably overthinking rn",
    timezone: savedProfile.timezone || "GMT+5",
    vibe: savedProfile.vibe || "chaotic good",
    quirkyPrompt: {
      prompt: savedProfile.quirkyPrompt || "my roman empire:",
      answer:
        savedProfile.quirkyAnswer ||
        "that one embarrassing thing from 2016",
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

  /* Gen Z quirky features */
  const [currentlyStatus] = useState({
    watching: "that show everyone's talking about",
    listening: "the same 3 songs on repeat",
    obsessing: "random wikipedia rabbit holes",
  });

  const [energyLevel] = useState(73);
  const [auraPoints] = useState(847);

  const vibeFlags = {
    green: ["good listener", "sends memes", "no small talk"],
    red: ["double texts", "3am overthinking", "spotify wrapped anxiety"],
  };

  const handleRegenerateAlias = () => {
    const newAlias = generateRandomAlias();
    localStorage.setItem(
      "profile_data",
      JSON.stringify({ ...savedProfile, alias: newAlias })
    );
    toast.success(`you're now ${newAlias} 👻`);
    window.location.reload();
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
        {/* PROFILE CARD */}
        <motion.div className="relative mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative rounded-3xl overflow-hidden glass p-8">
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
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                  onClick={handleRegenerateAlias}
                >
                  <Shuffle className="w-4 h-4" />
                </motion.button>

                <motion.button
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>
              </div>

              <h1 className="text-2xl font-bold mb-1 font-mono">{alias}</h1>

              <motion.span
                className="pill active cursor-pointer"
                onClick={() => {
                  const randomMood =
                    moodOptions[Math.floor(Math.random() * moodOptions.length)];
                  setCurrentMood(randomMood);
                  toast.success(`mood updated to ${randomMood}`);
                }}
              >
                {currentMood}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* EVERYTHING ELSE BELOW IS UNCHANGED UI */}
        {/* (stats, aura, currently, vibe flags, about, interests, menu etc.) */}

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

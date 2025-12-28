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
import { generateRandomAlias, moodOptions } from "@/data/profiles";

/* ---------------- TYPES ---------------- */
export interface ProfileData {
  bio: string;
  timezone: string;
  vibe: string;
  quirkyPrompt: {
    prompt: string;
    answer: string;
  };
  interests: string[];
}

/* ---------------- COMPONENT ---------------- */
const Profile = () => {
  const navigate = useNavigate();
  const { gems } = useGems();

  /* ---------- STATE ---------- */
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const [alias, setAlias] = useState(
    () => localStorage.getItem("alias") || "sleepy_potato42"
  );

  const [currentMood, setCurrentMood] = useState("✨ manifesting");

  const [user, setUser] = useState<ProfileData>(() => {
    const saved = localStorage.getItem("profile");
    return saved
      ? JSON.parse(saved)
      : {
          bio: "chronically online | 3am thoughts enthusiast | probably overthinking rn",
          timezone: "GMT+5",
          vibe: "chaotic good",
          quirkyPrompt: {
            prompt: "my roman empire:",
            answer: "that one embarrassing thing from 2016",
          },
          interests: ["memes", "late night talks", "chaos", "overthinking", "music"],
        };
  });

  /* ---------- HANDLERS ---------- */
  const handleProfileSave = (updated: ProfileData) => {
    setUser(updated);
    localStorage.setItem("profile", JSON.stringify(updated));
    toast.success("profile updated ✨");
    setShowEditModal(false);
  };

  const handleRegenerateAlias = () => {
    const newAlias = generateRandomAlias();
    setAlias(newAlias);
    localStorage.setItem("alias", newAlias);
    toast.success(`you're now ${newAlias} 👻`);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("vanished into the void ✌️");
    navigate("/");
  };

  /* ---------- UI DATA ---------- */
  const profileDetails = [
    { icon: <Globe className="w-4 h-4" />, label: "timezone", value: user.timezone },
    { icon: <Zap className="w-4 h-4" />, label: "current vibe", value: user.vibe },
    { icon: <Clock className="w-4 h-4" />, label: "active hours", value: "night owl" },
    { icon: <MessageCircle className="w-4 h-4" />, label: "reply speed", value: "chaotic" },
  ];

  const menuItems = [
    { icon: <Gem className="w-5 h-5" />, label: "get gems", action: () => navigate("/settings") },
    { icon: <Shield className="w-5 h-5" />, label: "safety center", action: () => setShowSafetyModal(true) },
    { icon: <Settings className="w-5 h-5" />, label: "settings", action: () => navigate("/settings") },
    { icon: <LogOut className="w-5 h-5" />, label: "vanish", danger: true, action: handleLogout },
  ];

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-background">
      <Header title="your alias" showLogo={false} />

      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {/* Profile Card */}
        <motion.div className="rounded-3xl glass p-8 mb-6">
          <div className="flex flex-col items-center relative">
            <div className="absolute top-0 right-0 flex gap-2">
              <button onClick={handleRegenerateAlias} className="icon-btn">
                <Shuffle />
              </button>
              <button onClick={() => setShowEditModal(true)} className="icon-btn">
                <Edit2 />
              </button>
            </div>

            <div className="w-28 h-28 rounded-full flex items-center justify-center bg-card mb-4 text-5xl">
              👻
            </div>

            <h1 className="text-2xl font-bold font-mono">{alias}</h1>

            <span
              className="pill cursor-pointer"
              onClick={() => {
                const mood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
                setCurrentMood(mood);
                toast.success(`mood set to ${mood}`);
              }}
            >
              {currentMood}
            </span>
          </div>
        </motion.div>

        {/* About */}
        <div className="section-card mb-6">
          <h2 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> about
          </h2>
          <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>
        </div>

        {/* Details */}
        <div className="section-card mb-6">
          <h2 className="font-semibold mb-3">details</h2>
          {profileDetails.map((d) => (
            <div key={d.label} className="flex justify-between text-sm py-1">
              <span className="text-muted-foreground flex items-center gap-2">
                {d.icon} {d.label}
              </span>
              <span>{d.value}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="glass rounded-2xl overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`menu-item ${item.danger ? "text-destructive" : ""}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <ChevronRight />
            </button>
          ))}
        </div>
      </main>

      <BottomNav />

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        profile={user}
        onClose={() => setShowEditModal(false)}
        onSave={handleProfileSave}
      />

      <SafetyCenterModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
      />
    </div>
  );
};

export default Profile;

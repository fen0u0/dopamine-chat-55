import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Edit2,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  LogOut,
  ChevronRight,
  Gem,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import EditProfileModal from "@/components/EditProfileModal";
import SafetyCenterModal from "@/components/SafetyCenterModal";
import { useGems } from "@/contexts/GemsContext";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { gems } = useGems();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  
  const user = {
    name: "You",
    age: 25,
    bio: "living my best life ✨ | coffee addict ☕ | looking for something real fr",
    location: "New York, NY",
    job: "Product Designer",
    school: "NYU",
    interests: ["travel", "photography", "music", "hiking", "coffee"],
  };

  const handleLogout = () => {
    toast.success("logged out bestie ✌️");
  };

  const menuItems = [
    { icon: <Gem className="w-5 h-5" />, label: "get gems", chevron: true, action: () => navigate("/settings") },
    { icon: <Shield className="w-5 h-5" />, label: "safety center", chevron: true, action: () => setShowSafetyModal(true) },
    { icon: <Settings className="w-5 h-5" />, label: "settings", chevron: true, action: () => navigate("/settings") },
    { icon: <Heart className="w-5 h-5" />, label: "go premium ✨", highlight: true, action: () => navigate("/settings") },
    { icon: <LogOut className="w-5 h-5" />, label: "log out", danger: true, action: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="profile" showLogo={false} />

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Profile Card */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative rounded-3xl overflow-hidden glass p-8">
            {/* Background Effect */}
            <div className="absolute inset-0 opacity-30" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 30% 20%, hsl(var(--cyber) / 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(var(--violet) / 0.4) 0%, transparent 50%)'
              }} 
            />
            
            <div className="relative flex flex-col items-center">
              {/* Avatar */}
              <motion.div 
                className="w-28 h-28 rounded-full gradient-border flex items-center justify-center bg-card mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl font-extrabold gradient-text">
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
              </motion.div>

              {/* Edit Button */}
              <motion.button 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-foreground/10"
                onClick={() => setShowEditModal(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit2 className="w-4 h-4 text-foreground" />
              </motion.button>

              {/* Profile Info */}
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1">
                {user.name}, {user.age}
              </h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-mono">{user.location}</span>
              </div>
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
            { label: "matches", value: "12", icon: "🔥" },
            { label: "likes", value: "24", icon: "💜" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass rounded-2xl p-4 text-center cursor-pointer card-hover"
              onClick={() => stat.label === "gems" && navigate("/settings")}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* About */}
        <motion.div
          className="glass rounded-2xl p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            about me
          </h2>
          <p className="text-sm text-foreground/80 mb-4 font-medium">{user.bio}</p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span className="font-mono">{user.job}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span className="font-mono">{user.school}</span>
            </div>
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          className="glass rounded-2xl p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-foreground mb-3">vibes ✨</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="pill"
              >
                {interest}
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
              className={`w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-all ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-3">
                <span className={item.danger ? "text-destructive" : item.highlight ? "text-primary" : "text-muted-foreground"}>
                  {item.icon}
                </span>
                <span className={`font-semibold ${item.danger ? "text-destructive" : item.highlight ? "text-primary" : "text-foreground"}`}>
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
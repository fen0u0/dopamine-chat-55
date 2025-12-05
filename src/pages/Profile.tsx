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
  Coffee,
  Moon,
  Dog,
  Music,
  Utensils,
  Plane,
  Gamepad2,
  BookOpen,
  Camera,
  Dumbbell,
  Users,
  MessageCircle,
  Zap,
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
    bio: "always down for new experiences ✨ | love meeting cool people | let's grab coffee or something",
    location: "New York, NY",
    job: "Product Designer",
    school: "NYU",
    interests: ["travel", "photography", "music", "hiking", "coffee"],
  };

  const profileDetails = [
    { icon: <Coffee className="w-4 h-4" />, label: "hangout style", value: "coffee chats" },
    { icon: <Moon className="w-4 h-4" />, label: "availability", value: "weekends" },
    { icon: <Dumbbell className="w-4 h-4" />, label: "activity level", value: "active" },
    { icon: <Dog className="w-4 h-4" />, label: "pets", value: "dog lover" },
    { icon: <Zap className="w-4 h-4" />, label: "energy", value: "chill vibes" },
  ];

  const lookingFor = [
    { icon: <Users className="w-4 h-4" />, label: "looking for", value: "new friends" },
    { icon: <MessageCircle className="w-4 h-4" />, label: "communication", value: "texter" },
    { icon: <Sparkles className="w-4 h-4" />, label: "vibe", value: "good conversations" },
  ];

  const passions = [
    { icon: <Coffee className="w-4 h-4" />, label: "coffee" },
    { icon: <Music className="w-4 h-4" />, label: "music" },
    { icon: <Plane className="w-4 h-4" />, label: "travel" },
    { icon: <Utensils className="w-4 h-4" />, label: "foodie" },
    { icon: <Gamepad2 className="w-4 h-4" />, label: "gaming" },
    { icon: <BookOpen className="w-4 h-4" />, label: "reading" },
    { icon: <Camera className="w-4 h-4" />, label: "photography" },
    { icon: <Dumbbell className="w-4 h-4" />, label: "fitness" },
  ];

  const handleLogout = () => {
    toast.success("logged out ✌️");
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
                <span className="text-4xl font-bold gradient-text">
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
              </motion.div>

              <motion.button 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-foreground/10"
                onClick={() => setShowEditModal(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit2 className="w-4 h-4 text-foreground" />
              </motion.button>

              <h1 className="text-3xl font-bold text-foreground mb-1">
                {user.name}, {user.age}
              </h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{user.location}</span>
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
            { label: "connections", value: "12", icon: "🤝" },
            { label: "vibes", value: "24", icon: "✨" },
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

        {/* About */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            about me
          </h2>
          <p className="text-sm text-foreground/80 mb-4">{user.bio}</p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span>{user.job}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{user.school}</span>
            </div>
          </div>
        </motion.div>

        {/* Looking For */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            what i'm here for
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

        {/* Lifestyle */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-semibold text-foreground mb-4">my vibe</h2>
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

        {/* Passions */}
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="font-semibold text-foreground mb-3">interests</h2>
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
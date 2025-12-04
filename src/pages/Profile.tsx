import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Edit2,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Shield,
  LogOut,
  ChevronRight,
  Gem,
} from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useGems } from "@/contexts/GemsContext";
import profile1 from "@/assets/profile-1.jpg";

const Profile = () => {
  const navigate = useNavigate();
  const { gems } = useGems();
  
  const user = {
    name: "You",
    age: 25,
    bio: "Adventure seeker 🌍 | Coffee lover ☕ | Looking for something real",
    location: "New York, NY",
    job: "Product Designer",
    school: "NYU",
    images: [profile1],
    interests: ["Travel", "Photography", "Music", "Hiking", "Coffee"],
  };

  const menuItems = [
    { icon: <Gem className="w-5 h-5" />, label: "Get Gems", chevron: true, action: () => navigate("/settings") },
    { icon: <Shield className="w-5 h-5" />, label: "Safety Center", chevron: true },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", chevron: true, action: () => navigate("/settings") },
    { icon: <Heart className="w-5 h-5" />, label: "Get Premium", highlight: true, action: () => navigate("/settings") },
    { icon: <LogOut className="w-5 h-5" />, label: "Log Out", danger: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Profile" showLogo={false} />

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Profile Card */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src={user.images[0]}
              alt={user.name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            {/* Edit Button */}
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center">
              <Camera className="w-5 h-5 text-foreground" />
            </button>

            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.name}, {user.age}
                  </h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                </div>
                <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
        {[
            { label: "Gems", value: gems.toString(), isGems: true },
            { label: "Matches", value: "12" },
            { label: "Likes", value: "24" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* About */}
        <motion.div
          className="glass rounded-2xl p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-foreground mb-3">About Me</h2>
          <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>
          
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

        {/* Interests */}
        <motion.div
          className="glass rounded-2xl p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-semibold text-foreground mb-3">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground"
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
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
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
            </button>
          ))}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;

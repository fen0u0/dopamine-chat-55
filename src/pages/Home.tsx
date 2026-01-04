import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import HomeContent from "@/components/HomeContent";
import GemsBadge from "@/components/GemsBadge";
import { profiles } from "@/data/profiles";

const Home = () => {
  const navigate = useNavigate();
  const [userMood, setUserMood] = useState<string | undefined>(undefined);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const savedMood = localStorage.getItem("userMood");
    if (savedMood) {
      setUserMood(savedMood);
    }
  }, [navigate]);

  const matchCount = userMood 
    ? profiles.filter(p => p.mood === userMood).length 
    : profiles.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="flex items-center justify-between px-4 py-3">
          <GemsBadge />

          <motion.button
            onClick={() => navigate("/")}
            className="text-2xl font-bold gradient-text tracking-tight"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            vibe~
          </motion.button>

          <motion.button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary/50 transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>

        <p className="text-xs text-muted-foreground text-center pb-2 tracking-wide">
          ✨ tap to connect
        </p>

        {userMood && (
          <div className="px-4 pb-3 flex justify-center">
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-sm">{userMood}</span>
              <span className="text-xs text-muted-foreground">· your vibe</span>
            </motion.div>
          </div>
        )}
      </header>

      <main className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Sparkles className="w-4 h-4 text-coral" />
          <span className="text-sm font-medium text-muted-foreground">
            {userMood ? "matching your vibe" : "vibing rn"}
          </span>
          <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground/60">
            <Users className="w-3 h-3" />
            <span>{matchCount}</span>
          </div>
        </div>

        <HomeContent userMood={userMood} />

        <motion.p 
          className="text-center text-xs text-muted-foreground/40 mt-12 tracking-wide"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          no faces, just vibes 🌙
        </motion.p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;

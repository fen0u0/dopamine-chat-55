import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Users } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ChaoticGrid from "@/components/ChaoticGrid";
import { profiles } from "@/data/profiles";

const Home = () => {
  const navigate = useNavigate();
  const [userMood, setUserMood] = useState<string | undefined>(undefined);

  // Check if user is logged in and get their mood
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Get user's mood from profile settings
    const savedMood = localStorage.getItem("userMood");
    if (savedMood) {
      setUserMood(savedMood);
    }
  }, [navigate]);

  // Count matches for current mood
  const matchCount = userMood 
    ? profiles.filter(p => p.mood === userMood).length 
    : profiles.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold gradient-text text-center tracking-tight">
            vibe~
          </h1>
          <p className="text-xs text-muted-foreground text-center mt-1 tracking-wide">
            tap to connect ✨
          </p>
        </div>

        {/* User's current mood indicator */}
        {userMood && (
          <div className="px-4 pb-3 flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm">{userMood}</span>
              <span className="text-xs text-muted-foreground">· your vibe</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-4 pt-6">
        {/* Section header */}
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

        {/* Chaotic Grid - filtered by user's mood */}
        <ChaoticGrid userMood={userMood} />

        {/* Decorative footer text */}
        <p className="text-center text-xs text-muted-foreground/40 mt-12 tracking-wide">
          no faces, just vibes 🌙
        </p>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;

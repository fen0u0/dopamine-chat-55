import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ChaoticGrid, { getUniqueMoods } from "@/components/ChaoticGrid";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState("all");
  const moods = getUniqueMoods();

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

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

        {/* Mood Filter Pills */}
        <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  selectedMood === mood
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {mood === "all" ? "✨ all vibes" : mood}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-6">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <Sparkles className="w-4 h-4 text-coral" />
          <span className="text-sm font-medium text-muted-foreground">
            {selectedMood === "all" ? "vibing rn" : selectedMood}
          </span>
        </div>

        {/* Chaotic Grid */}
        <ChaoticGrid selectedMood={selectedMood} />

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

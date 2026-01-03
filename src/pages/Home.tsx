import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ChaoticGrid from "@/components/ChaoticGrid";

const Home = () => {
  const navigate = useNavigate();

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
        <div className="px-6 py-5">
          <h1 className="text-3xl font-bold gradient-text text-center tracking-tight">
            vibe~
          </h1>
          <p className="text-xs text-muted-foreground text-center mt-1 tracking-wide">
            tap to connect ✨
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-8">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <Sparkles className="w-4 h-4 text-coral" />
          <span className="text-sm font-medium text-muted-foreground">
            vibing rn
          </span>
          <span className="text-xs text-muted-foreground/60 ml-auto">
            12 online
          </span>
        </div>

        {/* Chaotic Grid */}
        <ChaoticGrid />

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

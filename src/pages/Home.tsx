import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Sparkles, Gem, MapPin, Gift } from "lucide-react";
import FilterPill from "@/components/FilterPill";
import BottomNav from "@/components/BottomNav";
import ChaoticGrid from "@/components/ChaoticGrid";
import DailyRewardsModal from "@/components/DailyRewardsModal";

const filters = [
  { label: "All", icon: undefined },
  { label: "Hot", icon: Flame },
  { label: "New", icon: Sparkles },
  { label: "Premium", icon: Gem },
  { label: "Near", icon: MapPin },
];

const Home = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showRewards, setShowRewards] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold gradient-text text-center mb-1">
            vibe~
          </h1>
          <p className="text-xs text-muted-foreground text-center">
            find your people ✨
          </p>
        </div>

        {/* Daily Reward Banner */}
        <div className="mx-4 mb-3">
          <button 
            onClick={() => setShowRewards(true)}
            className="w-full bg-gradient-to-r from-coral/20 via-rose/20 to-primary/20 border border-coral/30 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-coral/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral to-rose flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-coral transition-colors">
              Claim Daily Reward!
            </span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <FilterPill
              key={filter.label}
              label={filter.label}
              icon={filter.icon}
              active={activeFilter === filter.label}
              onClick={() => setActiveFilter(filter.label)}
            />
          ))}
        </div>
      </header>

      {/* Main Content - Chaotic Grid */}
      <main className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-coral" />
          <h2 className="text-lg font-semibold text-foreground">
            vibing rn
          </h2>
        </div>

        <ChaoticGrid />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Daily Rewards Modal */}
      <DailyRewardsModal isOpen={showRewards} onClose={() => setShowRewards(false)} />
    </div>
  );
};

export default Home;

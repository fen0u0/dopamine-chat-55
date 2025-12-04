import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProfileBubble from "@/components/ProfileBubble";
import ProfileModal from "@/components/ProfileModal";
import MatchModal from "@/components/MatchModal";
import UnlockModal from "@/components/UnlockModal";
import SuperLikeModal from "@/components/SuperLikeModal";
import DailyRewardsModal from "@/components/DailyRewardsModal";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import GemsBadge from "@/components/GemsBadge";
import { profiles } from "@/data/profiles";
import { Profile } from "@/types/profile";
import { Sparkles, Shuffle, Filter, Zap, Gift, Rocket, Clock, SlidersHorizontal } from "lucide-react";
import { useGems } from "@/contexts/GemsContext";
import { toast } from "sonner";

const categories = [
  { id: "all", label: "all" },
  { id: "hot", label: "🔥 hot" },
  { id: "new", label: "✨ new" },
  { id: "premium", label: "💎 premium" },
  { id: "near", label: "🎯 near" },
];

const Discover = () => {
  const navigate = useNavigate();
  const { isProfileUnlocked, canClaimDaily, isBoostActive, boostEndTime } = useGems();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showSuperLikeModal, setShowSuperLikeModal] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  const boostTimeRemaining = isBoostActive
    ? Math.ceil((boostEndTime! - Date.now()) / 60000)
    : 0;

  // Filter profiles based on category
  const filteredProfiles = useMemo(() => {
    switch (activeCategory) {
      case "hot":
        return profiles.filter((p) => p.isOnline);
      case "new":
        return profiles.slice().reverse().slice(0, 6);
      case "premium":
        return profiles.filter((_, i) => i % 3 === 0);
      case "near":
        return profiles.filter((p) => parseInt(p.distance) <= 3);
      default:
        return profiles;
    }
  }, [activeCategory]);

  // Show daily rewards modal on first load if can claim
  useEffect(() => {
    const hasSeenToday = sessionStorage.getItem("dailyRewardsShown") === new Date().toDateString();
    if (canClaimDaily && !hasSeenToday) {
      setTimeout(() => {
        setShowDailyRewards(true);
        sessionStorage.setItem("dailyRewardsShown", new Date().toDateString());
      }, 1000);
    }
  }, [canClaimDaily]);

  // Determine which profiles are locked (every 3rd profile after first 2)
  const isLocked = (index: number) => index > 1 && index % 3 === 0;

  const handleProfileClick = (profile: Profile, index: number) => {
    setSelectedProfile(profile);
    
    if (isLocked(index) && !isProfileUnlocked(profile.id)) {
      setShowUnlockModal(true);
    } else {
      setShowProfileModal(true);
    }
  };

  const handleUnlockSuccess = () => {
    setShowUnlockModal(false);
    setShowProfileModal(true);
  };

  const handleLike = useCallback(() => {
    if (!selectedProfile) return;
    
    setLikedProfiles((prev) => [...prev, selectedProfile.id]);
    setShowProfileModal(false);
    
    // 40% chance of match
    if (Math.random() > 0.6) {
      setTimeout(() => {
        setMatchedProfile(selectedProfile);
        setShowMatch(true);
      }, 300);
    }
  }, [selectedProfile]);

  const handleSuperLike = useCallback(() => {
    if (!selectedProfile) return;
    setShowProfileModal(false);
    setShowSuperLikeModal(true);
  }, [selectedProfile]);

  const handleSuperLikeConfirm = () => {
    if (!selectedProfile) return;
    
    setLikedProfiles((prev) => [...prev, selectedProfile.id]);
    setShowSuperLikeModal(false);
    
    // 80% chance of match with super like!
    if (Math.random() > 0.2) {
      setTimeout(() => {
        setMatchedProfile(selectedProfile);
        setShowMatch(true);
      }, 300);
    }
  };

  const handleMessage = () => {
    if (selectedProfile) {
      setShowProfileModal(false);
      navigate("/chats");
    }
  };

  const handleShuffle = () => {
    setShuffleKey((prev) => prev + 1);
    toast.success("shuffled! let's gooo ✨");
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const category = categories.find((c) => c.id === categoryId);
    if (category && categoryId !== "all") {
      toast.info(`showing ${category.label} profiles`);
    }
  };

  const handleFilterClick = () => {
    toast.info("filters coming soon bestie!");
  };

  // Varied sizes for visual interest - bigger bubbles
  const getSizeForIndex = (index: number): "xs" | "sm" | "md" | "lg" | "xl" => {
    const pattern = ["lg", "xl", "md", "lg", "md", "xl", "lg", "md", "xl", "lg", "md", "lg"];
    return pattern[index % pattern.length] as "xs" | "sm" | "md" | "lg" | "xl";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Header Section */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
              <Zap className="w-6 h-6 text-primary" />
              discover
            </h1>
            <p className="text-sm text-muted-foreground font-mono">{filteredProfiles.length} ppl nearby</p>
          </div>
          
          <div className="flex items-center gap-2">
            <GemsBadge />
            <motion.button
              onClick={handleFilterClick}
              className="w-10 h-10 rounded-full glass flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SlidersHorizontal className="w-5 h-5 text-foreground" />
            </motion.button>
            <motion.button
              onClick={handleShuffle}
              className="w-10 h-10 rounded-full glass flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Shuffle className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Action Banners */}
        <motion.div
          className="flex gap-2 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {/* Daily Rewards Banner */}
          {canClaimDaily && (
            <motion.button
              onClick={() => setShowDailyRewards(true)}
              className="flex-1 glass rounded-2xl p-3 flex items-center gap-3 bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Gift className="w-6 h-6 text-accent" />
              <span className="text-sm font-bold text-foreground">claim daily reward!</span>
            </motion.button>
          )}

          {/* Boost Active Banner */}
          {isBoostActive && (
            <motion.div
              className="flex-1 glass rounded-2xl p-3 flex items-center gap-3 bg-gradient-to-r from-violet/20 to-electric/20 border border-violet/30"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Rocket className="w-6 h-6 text-violet" />
              </motion.div>
              <div className="flex-1">
                <span className="text-sm font-bold text-foreground">boost active 🚀</span>
                <div className="flex items-center gap-1 text-xs text-violet font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{boostTimeRemaining}m left</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Categories / Filters */}
        <motion.div 
          className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`pill whitespace-nowrap ${
                activeCategory === cat.id ? "active" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              featured today
            </h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {filteredProfiles.slice(0, 4).map((profile, index) => (
              <motion.div
                key={`featured-${profile.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <ProfileBubble
                  profile={profile}
                  onClick={() => handleProfileClick(profile, index)}
                  index={index}
                  size="xl"
                  isLocked={false}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Profiles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            explore
          </h2>
          
          <motion.div 
            key={`${shuffleKey}-${activeCategory}`}
            className="flex flex-wrap justify-center gap-4"
          >
            {filteredProfiles.map((profile, index) => (
              <ProfileBubble
                key={profile.id}
                profile={profile}
                onClick={() => handleProfileClick(profile, index)}
                index={index}
                size={getSizeForIndex(index)}
                isLocked={isLocked(index)}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-[50vh] text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full gradient-border flex items-center justify-center bg-card mb-4">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              no one nearby rn 💀
            </h2>
            <p className="text-muted-foreground">
              check back later bestie
            </p>
          </motion.div>
        )}
      </main>

      <BottomNav />

      {/* Daily Rewards Modal */}
      <DailyRewardsModal
        isOpen={showDailyRewards}
        onClose={() => setShowDailyRewards(false)}
      />

      {/* Unlock Modal */}
      <UnlockModal
        profile={selectedProfile}
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onUnlock={handleUnlockSuccess}
      />

      {/* Profile Modal */}
      <ProfileModal
        profile={selectedProfile}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLike={handleLike}
        onMessage={handleMessage}
        onSuperLike={handleSuperLike}
      />

      {/* Super Like Modal */}
      <SuperLikeModal
        profile={selectedProfile}
        isOpen={showSuperLikeModal}
        onClose={() => setShowSuperLikeModal(false)}
        onSuperLike={handleSuperLikeConfirm}
      />

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatch}
        onClose={() => setShowMatch(false)}
        profile={matchedProfile}
        onSendMessage={() => {
          setShowMatch(false);
          navigate("/chats");
        }}
      />
    </div>
  );
};

export default Discover;
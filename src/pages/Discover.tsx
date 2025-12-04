import { useState, useCallback, useEffect } from "react";
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
import { Sparkles, Shuffle, Filter, Flame, Gift, Rocket, Clock } from "lucide-react";
import { useGems } from "@/contexts/GemsContext";

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

  const boostTimeRemaining = isBoostActive
    ? Math.ceil((boostEndTime! - Date.now()) / 60000)
    : 0;

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
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Flame className="w-6 h-6 text-primary" />
              Discover
            </h1>
            <p className="text-sm text-muted-foreground">{profiles.length} people nearby</p>
          </div>
          
          <div className="flex items-center gap-2">
            <GemsBadge />
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
              className="flex-1 glass rounded-2xl p-3 flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Gift className="w-6 h-6 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Claim Daily Reward!</span>
            </motion.button>
          )}

          {/* Boost Active Banner */}
          {isBoostActive && (
            <motion.div
              className="flex-1 glass rounded-2xl p-3 flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Rocket className="w-6 h-6 text-blue-400" />
              </motion.div>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">Boost Active</span>
                <div className="flex items-center gap-1 text-xs text-blue-400">
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
          {["All", "🔥 Hot", "✨ New", "💎 Premium", "🎯 Near"].map((cat, i) => (
            <motion.button
              key={cat}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                i === 0 
                  ? "bg-primary text-primary-foreground" 
                  : "glass text-foreground hover:bg-primary/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
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
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Featured Today
            </h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {profiles.slice(0, 4).map((profile, index) => (
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
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            Explore
          </h2>
          
          <motion.div 
            key={shuffleKey}
            className="flex flex-wrap justify-center gap-4"
          >
            {profiles.map((profile, index) => (
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
        {profiles.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-[50vh] text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              No one nearby
            </h2>
            <p className="text-muted-foreground">
              Check back later for new people
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

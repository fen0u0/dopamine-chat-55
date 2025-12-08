import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Sparkles, Zap, Globe, Users } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ProfileBubble from "@/components/ProfileBubble";
import ProfileModal from "@/components/ProfileModal";
import MatchModal from "@/components/MatchModal";
import MoodMatchModal from "@/components/MoodMatchModal";
import { profiles, matches, moodOptions } from "@/data/profiles";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

const luckyPrompts = [
  "you will have an unexpectedly good conversation today",
  "someone is thinking about your last message rn",
  "a stranger will make you laugh today",
  "your next chat will hit different",
  "good vibes are on their way to you",
  "the universe wants you to text first",
  "plot twist incoming in your DMs",
  "your aura is immaculate today",
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMoodMatch, setShowMoodMatch] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [luckyMessage, setLuckyMessage] = useState<string | null>(null);

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const handleLike = () => {
    if (!selectedProfile) return;
    setShowProfileModal(false);
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setMatchedProfile(selectedProfile);
        setShowMatch(true);
      }, 300);
    }
  };

  const handleMoodMatch = (profile: Profile) => {
    navigate(`/chat/${profile.id}`);
  };

  const handleLuckyDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setLuckyMessage(null);
    
    setTimeout(() => {
      const randomPrompt = luckyPrompts[Math.floor(Math.random() * luckyPrompts.length)];
      setLuckyMessage(randomPrompt);
      setIsRolling(false);
      toast.success("🎲 fortune revealed!");
    }, 1000);
  };

  const quirkyFeatures = [
    { icon: "🎲", label: "lucky dice", desc: "test your fate", action: handleLuckyDice },
    { icon: "🔮", label: "vibe match", desc: "based on mood", action: () => setShowMoodMatch(true) },
    { icon: "💭", label: "confessions", desc: "spill the tea", action: () => navigate("/confessions") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {/* Minimalist Hero */}
        <motion.section
          className="py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.p 
            className="text-muted-foreground text-sm mb-2 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            👻 {profiles.filter(p => p.isOnline).length} strangers online
          </motion.p>
          <motion.h1 
            className="text-3xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            meet someone <span className="gradient-text">random</span>
          </motion.h1>
          
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setShowMoodMatch(true)}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              start vibing →
            </motion.button>
            <motion.button
              onClick={() => navigate("/confessions")}
              className="px-5 py-2.5 rounded-full glass text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              confessions 💭
            </motion.button>
          </motion.div>
        </motion.section>


        {/* Lucky Dice & Quirky Features */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Lucky Dice Result */}
          <AnimatePresence>
            {luckyMessage && (
              <motion.div
                className="glass rounded-2xl p-4 mb-4 text-center"
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <p className="text-sm text-foreground">🎲 {luckyMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-3">
            {quirkyFeatures.map((feature, index) => (
              <motion.button
                key={feature.label}
                className="glass rounded-2xl p-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={feature.action}
              >
                <motion.span 
                  className="text-2xl block mb-2"
                  animate={feature.label === "lucky dice" && isRolling ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
                >
                  {feature.icon}
                </motion.span>
                <p className="text-xs font-medium text-foreground">{feature.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Active Moods */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-foreground">current moods</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {moodOptions.slice(0, 8).map((mood, index) => (
              <motion.span
                key={mood}
                className="pill cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.03 }}
                whileHover={{ scale: 1.05 }}
              >
                {mood}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* Online Now */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">online rn</h2>
            </div>
            <span className="text-sm text-muted-foreground">{profiles.filter(p => p.isOnline).length} strangers</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {profiles.filter(p => p.isOnline).slice(0, 6).map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + index * 0.05 }}
              >
                <ProfileBubble
                  profile={profile}
                  onClick={() => handleProfileClick(profile)}
                  index={index}
                  size="lg"
                  isLocked={false}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Your Connections */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blush" />
              <h2 className="text-lg font-bold text-foreground">your people</h2>
            </div>
            <button 
              onClick={() => navigate("/chats")}
              className="text-sm text-primary font-medium"
            >
              see all →
            </button>
          </div>

          <div className="space-y-3">
            {matches.slice(0, 3).map((match, index) => (
              <motion.div
                key={match.id}
                className="glass rounded-2xl p-4 flex items-center gap-4 cursor-pointer card-hover"
                onClick={() => navigate(`/chat/${match.id}`)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="w-12 h-12 rounded-full gradient-border flex items-center justify-center bg-card">
                  <span className="text-lg">👻</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground font-mono text-sm">{match.name}</h3>
                    {match.isOnline && (
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                    {match.timezone && (
                      <span className="text-xs text-muted-foreground">{match.timezone}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {match.lastMessage}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{match.lastMessageTime}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Explore */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-coral" />
              <h2 className="text-lg font-bold text-foreground">explore strangers</h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {profiles.slice(0, 8).map((profile, index) => (
              <ProfileBubble
                key={profile.id}
                profile={profile}
                onClick={() => handleProfileClick(profile)}
                index={index}
                size={index % 3 === 0 ? "xl" : "lg"}
                isLocked={false}
              />
            ))}
          </div>
        </motion.section>
      </main>

      <BottomNav />

      <ProfileModal
        profile={selectedProfile}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLike={handleLike}
        onMessage={() => {
          setShowProfileModal(false);
          navigate("/chats");
        }}
        onSuperLike={handleLike}
      />

      <MatchModal
        isOpen={showMatch}
        onClose={() => setShowMatch(false)}
        profile={matchedProfile}
        onSendMessage={() => {
          setShowMatch(false);
          navigate("/chats");
        }}
      />

      <MoodMatchModal
        isOpen={showMoodMatch}
        onClose={() => setShowMoodMatch(false)}
        onMatch={handleMoodMatch}
      />
    </div>
  );
};

export default Index;

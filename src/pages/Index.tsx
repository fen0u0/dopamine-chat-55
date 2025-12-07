import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Sparkles, ArrowRight, Users, Zap, Globe, Shuffle, Ghost } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ProfileBubble from "@/components/ProfileBubble";
import ProfileModal from "@/components/ProfileModal";
import MatchModal from "@/components/MatchModal";
import MoodMatchModal from "@/components/MoodMatchModal";
import { profiles, matches, moodOptions } from "@/data/profiles";
import { Profile } from "@/types/profile";

const Index = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMoodMatch, setShowMoodMatch] = useState(false);

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

  const stats = [
    { icon: "🌍", label: "worldwide", value: "50+" },
    { icon: "👻", label: "anon users", value: "2.4k" },
    { icon: "✨", label: "vibing rn", value: "1.2k" },
  ];

  const quirkyFeatures = [
    { icon: "🎲", label: "random chat", desc: "meet a stranger", action: () => setShowMoodMatch(true) },
    { icon: "🔮", label: "vibe match", desc: "based on mood", action: () => setShowMoodMatch(true) },
    { icon: "💭", label: "confessions", desc: "spill the tea", action: () => navigate("/chats") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {/* Hero Section */}
        <motion.section
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Ghost className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">100% anonymous</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            meet strangers <span className="gradient-text">worldwide</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            no names, no pics, just vibes. connect with real humans across the globe. be anyone you want.
          </p>

          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => navigate("/chats")}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              start vibing
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 rounded-full glass font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shuffle className="w-4 h-4" />
              my alias
            </motion.button>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          className="grid grid-cols-3 gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="text-2xl mb-1 block">{stat.icon}</span>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.section>

        {/* Quirky Features */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-coral" />
            <h2 className="text-lg font-bold text-foreground">quirky stuff</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {quirkyFeatures.map((feature, index) => (
              <motion.button
                key={feature.label}
                className="glass rounded-2xl p-4 text-center card-hover"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={feature.action}
              >
                <span className="text-2xl block mb-2">{feature.icon}</span>
                <p className="text-sm font-bold text-foreground">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
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

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shuffle, MessageCircle, Globe, Zap, Ghost, Sparkles } from "lucide-react";
import { profiles, moodOptions } from "@/data/profiles";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

interface MoodMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatch: (profile: Profile) => void;
}

const MoodMatchModal = ({ isOpen, onClose, onMatch }: MoodMatchModalProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);

  const searchingPhrases = [
    "scanning the multiverse...",
    "finding your vibe twin...",
    "matching chaotic energies...",
    "summoning strangers...",
    "consulting the algorithm gods...",
    "locating fellow creatures...",
  ];
  const [currentPhrase, setCurrentPhrase] = useState(searchingPhrases[0]);

  useEffect(() => {
    if (isSearching) {
      const phraseInterval = setInterval(() => {
        setCurrentPhrase(searchingPhrases[Math.floor(Math.random() * searchingPhrases.length)]);
      }, 800);

      const progressInterval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            clearInterval(phraseInterval);
            
            // Find a match
            const matchedProfiles = profiles.filter(p => 
              p.mood === selectedMood || Math.random() > 0.3
            );
            const randomMatch = matchedProfiles[Math.floor(Math.random() * matchedProfiles.length)];
            setMatchedProfile(randomMatch);
            setIsSearching(false);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => {
        clearInterval(phraseInterval);
        clearInterval(progressInterval);
      };
    }
  }, [isSearching, selectedMood]);

  const handleStartSearch = () => {
    if (!selectedMood) {
      toast.error("pick a mood first bestie");
      return;
    }
    setIsSearching(true);
    setSearchProgress(0);
    setMatchedProfile(null);
  };

  const handleConnect = () => {
    if (matchedProfile) {
      onMatch(matchedProfile);
      onClose();
      toast.success(`connected with ${matchedProfile.name}! 🤝`);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setMatchedProfile(null);
    setSearchProgress(0);
  };

  const ghostEmojis = ["👻", "🌙", "✨", "🔮", "🌸", "💫", "🦋", "🌈"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-4 top-10 bottom-10 z-50 max-w-md mx-auto overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="glass rounded-3xl h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <button onClick={handleReset} className="text-muted-foreground font-semibold">
                  reset
                </button>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-primary" />
                  mood match
                </h2>
                <button onClick={onClose}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {!isSearching && !matchedProfile && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <motion.div
                          className="text-6xl mb-4"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🎲
                        </motion.div>
                        <h3 className="text-xl font-bold text-foreground mb-2">find your vibe twin</h3>
                        <p className="text-muted-foreground text-sm">
                          pick your current mood and we'll match you with a stranger who gets it
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">
                          what's the vibe rn?
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {moodOptions.map((mood) => (
                            <motion.button
                              key={mood}
                              onClick={() => setSelectedMood(mood)}
                              className={`pill ${selectedMood === mood ? 'active' : ''}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {mood}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <motion.button
                        onClick={handleStartSearch}
                        className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!selectedMood}
                      >
                        <Shuffle className="w-5 h-5" />
                        find my match
                      </motion.button>
                    </motion.div>
                  )}

                  {isSearching && (
                    <motion.div
                      key="searching"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full space-y-6"
                    >
                      <div className="relative">
                        <motion.div
                          className="w-32 h-32 rounded-full gradient-border flex items-center justify-center bg-card"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <motion.span
                            className="text-5xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          >
                            🔮
                          </motion.span>
                        </motion.div>
                        
                        {/* Orbiting ghosts */}
                        {ghostEmojis.slice(0, 4).map((emoji, i) => (
                          <motion.div
                            key={i}
                            className="absolute text-2xl"
                            style={{
                              top: '50%',
                              left: '50%',
                            }}
                            animate={{
                              x: [
                                Math.cos((i * Math.PI) / 2) * 60,
                                Math.cos((i * Math.PI) / 2 + Math.PI) * 60,
                                Math.cos((i * Math.PI) / 2) * 60,
                              ],
                              y: [
                                Math.sin((i * Math.PI) / 2) * 60,
                                Math.sin((i * Math.PI) / 2 + Math.PI) * 60,
                                Math.sin((i * Math.PI) / 2) * 60,
                              ],
                            }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                          >
                            {emoji}
                          </motion.div>
                        ))}
                      </div>

                      <div className="text-center">
                        <motion.p
                          key={currentPhrase}
                          className="text-foreground font-medium"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {currentPhrase}
                        </motion.p>
                        <p className="text-sm text-muted-foreground mt-2">{selectedMood}</p>
                      </div>

                      <div className="w-full max-w-xs">
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-coral"
                            style={{ width: `${searchProgress}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {matchedProfile && !isSearching && (
                    <motion.div
                      key="matched"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full space-y-6"
                    >
                      <motion.div
                        className="text-4xl"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        ✨
                      </motion.div>

                      <h3 className="text-2xl font-bold gradient-text">found one!</h3>

                      <motion.div
                        className="w-28 h-28 rounded-full gradient-border flex items-center justify-center bg-card"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-4xl">
                          {ghostEmojis[parseInt(matchedProfile.id) % ghostEmojis.length]}
                        </span>
                      </motion.div>

                      <div className="text-center">
                        <h4 className="text-xl font-bold text-foreground font-mono">{matchedProfile.name}</h4>
                        {matchedProfile.mood && (
                          <span className="pill active mt-2 inline-block">{matchedProfile.mood}</span>
                        )}
                        {matchedProfile.timezone && (
                          <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                            <Globe className="w-3 h-3" />
                            {matchedProfile.timezone}
                          </div>
                        )}
                      </div>

                      <p className="text-center text-muted-foreground text-sm max-w-xs">
                        {matchedProfile.bio}
                      </p>

                      {matchedProfile.interests && (
                        <div className="flex flex-wrap justify-center gap-2">
                          {matchedProfile.interests.slice(0, 4).map(interest => (
                            <span key={interest} className="pill text-xs">{interest}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 w-full max-w-xs">
                        <motion.button
                          onClick={handleReset}
                          className="flex-1 py-3 rounded-full glass font-semibold"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          try again
                        </motion.button>
                        <motion.button
                          onClick={handleConnect}
                          className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          connect
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoodMatchModal;

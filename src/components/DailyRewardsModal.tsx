import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Flame, Gift, Check, Star } from "lucide-react";
import { useGems } from "@/contexts/GemsContext";
import { soundManager } from "@/lib/sounds";
import Confetti from "./Confetti";
import { useState } from "react";

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STREAK_REWARDS = [5, 10, 15, 20, 30, 50, 100];

const DailyRewardsModal = ({ isOpen, onClose }: DailyRewardsModalProps) => {
  const { streak, claimDailyReward, canClaimDaily, lastClaimDate } = useGems();
  const [showConfetti, setShowConfetti] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const currentReward = STREAK_REWARDS[Math.min(streak, STREAK_REWARDS.length - 1)];
  const nextReward = STREAK_REWARDS[Math.min(streak + 1, STREAK_REWARDS.length - 1)];

  const handleClaim = () => {
    if (!canClaimDaily) return;
    
    setClaiming(true);
    setShowConfetti(true);
    soundManager.playStreak();
    
    setTimeout(() => {
      claimDailyReward();
      setClaiming(false);
      setTimeout(() => setShowConfetti(false), 2000);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="glass rounded-3xl p-6 relative overflow-hidden">
              <Confetti isActive={showConfetti} />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center z-10"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Gift className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Daily Rewards</h2>
                <p className="text-muted-foreground text-sm">Come back daily for bigger rewards!</p>
              </div>

              {/* Streak Display */}
              <div className="glass rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold text-foreground">Current Streak</span>
                  </div>
                  <span className="text-2xl font-bold gradient-text">{streak} days</span>
                </div>
                
                {/* Streak Progress */}
                <div className="flex gap-1">
                  {STREAK_REWARDS.map((reward, index) => (
                    <motion.div
                      key={index}
                      className={`flex-1 h-2 rounded-full ${
                        index < streak
                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                          : index === streak
                          ? "bg-primary/50"
                          : "bg-secondary"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                </div>
              </div>

              {/* Reward Tiers */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {STREAK_REWARDS.map((reward, index) => (
                  <motion.div
                    key={index}
                    className={`flex flex-col items-center p-1 rounded-xl ${
                      index < streak
                        ? "bg-green-500/20"
                        : index === streak
                        ? "bg-primary/20 ring-2 ring-primary"
                        : "bg-secondary/50"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <span className="text-[10px] text-muted-foreground">D{index + 1}</span>
                    {index < streak ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Gem className={`w-3 h-3 ${index === streak ? "text-primary" : "text-muted-foreground"}`} />
                    )}
                    <span className={`text-[10px] font-bold ${index === streak ? "text-primary" : "text-muted-foreground"}`}>
                      {reward}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Today's Reward */}
              <motion.div
                className="glass rounded-2xl p-4 mb-4 text-center"
                animate={canClaimDaily ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <p className="text-sm text-muted-foreground mb-2">Today's Reward</p>
                <div className="flex items-center justify-center gap-2">
                  <Gem className="w-8 h-8 text-purple-400" />
                  <span className="text-4xl font-bold gradient-text">{currentReward}</span>
                </div>
                {streak > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Tomorrow: <span className="text-primary font-semibold">{nextReward} gems</span>
                  </p>
                )}
              </motion.div>

              {/* Claim Button */}
              <motion.button
                onClick={handleClaim}
                disabled={!canClaimDaily || claiming}
                className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 ${
                  canClaimDaily
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
                whileHover={canClaimDaily ? { scale: 1.02 } : {}}
                whileTap={canClaimDaily ? { scale: 0.98 } : {}}
              >
                {claiming ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <Star className="w-5 h-5" />
                  </motion.div>
                ) : canClaimDaily ? (
                  <>
                    <Gift className="w-5 h-5" />
                    Claim {currentReward} Gems!
                  </>
                ) : (
                  "Come back tomorrow!"
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DailyRewardsModal;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Lock, Play, Sparkles } from "lucide-react";
import { Profile } from "@/types/profile";
import { useGems } from "@/contexts/GemsContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { soundManager } from "@/lib/sounds";
import Confetti from "./Confetti";

interface UnlockModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const UnlockModal = ({ profile, isOpen, onClose, onUnlock }: UnlockModalProps) => {
  const { gems, unlockProfile } = useGems();
  const navigate = useNavigate();
  const canAfford = gems >= 10;
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = () => {
    if (!profile) return;
    
    setUnlocking(true);
    setShowConfetti(true);
    soundManager.playUnlock();
    
    setTimeout(() => {
      if (unlockProfile(profile.id)) {
        toast.success(`${profile.name}'s profile unlocked! 💎`, {
          icon: "✨",
        });
        onUnlock();
      } else {
        toast.error("Not enough gems!");
      }
      setUnlocking(false);
      setShowConfetti(false);
    }, 800);
  };

  const handleGetGems = () => {
    onClose();
    navigate("/settings");
  };

  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="glass rounded-3xl p-6 relative overflow-hidden">
              <Confetti isActive={showConfetti} />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center z-10"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>

              {/* Profile Preview */}
              <div className="text-center mb-6">
                <motion.div 
                  className="relative w-24 h-24 mx-auto mb-4"
                  animate={unlocking ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-coral via-pink to-purple p-[3px]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-background">
                      <img
                        src={profile.images[0]}
                        alt={profile.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          unlocking ? "blur-none brightness-100" : "blur-md brightness-50"
                        }`}
                      />
                    </div>
                  </div>
                  {!unlocking && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <Lock className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                <h2 className="text-xl font-bold text-foreground mb-1">
                  {unlocking ? "Unlocking..." : "Unlock Profile"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {unlocking ? "Get ready to see who's waiting!" : "Spend gems to see this profile"}
                </p>
              </div>

              {/* Cost */}
              <motion.div 
                className="glass rounded-2xl p-4 mb-4 flex items-center justify-between"
                animate={unlocking ? { scale: [1, 0.95, 1] } : {}}
              >
                <span className="text-foreground font-medium">Cost</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={unlocking ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <Gem className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <span className="text-xl font-bold gradient-text">10</span>
                </div>
              </motion.div>

              {/* Balance */}
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Your balance: <span className="text-foreground font-semibold">{gems} gems</span>
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {canAfford ? (
                  <motion.button
                    onClick={handleUnlock}
                    disabled={unlocking}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {unlocking ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Unlock Now
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleGetGems}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-5 h-5" />
                    Get More Gems
                  </motion.button>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-secondary text-foreground font-medium"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UnlockModal;

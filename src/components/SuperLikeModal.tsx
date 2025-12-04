import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Star, Bell, Heart } from "lucide-react";
import { Profile } from "@/types/profile";
import { useGems } from "@/contexts/GemsContext";
import { soundManager } from "@/lib/sounds";
import Confetti from "./Confetti";
import { useState } from "react";
import { toast } from "sonner";

interface SuperLikeModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuperLike: () => void;
}

const SUPER_LIKE_COST = 5;

const SuperLikeModal = ({ profile, isOpen, onClose, onSuperLike }: SuperLikeModalProps) => {
  const { gems, spendGems } = useGems();
  const [showConfetti, setShowConfetti] = useState(false);
  const [sending, setSending] = useState(false);

  const canAfford = gems >= SUPER_LIKE_COST;

  const handleSuperLike = () => {
    if (!profile || !canAfford) return;

    setSending(true);
    setShowConfetti(true);
    soundManager.playSuperLike();

    setTimeout(() => {
      if (spendGems(SUPER_LIKE_COST)) {
        toast.success(`Super liked ${profile.name}! They'll be notified! 💙`, {
          icon: "⭐",
        });
        onSuperLike();
      }
      setSending(false);
      setShowConfetti(false);
    }, 1000);
  };

  if (!profile) return null;

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

              {/* Profile Preview */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 p-[3px]"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-background">
                      <img
                        src={profile.images[0]}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Star className="w-4 h-4 text-white" fill="white" />
                  </motion.div>
                </div>

                <h2 className="text-xl font-bold text-foreground mb-1">
                  Super Like {profile.name}?
                </h2>
                <p className="text-muted-foreground text-sm">
                  Stand out from the crowd!
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="glass rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Guaranteed Notification</p>
                    <p className="text-xs text-muted-foreground">{profile.name} will see your Super Like</p>
                  </div>
                </div>

                <div className="glass rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">3x More Likely to Match</p>
                    <p className="text-xs text-muted-foreground">Super Likes get noticed first</p>
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="glass rounded-2xl p-4 mb-4 flex items-center justify-between">
                <span className="text-foreground font-medium">Cost</span>
                <div className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-purple-400" />
                  <span className="text-xl font-bold gradient-text">{SUPER_LIKE_COST}</span>
                </div>
              </div>

              {/* Balance */}
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Your balance: <span className="text-foreground font-semibold">{gems} gems</span>
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleSuperLike}
                  disabled={!canAfford || sending}
                  className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 ${
                    canAfford
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                  whileHover={canAfford ? { scale: 1.02 } : {}}
                  whileTap={canAfford ? { scale: 0.98 } : {}}
                >
                  {sending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <Star className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Star className="w-5 h-5" fill="currentColor" />
                      {canAfford ? "Send Super Like" : "Not Enough Gems"}
                    </>
                  )}
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-secondary text-foreground font-medium"
                >
                  Regular Like Instead
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuperLikeModal;

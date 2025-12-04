import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Zap, Rocket, Clock, TrendingUp } from "lucide-react";
import { useGems } from "@/contexts/GemsContext";
import { soundManager } from "@/lib/sounds";
import Confetti from "./Confetti";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BOOST_OPTIONS = [
  { duration: 30, cost: 15, multiplier: "2x", label: "30 min" },
  { duration: 60, cost: 25, multiplier: "3x", label: "1 hour", popular: true },
  { duration: 180, cost: 50, multiplier: "5x", label: "3 hours" },
];

const ProfileBoostModal = ({ isOpen, onClose }: ProfileBoostModalProps) => {
  const { gems, activateBoost, boostEndTime } = useGems();
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedBoost, setSelectedBoost] = useState(1);

  const isBoostActive = boostEndTime && boostEndTime > Date.now();
  const remainingTime = isBoostActive
    ? Math.ceil((boostEndTime! - Date.now()) / 60000)
    : 0;

  const handleActivateBoost = () => {
    const boost = BOOST_OPTIONS[selectedBoost];
    if (gems < boost.cost) {
      toast.error("Not enough gems!");
      return;
    }

    setShowConfetti(true);
    soundManager.playBoost();
    activateBoost(boost.duration, boost.cost);
    toast.success(`Profile boosted for ${boost.label}! 🚀`);
    
    setTimeout(() => {
      setShowConfetti(false);
      onClose();
    }, 2000);
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
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Rocket className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Profile Boost</h2>
                <p className="text-muted-foreground text-sm">Get seen by more people!</p>
              </div>

              {/* Active Boost Status */}
              {isBoostActive && (
                <motion.div
                  className="glass rounded-2xl p-4 mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      >
                        <Zap className="w-5 h-5 text-blue-400" />
                      </motion.div>
                      <span className="font-semibold text-foreground">Boost Active!</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{remainingTime}m left</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stats Preview */}
              <div className="glass rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-semibold text-foreground">More Visibility</p>
                    <p className="text-xs text-muted-foreground">
                      Your profile will appear at the top of Discover
                    </p>
                  </div>
                </div>
              </div>

              {/* Boost Options */}
              <div className="space-y-3 mb-6">
                {BOOST_OPTIONS.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedBoost(index)}
                    className={`w-full glass rounded-2xl p-4 flex items-center justify-between relative ${
                      selectedBoost === index
                        ? "ring-2 ring-primary bg-primary/10"
                        : "hover:bg-secondary/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.popular && (
                      <span className="absolute -top-2 left-4 px-2 py-0.5 rounded-full bg-primary text-[10px] text-white font-semibold">
                        BEST VALUE
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedBoost === index
                          ? "bg-gradient-to-br from-blue-500 to-purple-600"
                          : "bg-secondary"
                      }`}>
                        <Zap className={`w-5 h-5 ${selectedBoost === index ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.multiplier} more views</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gem className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-foreground">{option.cost}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Balance & Action */}
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Your balance: <span className="text-foreground font-semibold">{gems} gems</span>
                </p>
              </div>

              <motion.button
                onClick={handleActivateBoost}
                disabled={gems < BOOST_OPTIONS[selectedBoost].cost || isBoostActive}
                className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 ${
                  gems >= BOOST_OPTIONS[selectedBoost].cost && !isBoostActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
                whileHover={gems >= BOOST_OPTIONS[selectedBoost].cost && !isBoostActive ? { scale: 1.02 } : {}}
                whileTap={gems >= BOOST_OPTIONS[selectedBoost].cost && !isBoostActive ? { scale: 0.98 } : {}}
              >
                <Rocket className="w-5 h-5" />
                {isBoostActive
                  ? "Boost Already Active"
                  : gems >= BOOST_OPTIONS[selectedBoost].cost
                  ? `Boost Now for ${BOOST_OPTIONS[selectedBoost].cost} Gems`
                  : "Not Enough Gems"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileBoostModal;

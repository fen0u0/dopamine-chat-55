import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Gem,
  Play,
  Zap,
  Crown,
  Sparkles,
  Gift,
  Star,
  Check,
  Rocket,
  Flame,
  Clock,
} from "lucide-react";
import { useGems } from "@/contexts/GemsContext";
import BottomNav from "@/components/BottomNav";
import DailyRewardsModal from "@/components/DailyRewardsModal";
import ProfileBoostModal from "@/components/ProfileBoostModal";
import { toast } from "sonner";
import { soundManager } from "@/lib/sounds";

const Settings = () => {
  const navigate = useNavigate();
  const { gems, addGems, streak, canClaimDaily, boostEndTime, isBoostActive } = useGems();
  const [watchingAd, setWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);

  const boostTimeRemaining = isBoostActive
    ? Math.ceil((boostEndTime! - Date.now()) / 60000)
    : 0;

  const gemPackages = [
    { gems: 50, price: "$0.99", popular: false, icon: <Gem className="w-6 h-6" /> },
    { gems: 150, price: "$2.99", popular: true, icon: <Star className="w-6 h-6" /> },
    { gems: 500, price: "$7.99", popular: false, icon: <Crown className="w-6 h-6" /> },
    { gems: 1200, price: "$14.99", popular: false, icon: <Zap className="w-6 h-6" /> },
  ];

  const handleWatchAd = () => {
    setWatchingAd(true);
    setAdProgress(0);
    
    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setWatchingAd(false);
          soundManager.playGemCollect();
          addGems(5);
          toast.success("You earned 5 gems! 💎");
          return 0;
        }
        return prev + 2;
      });
    }, 60);
  };

  const handleBuyGems = (amount: number, price: string) => {
    soundManager.playGemCollect();
    addGems(amount);
    toast.success(`You purchased ${amount} gems! 💎`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="flex items-center justify-between px-4 h-16 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Current Gems */}
        <motion.div
          className="glass rounded-3xl p-6 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Gem className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold gradient-text mb-1">{gems}</h2>
          <p className="text-muted-foreground">Your Gems Balance</p>
        </motion.div>

        {/* Quick Actions Row */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {/* Daily Rewards */}
          <motion.button
            onClick={() => setShowDailyRewards(true)}
            className="glass rounded-2xl p-4 text-left relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {canClaimDaily && (
              <motion.div
                className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-3">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground">Daily Rewards</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>{streak} day streak</span>
            </div>
          </motion.button>

          {/* Profile Boost */}
          <motion.button
            onClick={() => setShowBoostModal(true)}
            className="glass rounded-2xl p-4 text-left relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isBoostActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground">Profile Boost</h3>
            {isBoostActive ? (
              <div className="flex items-center gap-1 text-xs text-blue-400">
                <Clock className="w-3 h-3" />
                <span>{boostTimeRemaining}m remaining</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Get more views</p>
            )}
          </motion.button>
        </motion.div>

        {/* Watch Ads Section */}
        <motion.div
          className="glass rounded-3xl p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Watch Ads</h3>
              <p className="text-sm text-muted-foreground">Earn 5 gems per video</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {watchingAd ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${adProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Watching ad... {Math.floor(adProgress)}%
                </p>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                onClick={handleWatchAd}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Gift className="w-5 h-5" />
                Watch & Earn
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Buy Gems Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Buy Gems
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {gemPackages.map((pkg, index) => (
              <motion.button
                key={pkg.gems}
                onClick={() => handleBuyGems(pkg.gems, pkg.price)}
                className={`relative glass rounded-2xl p-4 text-center ${
                  pkg.popular ? "ring-2 ring-primary" : ""
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-[10px] text-white font-semibold">
                    POPULAR
                  </span>
                )}
                <div className="text-purple-400 mb-2 flex justify-center">{pkg.icon}</div>
                <p className="text-xl font-bold text-foreground">{pkg.gems}</p>
                <p className="text-sm text-muted-foreground mb-2">gems</p>
                <div className="py-2 rounded-xl bg-primary/20 text-primary font-semibold text-sm">
                  {pkg.price}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Premium Features */}
        <motion.div
          className="mt-6 glass rounded-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Premium</h3>
              <p className="text-sm text-muted-foreground">Unlock all profiles</p>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {[
              "Unlimited profile unlocks",
              "See who likes you",
              "No ads",
              "Priority matching",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>

          <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold">
            Upgrade to Premium - $9.99/mo
          </button>
        </motion.div>
      </main>

      <BottomNav />

      {/* Modals */}
      <DailyRewardsModal
        isOpen={showDailyRewards}
        onClose={() => setShowDailyRewards(false)}
      />
      <ProfileBoostModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
      />
    </div>
  );
};

export default Settings;

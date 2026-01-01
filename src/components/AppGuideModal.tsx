import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Ghost, Zap, Gem, MessageCircle, Shuffle, Gift, Rocket, Shield, Brain } from "lucide-react";

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: <Ghost className="w-5 h-5" />,
    title: "anonymous vibes",
    description: "chat with strangers using only aliases. no pics, no names, just pure chaos.",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "aura points",
    description: "your aura grows with every message you send. more texts = more aura ✨",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "energy bar",
    description: "energy increases when you open profiles. explore more strangers = more energy ⚡",
  },
  {
    icon: <Gem className="w-5 h-5" />,
    title: "gems",
    description: "earn gems by watching ads, daily rewards, or buy them. use for unlocks & boosts.",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "confessions",
    description: "drop anonymous confessions for everyone to see. pure unhinged energy.",
  },
  {
    icon: <Shuffle className="w-5 h-5" />,
    title: "mood match",
    description: "find strangers based on your current mood. chaotic matching at its finest.",
  },
  {
    icon: <Gift className="w-5 h-5" />,
    title: "daily rewards",
    description: "claim gems every day. keep your streak alive for bonus rewards!",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "profile boost",
    description: "boost your profile to get more visibility. costs gems but worth it.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "safety center",
    description: "block, report, or vanish. your safety = our priority.",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "unhinged settings",
    description: "chaotic mode, goblin hours, cryptid mode... for the chronically chaotic only.",
  },
];

const AppGuideModal = ({ isOpen, onClose }: AppGuideModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-4 top-10 bottom-10 z-50 max-w-md mx-auto overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="glass rounded-3xl h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  app guide
                </h2>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  here's everything you need to know about vibe~ 👻
                </p>

                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="glass rounded-2xl p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <p className="text-xs text-center text-muted-foreground pt-4">
                  now go be chaotic 🌀
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppGuideModal;

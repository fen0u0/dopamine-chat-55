import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, X } from "lucide-react";
import { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onSendMessage: () => void;
}

const MatchModal = ({ isOpen, onClose, profile, onSendMessage }: MatchModalProps) => {
  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hearts Animation */}
            <div className="relative mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Heart className="w-20 h-20 text-primary" fill="currentColor" />
              </motion.div>
              <motion.div
                className="absolute -top-4 -left-4"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: -30 }}
                transition={{ delay: 0.4 }}
              >
                <Heart className="w-8 h-8 text-coral" fill="currentColor" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-6"
                initial={{ scale: 0, rotate: 20 }}
                animate={{ scale: 1, rotate: 20 }}
                transition={{ delay: 0.5 }}
              >
                <Heart className="w-10 h-10 text-pink" fill="currentColor" />
              </motion.div>
            </div>

            {/* Title */}
            <motion.h1
              className="text-4xl font-bold gradient-text mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              It's a Match!
            </motion.h1>

            <motion.p
              className="text-muted-foreground mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              You and {profile.name} liked each other
            </motion.p>

            {/* Profile Images */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary gradient-border">
                <img
                  src={profile.images[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col gap-3 w-full max-w-xs"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={onSendMessage}
                className="w-full bg-gradient-to-r from-coral to-pink hover:opacity-90 text-foreground font-semibold py-6"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-muted-foreground"
              >
                Keep Swiping
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchModal;

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Star, Sparkles } from "lucide-react";
import { Profile } from "@/types/profile";

interface ProfileModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onMessage: () => void;
  onSuperLike: () => void;
}

const ProfileModal = ({ profile, isOpen, onClose, onLike, onMessage, onSuperLike }: ProfileModalProps) => {
  if (!profile) return null;

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-lg bg-card rounded-t-3xl overflow-hidden border-t border-border"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted rounded-full" />
            </div>

            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pb-8">
              <div className="flex flex-col items-center mb-6">
                <motion.div 
                  className="w-24 h-24 rounded-full gradient-border flex items-center justify-center bg-card mb-4"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-3xl font-bold gradient-text">{getInitials(profile.name)}</span>
                </motion.div>

                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-foreground">{profile.name}, {profile.age}</h2>
                  {profile.isOnline && <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                </div>

                {profile.verified && (
                  <div className="flex items-center gap-1 text-primary text-sm mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>verified</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-foreground/80 text-center">{profile.bio}</p>
              </div>

              <div className="mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  {profile.interests.map((interest) => (
                    <span key={interest} className="pill">{interest}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <motion.button onClick={onClose} className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </motion.button>
                <motion.button onClick={onSuperLike} className="w-12 h-12 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Star className="w-5 h-5 text-gold" />
                </motion.button>
                <motion.button onClick={onLike} className="w-16 h-16 rounded-full bg-primary flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Heart className="w-7 h-7 text-primary-foreground" />
                </motion.button>
                <motion.button onClick={onMessage} className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <MessageCircle className="w-6 h-6 text-foreground" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
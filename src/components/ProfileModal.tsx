import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Star, Gem } from "lucide-react";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onMessage: () => void;
  onSuperLike?: () => void;
}

const ProfileModal = ({ profile, isOpen, onClose, onLike, onMessage, onSuperLike }: ProfileModalProps) => {
  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.8, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, y: "-40%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="glass rounded-3xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass flex items-center justify-center"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>

              {/* Profile Image */}
              <div className="relative h-72">
                <img
                  src={profile.images[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                {/* Name overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    {profile.name}, {profile.age}
                    {profile.isOnline && (
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">{profile.bio}</p>

                {/* Interests */}
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <motion.button
                    onClick={onLike}
                    className={cn(
                      "flex-1 py-3 rounded-2xl font-semibold",
                      "bg-gradient-to-r from-coral to-pink text-foreground",
                      "flex items-center justify-center gap-2"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart className="w-5 h-5" />
                    Like
                  </motion.button>

                  {onSuperLike && (
                    <motion.button
                      onClick={onSuperLike}
                      className={cn(
                        "py-3 px-4 rounded-2xl font-semibold",
                        "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
                        "flex items-center justify-center gap-1 relative"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Star className="w-5 h-5" fill="currentColor" />
                      <span className="text-xs flex items-center gap-0.5">
                        <Gem className="w-3 h-3" />5
                      </span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={onMessage}
                    className={cn(
                      "flex-1 py-3 rounded-2xl font-semibold",
                      "glass text-foreground",
                      "flex items-center justify-center gap-2"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Wave
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;

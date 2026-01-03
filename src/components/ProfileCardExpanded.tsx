import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Heart, Sparkles } from "lucide-react";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ProfileCardExpandedProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onMessage: () => void;
  onLike: () => void;
}

const colorClasses = {
  1: "from-rose to-coral",
  2: "from-coral to-peach",
  3: "from-peach to-accent",
  4: "from-accent to-primary",
  5: "from-primary to-rose",
};

const ProfileCardExpanded = ({
  profile,
  isOpen,
  onClose,
  onMessage,
  onLike,
}: ProfileCardExpandedProps) => {
  if (!profile) return null;

  const getInitials = (name: string) =>
    name.split("_").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const colorIndex = ((parseInt(profile.id) % 5) + 1) as 1 | 2 | 3 | 4 | 5;

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

          {/* Card */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.8, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, y: "-40%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-2xl">
              {/* Header with avatar */}
              <div className={cn(
                "h-32 bg-gradient-to-br relative",
                colorClasses[colorIndex]
              )}>
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-background/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Avatar */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <div className={cn(
                    "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl font-bold text-background border-4 border-card shadow-lg",
                    colorClasses[colorIndex]
                  )}>
                    {getInitials(profile.name)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-14 pb-6 px-6">
                {/* Name & status */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    {profile.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      profile.isOnline ? "bg-green-500" : "bg-muted-foreground/50"
                    )} />
                    <span className="text-xs text-muted-foreground">
                      {profile.isOnline ? "vibing rn" : "offline"}
                    </span>
                  </div>
                </div>

                {/* Mood & vibe */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {profile.mood && (
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {profile.mood}
                    </span>
                  )}
                  {profile.vibe && (
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      {profile.vibe}
                    </span>
                  )}
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
                  {profile.bio}
                </p>

                {/* Interests */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                    >
                      #{interest}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onMessage}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    say hi
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLike}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-coral to-rose text-white text-sm font-medium"
                  >
                    <Heart className="w-4 h-4" />
                    vibe
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

export default ProfileCardExpanded;

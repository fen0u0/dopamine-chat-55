import { motion } from "framer-motion";
import { Profile } from "@/types/profile";
import { MessageCircle, Heart, Sparkles } from "lucide-react";

interface ProfileHoverCardProps {
  profile: Profile;
}

const ProfileHoverCard = ({ profile }: ProfileHoverCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-48"
    >
      <div className="glass rounded-2xl p-3 border border-primary/20 shadow-xl">
        {/* Mood & Vibe */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{profile.mood?.split(' ')[0] || '✨'}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
            <p className="text-[10px] text-muted-foreground">{profile.vibe}</p>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-3">
          {profile.bio}
        </p>

        {/* Quick stats */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>{profile.interests?.slice(0, 2).join(', ')}</span>
          </div>
          {profile.isOnline && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              online
            </span>
          )}
        </div>

        {/* Action hint */}
        <div className="flex items-center justify-center gap-3 mt-3 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
            <MessageCircle className="w-3 h-3" />
            <span>tap to view</span>
          </div>
        </div>
      </div>

      {/* Arrow pointing down */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 glass border-r border-b border-primary/20" />
    </motion.div>
  );
};

export default ProfileHoverCard;

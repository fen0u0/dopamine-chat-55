import { motion } from "framer-motion";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  profile: Profile;
  onClick: () => void;
  index: number;
}

const ChatListItem = ({ profile, onClick, index }: ChatListItemProps) => {
  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <motion.button
      className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-all rounded-xl group"
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full gradient-border flex items-center justify-center bg-card group-hover:scale-105 transition-transform">
          <span className="text-lg font-bold gradient-text">
            {getInitials(profile.name)}
          </span>
        </div>
        {profile.isOnline && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background animate-pulse" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground truncate tracking-tight">{profile.name}</h3>
          <span className="text-xs text-muted-foreground font-mono">{profile.lastMessageTime}</span>
        </div>
        <p
          className={cn(
            "text-sm truncate",
            profile.unreadCount && profile.unreadCount > 0
              ? "text-foreground font-semibold"
              : "text-muted-foreground"
          )}
        >
          {profile.lastMessage}
        </p>
      </div>

      {/* Unread Badge */}
      {profile.unreadCount && profile.unreadCount > 0 && (
        <motion.div 
          className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-xs font-bold text-primary-foreground">
            {profile.unreadCount}
          </span>
        </motion.div>
      )}
    </motion.button>
  );
};

export default ChatListItem;
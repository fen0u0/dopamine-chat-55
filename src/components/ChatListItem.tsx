import { motion } from "framer-motion";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  profile: Profile;
  onClick: () => void;
  index: number;
}

const ChatListItem = ({ profile, onClick, index }: ChatListItemProps) => {
  return (
    <motion.button
      className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors rounded-xl"
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <img
            src={profile.images[0]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        {profile.isOnline && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground truncate">{profile.name}</h3>
          <span className="text-xs text-muted-foreground">{profile.lastMessageTime}</span>
        </div>
        <p
          className={cn(
            "text-sm truncate",
            profile.unreadCount && profile.unreadCount > 0
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          )}
        >
          {profile.lastMessage}
        </p>
      </div>

      {/* Unread Badge */}
      {profile.unreadCount && profile.unreadCount > 0 && (
        <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-primary-foreground">
            {profile.unreadCount}
          </span>
        </div>
      )}
    </motion.button>
  );
};

export default ChatListItem;

import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ProfileBubbleProps {
  profile: Profile;
  onClick: () => void;
  index: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLocked?: boolean;
}

const sizeClasses = {
  xs: "w-12 h-12 text-sm",
  sm: "w-14 h-14 text-base",
  md: "w-16 h-16 text-lg",
  lg: "w-20 h-20 text-xl",
  xl: "w-24 h-24 text-2xl",
};

const ProfileBubble = ({ 
  profile, 
  onClick, 
  index, 
  size = "md",
  isLocked = false 
}: ProfileBubbleProps) => {
  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 group"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <div 
          className={cn(
            "rounded-full flex items-center justify-center font-bold transition-all duration-300",
            sizeClasses[size],
            isLocked 
              ? "bg-secondary border-2 border-foreground/10" 
              : "gradient-border bg-card"
          )}
        >
          {isLocked ? (
            <Lock className="w-1/3 h-1/3 text-muted-foreground" />
          ) : (
            <span className={cn(
              "gradient-text font-bold",
              size === "xl" && "text-2xl",
              size === "lg" && "text-xl",
              size === "md" && "text-lg",
            )}>
              {getInitials(profile.name)}
            </span>
          )}
        </div>

        {profile.isOnline && !isLocked && (
          <motion.div 
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {profile.verified && !isLocked && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="text-center">
        <p className={cn(
          "font-medium text-foreground leading-tight",
          size === "xl" || size === "lg" ? "text-sm" : "text-xs"
        )}>
          {isLocked ? "???" : profile.name}
        </p>
        {(size === "xl" || size === "lg") && !isLocked && (
          <p className="text-xs text-muted-foreground">{profile.age}</p>
        )}
      </div>
    </motion.button>
  );
};

export default ProfileBubble;
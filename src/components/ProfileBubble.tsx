import { motion } from "framer-motion";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { Lock, Gem } from "lucide-react";
import { useGems } from "@/contexts/GemsContext";

interface ProfileBubbleProps {
  profile: Profile;
  onClick: () => void;
  index: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLocked?: boolean;
}

const ProfileBubble = ({ profile, onClick, index, size = "md", isLocked = false }: ProfileBubbleProps) => {
  const { isProfileUnlocked } = useGems();
  const unlocked = isProfileUnlocked(profile.id);
  const showLock = isLocked && !unlocked;

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  const sizeClasses = {
    xs: "w-16 h-16",
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
    xl: "w-44 h-44",
  };

  const textSizeClasses = {
    xs: "text-lg",
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const nameSizeClasses = {
    xs: "text-[9px]",
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base",
  };

  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.04, 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={cn(
        "relative rounded-full overflow-hidden",
        sizeClasses[size],
        "transition-all duration-300",
        "group-hover:shadow-neon"
      )}>
        {/* Gradient ring */}
        <div className="absolute inset-0 rounded-full gradient-border">
          <div className={cn(
            "w-full h-full rounded-full bg-card flex items-center justify-center relative",
            showLock && "opacity-50"
          )}>
            {/* Text Avatar */}
            <span className={cn(
              "font-extrabold gradient-text",
              textSizeClasses[size]
            )}>
              {showLock ? "??" : getInitials(profile.name)}
            </span>
            
            {/* Lock Overlay */}
            {showLock && (
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Lock className={cn(
                  "text-foreground mb-1",
                  size === "xl" || size === "lg" ? "w-8 h-8" : "w-5 h-5"
                )} />
                <div className="flex items-center gap-0.5">
                  <Gem className={cn(
                    "text-violet",
                    size === "xl" || size === "lg" ? "w-4 h-4" : "w-3 h-3"
                  )} />
                  <span className={cn(
                    "text-foreground font-bold",
                    size === "xl" || size === "lg" ? "text-sm" : "text-xs"
                  )}>10</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Online indicator */}
        {profile.isOnline && !showLock && (
          <motion.div 
            className={cn(
              "absolute rounded-full bg-primary border-2 border-background",
              size === "xl" || size === "lg" ? "bottom-2 right-2 w-4 h-4" : "bottom-1 right-1 w-3 h-3"
            )}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}

        {/* Verified badge for large profiles */}
        {(size === "xl" || size === "lg") && profile.verified && !showLock && (
          <motion.div 
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-[10px] text-primary-foreground">✓</span>
          </motion.div>
        )}
      </div>
      
      <div className="text-center">
        <p className={cn(
          "font-bold text-foreground truncate tracking-tight",
          nameSizeClasses[size],
          size === "xl" ? "max-w-[160px]" : size === "lg" ? "max-w-[130px]" : "max-w-[80px]"
        )}>
          {showLock ? "???" : `${profile.name}, ${profile.age}`}
        </p>
        {(size === "xl" || size === "lg") && !showLock && (
          <p className="text-[10px] text-muted-foreground truncate max-w-[100px] font-mono">
            {profile.distance}
          </p>
        )}
      </div>
    </motion.button>
  );
};

export default ProfileBubble;
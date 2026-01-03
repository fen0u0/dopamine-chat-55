import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { profiles } from "@/data/profiles";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import ProfileCardExpanded from "./ProfileCardExpanded";
import MoodParticles from "./MoodParticles";
import { 
  Ghost, Cat, Sparkles, Moon, Flame, BookOpen, Theater, Gamepad2, 
  Music, Cloud, Skull, Tornado, Coffee, Flower2, Bug, Zap
} from "lucide-react";

// Map profile names to icons for variety
const profileIcons: Record<string, React.ElementType> = {
  "cosmic_cat": Cat,
  "sleepy_panda": Moon,
  "chaotic_bean": Flame,
  "midnight_owl": Moon,
  "fuzzy_potato": Coffee,
  "vibing_cactus": Zap,
  "lost_sock": Ghost,
  "spicy_noodle": Flame,
  "lazy_cloud": Cloud,
  "pixel_ghost": Ghost,
  "chaos_gremlin": Bug,
  "cozy_burrito": Coffee,
};

const colorClasses = {
  1: "border-rose text-rose",
  2: "border-coral text-coral",
  3: "border-peach text-peach",
  4: "border-accent text-accent",
  5: "border-primary text-primary",
};

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-24 h-24",
};

const iconSizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

// Grid layout
const gridPositions = [
  { size: "lg" as const },
  { size: "sm" as const },
  { size: "md" as const },
  { size: "sm" as const },
  { size: "lg" as const },
  { size: "sm" as const },
  { size: "md" as const },
  { size: "sm" as const },
  { size: "lg" as const },
  { size: "sm" as const },
  { size: "md" as const },
  { size: "sm" as const },
];

interface ChaoticGridProps {
  userMood?: string;
}

const ChaoticGrid = ({ userMood }: ChaoticGridProps) => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Filter profiles that match the user's mood (or show all if no mood set)
  const filteredProfiles = userMood 
    ? profiles.filter(p => p.mood === userMood)
    : profiles;

  // If no matches, show all profiles
  const displayProfiles = filteredProfiles.length > 0 ? filteredProfiles : profiles;

  const handleAvatarClick = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleMessage = () => {
    if (selectedProfile) {
      navigate(`/chat/${selectedProfile.id}`);
    }
  };

  const handleLike = () => {
    setSelectedProfile(null);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6 px-2">
        <AnimatePresence mode="popLayout">
          {displayProfiles.slice(0, 12).map((profile, index) => {
            const pos = gridPositions[index % gridPositions.length];
            const colorIndex = ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5;
            const IconComponent = profileIcons[profile.name] || Ghost;
            
            return (
              <motion.div
                key={profile.id}
                layout
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                {/* Avatar with ring and particles */}
                <div className="relative">
                  <motion.button
                    onClick={() => handleAvatarClick(profile)}
                    className={cn(
                      "rounded-full flex items-center justify-center bg-background border-2 cursor-pointer relative z-10",
                      sizeClasses[pos.size],
                      colorClasses[colorIndex]
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      y: {
                        duration: 2 + (index % 3) * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <IconComponent className={cn(iconSizes[pos.size], "opacity-80")} />
                    
                    {/* Online indicator */}
                    {profile.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background z-20" />
                    )}
                  </motion.button>

                  {/* Mood Particles */}
                  <MoodParticles mood={profile.mood} />
                </div>

                {/* Username */}
                <span className="text-xs text-muted-foreground font-medium truncate max-w-full">
                  {profile.name}
                </span>

                {/* Mood badge */}
                {profile.mood && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                    {profile.mood.replace(/^[^\s]+\s/, '')}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredProfiles.length === 0 && userMood && (
        <div className="text-center py-8">
          <Ghost className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">no one else vibing like you rn</p>
          <p className="text-xs text-muted-foreground/60 mt-1">showing everyone instead ✨</p>
        </div>
      )}

      {/* Expanded Profile Card */}
      <ProfileCardExpanded
        profile={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onMessage={handleMessage}
        onLike={handleLike}
      />
    </>
  );
};

export default ChaoticGrid;

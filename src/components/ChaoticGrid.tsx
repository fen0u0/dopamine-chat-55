import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { profiles } from "@/data/profiles";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import ProfileCardExpanded from "./ProfileCardExpanded";

const sizeClasses = {
  sm: "w-12 h-12 text-xs",
  md: "w-16 h-16 text-sm",
  lg: "w-20 h-20 text-base",
};

const colorClasses = {
  1: "bg-rose",
  2: "bg-coral",
  3: "bg-peach",
  4: "bg-accent",
  5: "bg-primary",
};

// Grid-based layout for organized chaos
const gridPositions = [
  { row: 0, col: 0, size: "lg" as const },
  { row: 0, col: 1, size: "sm" as const },
  { row: 0, col: 2, size: "md" as const },
  { row: 1, col: 0, size: "sm" as const },
  { row: 1, col: 1, size: "lg" as const },
  { row: 1, col: 2, size: "sm" as const },
  { row: 2, col: 0, size: "md" as const },
  { row: 2, col: 1, size: "sm" as const },
  { row: 2, col: 2, size: "lg" as const },
  { row: 3, col: 0, size: "sm" as const },
  { row: 3, col: 1, size: "md" as const },
  { row: 3, col: 2, size: "sm" as const },
];

const ChaoticGrid = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const getInitials = (name: string) =>
    name.split("_").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
    // Could add toast or animation here
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 px-2">
        {profiles.slice(0, 12).map((profile, index) => {
          const pos = gridPositions[index];
          const colorIndex = ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5;
          
          return (
            <motion.div
              key={profile.id}
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.button
                onClick={() => handleAvatarClick(profile)}
                className={cn(
                  "rounded-full flex items-center justify-center font-outfit font-semibold text-background shadow-lg cursor-pointer relative",
                  sizeClasses[pos.size],
                  colorClasses[colorIndex]
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  y: {
                    duration: 2 + (index % 3) * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                {getInitials(profile.name)}
                
                {/* Online indicator */}
                {profile.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

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

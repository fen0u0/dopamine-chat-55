import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, Info } from "lucide-react";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  isTop?: boolean;
}

const ProfileCard = ({ profile, onSwipe, isTop = false }: ProfileCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onSwipe("right");
    } else if (info.offset.x < -100 || info.velocity.x < -500) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className={cn(
        "swipe-card cursor-grab active:cursor-grabbing",
        "top-0 h-[70vh] max-h-[600px]"
      )}
      style={{ x, rotate, opacity }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 20 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={profile.images[0]}
          alt={profile.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Like/Nope Indicators */}
      {isTop && (
        <>
          <motion.div
            className="absolute top-8 left-6 px-4 py-2 rounded-lg border-4 border-green-500 rotate-[-20deg]"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-2xl font-bold text-green-500">LIKE</span>
          </motion.div>
          <motion.div
            className="absolute top-8 right-6 px-4 py-2 rounded-lg border-4 border-red-500 rotate-[20deg]"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-2xl font-bold text-red-500">NOPE</span>
          </motion.div>
        </>
      )}

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {profile.name}, {profile.age}
            </h2>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{profile.distance}</span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <Info className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>

        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 rounded-full text-xs font-medium glass text-foreground"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;

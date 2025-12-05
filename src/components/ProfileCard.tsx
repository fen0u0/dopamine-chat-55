import { motion, useMotionValue, useTransform } from "framer-motion";
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

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <motion.div
      className={cn(
        "swipe-card cursor-grab active:cursor-grabbing card-hover",
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
      <div className="absolute inset-0 bg-gradient-to-br from-card via-secondary to-card">
        <div className="absolute inset-0 opacity-30" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(var(--rose) / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, hsl(var(--coral) / 0.3) 0%, transparent 50%)'
          }} 
        />
      </div>

      {isTop && (
        <>
          <motion.div
            className="absolute top-8 left-6 px-5 py-2 rounded-xl border-4 border-primary rotate-[-20deg] bg-background/50 backdrop-blur-sm"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-2xl font-bold text-primary">LIKE 💕</span>
          </motion.div>
          <motion.div
            className="absolute top-8 right-6 px-5 py-2 rounded-xl border-4 border-destructive rotate-[20deg] bg-background/50 backdrop-blur-sm"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-2xl font-bold text-destructive">NOPE</span>
          </motion.div>
        </>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <motion.div 
          className="w-32 h-32 rounded-full gradient-border flex items-center justify-center bg-card mb-6"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-5xl font-bold gradient-text">
            {getInitials(profile.name)}
          </span>
        </motion.div>

        <h2 className="text-4xl font-bold text-foreground mb-2">
          {profile.name}
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          {profile.age}
        </p>

        <p className="text-center text-foreground/80 text-lg mb-6 max-w-xs">
          {profile.bio}
        </p>

        <div className="flex flex-wrap gap-2 justify-center">
          {profile.interests.slice(0, 4).map((interest) => (
            <span key={interest} className="pill">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
    </motion.div>
  );
};

export default ProfileCard;
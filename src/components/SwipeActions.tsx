import { motion } from "framer-motion";
import { X, Heart, Star, RotateCcw, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeActionsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRewind?: () => void;
  canRewind?: boolean;
}

const SwipeActions = ({
  onPass,
  onLike,
  onSuperLike,
  onRewind,
  canRewind = false,
}: SwipeActionsProps) => {
  const buttonVariants = {
    tap: { scale: 0.9 },
    hover: { scale: 1.1 },
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Rewind Button */}
      <motion.button
        className={cn(
          "action-button bg-secondary border border-border",
          !canRewind && "opacity-30 cursor-not-allowed"
        )}
        variants={buttonVariants}
        whileTap={canRewind ? "tap" : undefined}
        whileHover={canRewind ? "hover" : undefined}
        onClick={canRewind ? onRewind : undefined}
        disabled={!canRewind}
      >
        <RotateCcw className="w-6 h-6 text-accent" />
      </motion.button>

      {/* Pass Button */}
      <motion.button
        className="action-button w-16 h-16 bg-secondary border border-destructive/30"
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={onPass}
      >
        <X className="w-8 h-8 text-destructive" />
      </motion.button>

      {/* Super Like Button */}
      <motion.button
        className="action-button bg-secondary border border-blue-500/30 relative"
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={onSuperLike}
      >
        <Star className="w-6 h-6 text-blue-500" />
        {/* Gem cost badge */}
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <span className="text-[10px] font-bold text-white">5</span>
        </motion.div>
      </motion.button>

      {/* Like Button */}
      <motion.button
        className="action-button w-16 h-16 bg-gradient-to-br from-coral to-pink animate-pulse-glow"
        variants={buttonVariants}
        whileTap="tap"
        whileHover="hover"
        onClick={onLike}
      >
        <Heart className="w-8 h-8 text-foreground" fill="currentColor" />
      </motion.button>
    </div>
  );
};

export default SwipeActions;

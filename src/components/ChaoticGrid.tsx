import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FloatingAvatar from "./FloatingAvatar";
import { profiles } from "@/data/profiles";

interface GridItem {
  id: string;
  name: string;
  colorIndex: 1 | 2 | 3 | 4 | 5;
  size: "sm" | "md" | "lg";
  position: { top: string; left: string };
  delay: number;
}

const ChaoticGrid = () => {
  const navigate = useNavigate();

  // Generate chaotic positions for profiles
  const gridItems: GridItem[] = profiles.slice(0, 12).map((profile, index) => ({
    id: profile.id,
    name: profile.name,
    colorIndex: ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5,
    size: index % 3 === 0 ? "lg" : index % 2 === 0 ? "md" : "sm",
    position: {
      top: `${Math.floor(index / 3) * 25 + Math.random() * 10}%`,
      left: `${(index % 3) * 30 + Math.random() * 15 + 5}%`,
    },
    delay: index * 0.1,
  }));

  return (
    <div className="relative min-h-[500px]">
      {gridItems.map((item, index) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            top: item.position.top,
            left: item.position.left,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: item.delay,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          <FloatingAvatar
            name={item.name}
            colorIndex={item.colorIndex}
            size={item.size}
            onClick={() => navigate(`/chat/${item.id}`)}
            animationClass={index % 2 === 0 ? "animate-float" : "animate-bounce-subtle"}
          />
        </motion.div>
      ))}

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/4 right-8 w-3 h-3 rounded-full bg-primary/30"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full bg-accent/40"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-coral/20"
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
};

export default ChaoticGrid;

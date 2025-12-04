import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
}

const colors = [
  "hsl(340, 85%, 60%)", // pink
  "hsl(270, 70%, 55%)", // purple
  "hsl(15, 85%, 60%)", // coral
  "hsl(45, 100%, 60%)", // gold
  "hsl(200, 80%, 60%)", // blue
];

const Confetti = ({ isActive, duration = 2000 }: ConfettiProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: 50 + (Math.random() - 0.5) * 30,
          y: 50,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          velocityX: (Math.random() - 0.5) * 100,
          velocityY: -Math.random() * 80 - 40,
        });
      }
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none z-[100]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
          initial={{
            opacity: 1,
            scale: 1,
            rotate: particle.rotation,
          }}
          animate={{
            x: particle.velocityX * 3,
            y: particle.velocityY * -3 + 300,
            opacity: 0,
            scale: 0.5,
            rotate: particle.rotation + 720,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: duration / 1000,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
};

export default Confetti;

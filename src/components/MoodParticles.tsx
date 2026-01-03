import { motion } from "framer-motion";
import { useMemo } from "react";

interface MoodParticlesProps {
  mood?: string;
}

// Map moods to emoji particles
const moodParticles: Record<string, string[]> = {
  "✨ manifesting": ["✨", "🌟", "💫", "⭐"],
  "🌙 nocturnal mode": ["🌙", "⭐", "💫", "🌟"],
  "🔥 unhinged": ["🔥", "💥", "⚡", "🌶️"],
  "📖 deep thoughts": ["📖", "💭", "🧠", "✨"],
  "🎭 dramatic": ["🎭", "💅", "✨", "🌹"],
  "🎮 in my era": ["🎮", "🕹️", "⚡", "🔥"],
  "💃 slay mode": ["💃", "✨", "💅", "🔥"],
  "🎧 in the zone": ["🎧", "🎵", "🎶", "💜"],
  "☁️ floating": ["☁️", "💭", "🌙", "✨"],
  "👻 lurking": ["👻", "🌙", "💀", "🖤"],
  "🌀 unhinged hours": ["🌀", "💀", "🔥", "⚡"],
  "🥱 sleepy": ["😴", "💤", "🌙", "☁️"],
};

const MoodParticles = ({ mood }: MoodParticlesProps) => {
  const particles = useMemo(() => {
    if (!mood) return [];
    const emojis = moodParticles[mood] || ["✨", "💫"];
    
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: Math.random() * 40 - 20, // Random position around avatar
      y: Math.random() * 40 - 20,
      delay: i * 0.3,
      duration: 2 + Math.random() * 1,
    }));
  }, [mood]);

  if (!mood) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute text-xs"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            top: `calc(50% + ${particle.y}px)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
            y: [0, -15, -25, -35],
            x: [0, particle.x * 0.3, particle.x * 0.5, particle.x * 0.7],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeOut",
          }}
        >
          {particle.emoji}
        </motion.span>
      ))}
    </div>
  );
};

export default MoodParticles;

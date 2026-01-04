import { motion } from "framer-motion";
import { ConfessionCategory } from "@/lib/confessionData";

const CATEGORIES: { value: ConfessionCategory | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "all", emoji: "🌀" },
  { value: "crush", label: "crush", emoji: "💘" },
  { value: "ick", label: "ick", emoji: "🤢" },
  { value: "regret", label: "regret", emoji: "😩" },
  { value: "flex", label: "flex", emoji: "💅" },
  { value: "rant", label: "rant", emoji: "😤" },
  { value: "random", label: "random", emoji: "🎲" },
];

interface CategoryFilterProps {
  selected: ConfessionCategory | "all";
  onSelect: (category: ConfessionCategory | "all") => void;
}

export const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <motion.button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selected === cat.value
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {cat.emoji} {cat.label}
        </motion.button>
      ))}
    </div>
  );
};

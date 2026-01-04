import { motion } from "framer-motion";
import { Flame, Shuffle, Sparkles, Clock, Flag } from "lucide-react";

export type SortOption = "hot" | "chaotic" | "valid" | "new" | "random";

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "hot", label: "hot", icon: <Flame className="w-3.5 h-3.5" /> },
  { value: "chaotic", label: "chaotic", icon: <Flag className="w-3.5 h-3.5" /> },
  { value: "valid", label: "valid", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { value: "new", label: "new", icon: <Clock className="w-3.5 h-3.5" /> },
  { value: "random", label: "random", icon: <Shuffle className="w-3.5 h-3.5" /> },
];

interface SortBarProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

export const SortBar = ({ selected, onSelect }: SortBarProps) => {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <span className="text-xs text-muted-foreground mr-1">sort:</span>
      {SORT_OPTIONS.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
            selected === option.value
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {option.icon}
          <span>{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

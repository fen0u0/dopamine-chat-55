import { motion } from "framer-motion";
import { Flame, Clock, User } from "lucide-react";

export type SortOption = "hot" | "new" | "mine";

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "hot", label: "hot", icon: <Flame className="w-4 h-4" /> },
  { value: "new", label: "new", icon: <Clock className="w-4 h-4" /> },
  { value: "mine", label: "my posts", icon: <User className="w-4 h-4" /> },
];

interface SortBarProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

export const SortBar = ({ selected, onSelect }: SortBarProps) => {
  return (
    <div className="flex items-center gap-2 py-3">
      {SORT_OPTIONS.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === option.value
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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

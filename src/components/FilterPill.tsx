import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPillProps {
  label: string;
  icon?: LucideIcon;
  active: boolean;
  onClick: () => void;
}

const FilterPill = ({ label, icon: Icon, active, onClick }: FilterPillProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "pill flex items-center gap-2 whitespace-nowrap shrink-0",
        active && "active"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
};

export default FilterPill;

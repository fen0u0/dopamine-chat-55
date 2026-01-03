import { cn } from "@/lib/utils";

interface FloatingAvatarProps {
  name: string;
  colorIndex: 1 | 2 | 3 | 4 | 5;
  size?: "sm" | "md" | "lg";
  className?: string;
  animationClass?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "w-10 h-10 text-xs",
  md: "w-14 h-14 text-sm",
  lg: "w-20 h-20 text-base",
};

const colorClasses = {
  1: "bg-rose",
  2: "bg-coral",
  3: "bg-peach",
  4: "bg-accent",
  5: "bg-primary",
};

const FloatingAvatar = ({
  name,
  colorIndex,
  size = "md",
  className,
  animationClass = "animate-float",
  onClick,
}: FloatingAvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center justify-center font-outfit font-semibold text-background shadow-lg cursor-pointer transition-transform hover:scale-110",
        sizeClasses[size],
        colorClasses[colorIndex],
        animationClass,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
};

export default FloatingAvatar;

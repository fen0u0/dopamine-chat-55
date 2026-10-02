import { Heart, MessageCircle, User, Ghost, Globe2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { icon: <Heart className="w-6 h-6" />, label: "home", path: "/" },
    { icon: <MessageCircle className="w-6 h-6" />, label: "chats", path: "/chats" },
    { icon: <Globe2 className="w-6 h-6" />, label: "global", path: "/global-chat" },
    { icon: <Ghost className="w-6 h-6" />, label: "confess", path: "/confessions" },
    { icon: <User className="w-6 h-6" />, label: "profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-border bg-background/95 font-jb backdrop-blur-md">
      <div className="retro-scanlines pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true" />
      <div className="relative flex items-center justify-around px-3 py-2.5 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={cn(
                "nav-item relative min-w-14 px-2 py-1.5 text-muted-foreground transition-colors hover:-translate-y-0.5 active:scale-95",
                isActive && "active text-primary"
              )}
              aria-label={item.label}
            >
              <div className="relative mx-auto flex h-7 w-7 items-center justify-center border border-current/20 bg-foreground/[0.02] [image-rendering:pixelated]">
                {item.icon}
              </div>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.12em]">{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-3 left-1/2 w-1 h-1 bg-primary rounded-full"
                  layoutId="nav-indicator"
                  style={{ x: "-50%" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

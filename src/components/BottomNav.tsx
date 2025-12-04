import { motion } from "framer-motion";
import { Flame, MessageCircle, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { matches } from "@/data/profiles";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Calculate unread count from matches
  const unreadCount = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  const navItems: NavItem[] = [
    { icon: <Flame className="w-6 h-6" />, label: "Discover", path: "/" },
    { icon: <MessageCircle className="w-6 h-6" />, label: "Chats", path: "/chats", badge: unreadCount },
    { icon: <User className="w-6 h-6" />, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border z-40">
      <div className="flex items-center justify-around py-3 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "nav-item relative px-4 py-1",
                isActive && "active"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-3 left-1/2 w-1 h-1 bg-primary rounded-full"
                  layoutId="nav-indicator"
                  style={{ x: "-50%" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

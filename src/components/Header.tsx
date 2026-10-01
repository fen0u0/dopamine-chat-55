import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationsModal from "./NotificationsModal";
import { useChat } from "@/contexts/ChatContext";

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

const Header = ({ title, showLogo = true }: HeaderProps) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications } = useChat();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <motion.button 
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            onClick={() => navigate("/settings")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {showLogo ? (
            <motion.button
              className="text-xl font-bold gradient-text tracking-tight font-mono lowercase"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
            >
              vibe~
            </motion.button>
          ) : (
            <h1 className="text-lg font-semibold text-foreground tracking-tight lowercase">{title}</h1>
          )}

          <motion.button 
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors relative"
            onClick={() => setShowNotifications(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <motion.span
                className="absolute top-2 right-2 min-w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                aria-label={`${unreadCount} unread notifications`}
              />
            )}
          </motion.button>
        </div>
      </header>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default Header;

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationsModal from "./NotificationsModal";

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

const Header = ({ title, showLogo = true }: HeaderProps) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

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
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Users className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-xl font-bold gradient-text tracking-tight">cupid</span>
            </motion.div>
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
            <motion.span 
              className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
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
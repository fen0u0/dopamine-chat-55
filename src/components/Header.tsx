import { motion } from "framer-motion";
import { Bell, Settings, Sparkles } from "lucide-react";

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

const Header = ({ title, showLogo = true }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>

        {showLogo ? (
          <motion.div
            className="flex items-center gap-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold gradient-text">Spark</span>
          </motion.div>
        ) : (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}

        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default Header;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (!name.trim()) return;
    localStorage.setItem("currentUser", name.trim());
    navigate("/chats");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        className="max-w-sm w-full text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl font-bold gradient-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          vibe~
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          enter your name to continue
        </motion.p>

        <motion.input
          type="text"
          placeholder="your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-foreground/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        />

        <motion.button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="w-full py-3 rounded-xl font-semibold transition-all bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: name.trim() ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const existingUser = localStorage.getItem("currentUser")?.trim() || null;

  const [name, setName] = useState("");
  const [showSplash, setShowSplash] = useState(!existingUser);

  useEffect(() => {
  const user = localStorage.getItem("currentUser");
  if (user) navigate("/chats", { replace: true });
}, [navigate]);

  const handleContinue = () => {
    const cleanName = name.trim();
    if (!cleanName) return;

    // Optional: normalize casing (comment out if you want raw input)
    const normalizedName =
      cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    localStorage.setItem("currentUser", normalizedName);
    navigate("/chats");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h1
              className="text-6xl font-bold gradient-text"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 0px hsl(var(--primary))",
                  "0 0 30px hsl(var(--primary))",
                  "0 0 0px hsl(var(--primary))",
                ],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              vibe~
            </motion.h1>

            <motion.div
              className="flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
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
              className="w-full py-3 rounded-xl font-semibold transition-all
                bg-primary text-primary-foreground
                disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: name.trim() ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Continue
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

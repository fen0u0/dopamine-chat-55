import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
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
          transition={{ duration: 2, repeat: Infinity }}
        >
          vibe~
        </motion.h1>

        <p className="text-muted-foreground">
          connect. chat. vibe.
        </p>

        <motion.button
          onClick={() => navigate("/login")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-xl font-semibold
            bg-primary text-primary-foreground"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;

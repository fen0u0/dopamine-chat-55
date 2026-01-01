import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  // 🎬 Intro animation (ONLY ONCE PER VISIT)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatePresence mode="wait">
        {showIntro ? (
          /* ================= INTRO SPLASH ================= */
          <motion.div
            key="intro"
            className="min-h-screen flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: "blur(12px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h1
              className="text-7xl font-bold gradient-text"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 0px hsl(var(--primary))",
                  "0 0 40px hsl(var(--primary))",
                  "0 0 0px hsl(var(--primary))",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              vibe~
            </motion.h1>
          </motion.div>
        ) : (
          /* ================= REAL HOMEPAGE ================= */
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* ---------- HERO ---------- */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
              <motion.h1
                className="text-6xl md:text-7xl font-bold gradient-text"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                vibe~
              </motion.h1>

              <motion.p
                className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                a place to talk freely, connect deeply,  
                and just exist without filters.
              </motion.p>

              <motion.div
                className="mt-10 flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-xl font-semibold
                    bg-primary text-primary-foreground
                    hover:scale-105 transition"
                >
                  Get Started
                </button>

                <button
                  onClick={() => navigate("/confessions")}
                  className="px-8 py-3 rounded-xl font-semibold
                    bg-secondary text-foreground
                    hover:scale-105 transition"
                >
                  Explore
                </button>
              </motion.div>
            </section>

            {/* ---------- FEATURES ---------- */}
            <section className="py-24 px-6 max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                why people love vibe~
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "real conversations",
                    desc: "no fake profiles. no pressure. just humans talking.",
                  },
                  {
                    title: "privacy-first",
                    desc: "your chats stay yours. always.",
                  },
                  {
                    title: "mood-based vibes",
                    desc: "talk when you want. disappear when you need.",
                  },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    className="p-6 rounded-2xl bg-secondary/50 border border-foreground/5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                    <p className="text-muted-foreground">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ---------- FINAL CTA ---------- */}
            <section className="py-32 text-center px-6">
              <h2 className="text-4xl font-bold mb-6">
                ready to find your vibe?
              </h2>
              <p className="text-muted-foreground mb-10">
                takes less than 10 seconds to start.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-10 py-4 rounded-2xl text-lg font-semibold
                  bg-primary text-primary-foreground
                  hover:scale-105 transition"
              >
                Join vibe~
              </button>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

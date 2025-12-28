import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, X } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const Chats = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ⬇️ normalize user once
  const currentUser = localStorage.getItem("currentUser")?.trim() || null;

  /* 🔒 Redirect if user is not logged in */
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  // ⬇️ chat ID compatible with Chat.tsx
  const openGlobalChat = () => {
    navigate("/chat/global");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="messages" showLogo={false} />

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Search */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="find ur people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-secondary border border-foreground/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
          {searchQuery && (
            <motion.button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </motion.button>
          )}
        </motion.div>

        {/* Chats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            convos 💬
          </h2>

          {/* Global Chat */}
          <motion.div
            onClick={openGlobalChat}
            className="p-4 rounded-2xl bg-secondary cursor-pointer hover:bg-secondary/80 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="font-semibold text-lg text-foreground">
              Global Chat
            </h3>
            <p className="text-sm text-muted-foreground">
              chatting as{" "}
              <span className="font-semibold">{currentUser}</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Empty State */}
        {!searchQuery && (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 rounded-full gradient-border flex items-center justify-center bg-card mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              just vibes for now ✨
            </h3>
            <p className="text-sm text-muted-foreground">
              more features coming soon
            </p>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Chats;

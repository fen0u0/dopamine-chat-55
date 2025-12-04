import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, X } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ChatListItem from "@/components/ChatListItem";
import { matches } from "@/data/profiles";

const Chats = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

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

        {/* New Matches Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            new vibes ✨
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {matches.slice(0, 4).map((match, index) => (
              <motion.button
                key={match.id}
                className="flex-shrink-0 flex flex-col items-center group"
                onClick={() => navigate(`/chat/${match.id}`)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full gradient-border flex items-center justify-center bg-card group-hover:scale-105 transition-transform">
                    <span className="text-xl font-bold gradient-text">
                      {getInitials(match.name)}
                    </span>
                  </div>
                  {match.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background animate-pulse" />
                  )}
                  {match.unreadCount && match.unreadCount > 0 && (
                    <motion.div 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-violet rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="text-[10px] font-bold text-foreground">{match.unreadCount}</span>
                    </motion.div>
                  )}
                </div>
                <span className="text-xs text-foreground mt-2 font-semibold tracking-tight">
                  {match.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            convos 💬
          </h2>

          {filteredMatches.length > 0 ? (
            <div className="space-y-1">
              {filteredMatches.map((match, index) => (
                <ChatListItem
                  key={match.id}
                  profile={match}
                  onClick={() => navigate(`/chat/${match.id}`)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full gradient-border flex items-center justify-center bg-card mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {searchQuery ? "no matches found 💀" : "no msgs yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "try again bestie" : "start swiping to find ur people!"}
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Chats;
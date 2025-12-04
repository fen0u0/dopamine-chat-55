import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <Header title="Messages" showLogo={false} />

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
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </motion.div>

        {/* New Matches Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            New Matches
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {matches.slice(0, 4).map((match, index) => (
              <motion.button
                key={match.id}
                className="flex-shrink-0 flex flex-col items-center"
                onClick={() => navigate(`/chat/${match.id}`)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden gradient-border">
                    <img
                      src={match.images[0]}
                      alt={match.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {match.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <span className="text-xs text-foreground mt-2 font-medium">
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
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Messages
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
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No messages yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Start swiping to find your match!
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

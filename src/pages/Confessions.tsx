import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Ghost, Smile } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

interface Confession {
  id: number;
  text: string;
  mood: string;
  reactions: { emoji: string; count: number }[];
  timeAgo: string;
}

const initialConfessions: Confession[] = [
  { id: 1, text: "i still think about that one compliment from 3 years ago", mood: "🥹", reactions: [{ emoji: "💀", count: 42 }, { emoji: "🫂", count: 28 }], timeAgo: "2m" },
  { id: 2, text: "sometimes i pretend to be busy so i can eat snacks alone", mood: "🤫", reactions: [{ emoji: "😭", count: 89 }, { emoji: "🙌", count: 45 }], timeAgo: "5m" },
  { id: 3, text: "i rehearse conversations that will never happen", mood: "🎭", reactions: [{ emoji: "💀", count: 156 }, { emoji: "🫠", count: 67 }], timeAgo: "8m" },
  { id: 4, text: "my spotify wrapped is gonna be so embarrassing this year", mood: "😳", reactions: [{ emoji: "😭", count: 234 }, { emoji: "🎵", count: 89 }], timeAgo: "12m" },
  { id: 5, text: "i wave back at people who weren't waving at me", mood: "💀", reactions: [{ emoji: "😭", count: 567 }, { emoji: "🫣", count: 123 }], timeAgo: "18m" },
];

const Confessions = () => {
  const [confessions, setConfessions] = useState<Confession[]>(initialConfessions);
  const [newConfession, setNewConfession] = useState("");
  const [selectedMood, setSelectedMood] = useState("🤫");
  const [showEmojis, setShowEmojis] = useState(false);

  const moods = ["🤫", "💀", "🥹", "😳", "🎭", "✨", "🫠", "👻"];
  const reactionEmojis = ["💀", "😭", "🫠", "🙌", "🫂", "✨"];
  const textEmojis = ["✨", "💀", "😭", "🔥", "💅", "🫶", "😩", "💜", "🤭", "👀", "😈", "🥺", "🫣", "💯", "🙃", "😮‍💨"];

  const addEmoji = (emoji: string) => {
    setNewConfession((prev) => prev + emoji);
  };

  const handlePost = () => {
    if (!newConfession.trim()) return;
    
    const confession: Confession = {
      id: Date.now(),
      text: newConfession,
      mood: selectedMood,
      reactions: [],
      timeAgo: "now"
    };
    
    setConfessions([confession, ...confessions]);
    setNewConfession("");
    setShowEmojis(false);
    toast.success("confession posted anonymously 👻");
  };

  const handleReact = (confessionId: number, emoji: string) => {
    setConfessions(confessions.map(c => {
      if (c.id === confessionId) {
        const existingReaction = c.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...c,
            reactions: c.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...c,
            reactions: [...c.reactions, { emoji, count: 1 }]
          };
        }
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="confessions" showLogo={false} />

      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {/* Post Confession */}
        <motion.div
          className="glass rounded-2xl p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Ghost className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <textarea
                value={newConfession}
                onChange={(e) => setNewConfession(e.target.value)}
                placeholder="spill the tea anonymously..."
                className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-sm min-h-[60px]"
                maxLength={200}
              />
              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojis && (
                  <motion.div
                    className="mt-2 p-2 rounded-xl bg-secondary/50 border border-border"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex flex-wrap gap-1 justify-center">
                      {textEmojis.map((emoji) => (
                        <motion.button
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          className="text-xl p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowEmojis(!showEmojis)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      showEmojis ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Smile className="w-4 h-4" />
                  </motion.button>
                  <div className="flex gap-1">
                    {moods.map((mood) => (
                      <motion.button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${
                          selectedMood === mood ? "bg-primary/20 scale-110" : "hover:bg-secondary"
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        {mood}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <motion.button
                  onClick={handlePost}
                  disabled={!newConfession.trim()}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Confessions Feed */}
        <div className="space-y-4">
          <AnimatePresence>
            {confessions.map((confession, index) => (
              <motion.div
                key={confession.id}
                className="glass rounded-2xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
                    {confession.mood}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">anon</span>
                      <span className="text-xs text-muted-foreground">· {confession.timeAgo}</span>
                    </div>
                    <p className="text-foreground text-sm mb-3">{confession.text}</p>
                    
                    {/* Reactions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {confession.reactions.map((reaction) => (
                        <motion.button
                          key={reaction.emoji}
                          onClick={() => handleReact(confession.id, reaction.emoji)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>{reaction.emoji}</span>
                          <span className="text-muted-foreground">{reaction.count}</span>
                        </motion.button>
                      ))}
                      
                      {/* Add reaction button */}
                      <div className="relative group">
                        <motion.button
                          className="w-7 h-7 rounded-full bg-secondary/50 flex items-center justify-center text-xs text-muted-foreground"
                          whileHover={{ scale: 1.1 }}
                        >
                          +
                        </motion.button>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex gap-1 bg-card p-2 rounded-xl shadow-lg border border-border">
                          {reactionEmojis.map((emoji) => (
                            <motion.button
                              key={emoji}
                              onClick={() => handleReact(confession.id, emoji)}
                              className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Confessions;
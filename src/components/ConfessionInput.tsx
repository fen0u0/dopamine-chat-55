import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Ghost, Smile } from "lucide-react";
import { ConfessionCategory } from "@/lib/confessionData";
import { toast } from "sonner";

const CATEGORIES: { value: ConfessionCategory; label: string; emoji: string }[] = [
  { value: "crush", label: "crush", emoji: "💘" },
  { value: "ick", label: "ick", emoji: "🤢" },
  { value: "regret", label: "regret", emoji: "😩" },
  { value: "flex", label: "flex", emoji: "💅" },
  { value: "rant", label: "rant", emoji: "😤" },
  { value: "random", label: "random", emoji: "🎲" },
];

const TEXT_EMOJIS = ["✨", "💀", "😭", "🔥", "💅", "🫶", "😩", "💜", "🤭", "👀", "😈", "🥺", "🫣", "💯", "🙃", "😮‍💨"];

interface ConfessionInputProps {
  onSubmit: (text: string, category: ConfessionCategory) => void;
}

export const ConfessionInput = ({ onSubmit }: ConfessionInputProps) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<ConfessionCategory>("random");
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim(), category);
    setText("");
    setShowEmojis(false);
    toast.success("confession posted anonymously 👻");
  };

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  return (
    <motion.div
      className="glass rounded-2xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          <Ghost className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="spill the tea anonymously..."
            className="w-full bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-base min-h-[80px]"
            maxLength={280}
          />

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojis && (
              <motion.div
                className="mt-3 p-3 rounded-xl bg-secondary/50 border border-border"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  {TEXT_EMOJIS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="text-2xl p-2 hover:bg-secondary rounded-lg transition-colors"
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

          {/* Category selector */}
          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {cat.emoji} {cat.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                showEmojis ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Smile className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{text.length}/280</span>
              <motion.button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
                <span>confess</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

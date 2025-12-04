import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Heart, MoreVertical, Smile, Sparkles } from "lucide-react";
import { matches } from "@/data/profiles";
import { cn } from "@/lib/utils";
import ChatOptionsModal from "@/components/ChatOptionsModal";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = matches.find((m) => m.id === id);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "yo whats good 👋", sender: "them", timestamp: "10:30 AM" },
    { id: "2", text: "heyyy im doing great wbu!", sender: "me", timestamp: "10:32 AM" },
    { id: "3", text: "chillin rn, wanna hang later?", sender: "them", timestamp: "10:33 AM" },
    { id: "4", text: "yesss im so down", sender: "me", timestamp: "10:35 AM" },
  ]);

  const emojis = ["✨", "💀", "😭", "🔥", "💅", "🫶", "😩", "💜", "🤭", "👀", "😈", "🥺"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setShowEmojis(false);

    // Simulate reply
    setTimeout(() => {
      const replies = [
        "no way thats so real 💀",
        "slay bestie ✨",
        "LMAOOO stoppp 😭",
        "ur literally so iconic",
        "periodt 💅",
      ];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: "them",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const handleSendHeart = () => {
    const message: Message = {
      id: Date.now().toString(),
      text: "🫶",
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, message]);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  };

  if (!profile) {
    navigate("/chats");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <motion.button
            onClick={() => navigate("/chats")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>

          <motion.div 
            className="flex items-center gap-3 flex-1 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full gradient-border flex items-center justify-center bg-card">
                <span className="text-lg font-bold gradient-text">
                  {profile.name.charAt(0)}
                </span>
              </div>
              {profile.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-foreground tracking-tight">{profile.name}</h1>
              <p className="text-xs text-muted-foreground font-mono">
                {profile.isOnline ? "online rn ✨" : "offline"}
              </p>
            </div>
          </motion.div>

          <motion.button 
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            onClick={() => setShowOptions(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto max-w-lg mx-auto w-full">
        <div className="space-y-3 py-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "me" ? "justify-end" : "justify-start"
                )}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 transition-all",
                    message.sender === "me"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm border border-foreground/5"
                  )}
                >
                  <p className="text-sm font-medium">{message.text}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1 font-mono",
                      message.sender === "me"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="glass rounded-2xl p-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {emojis.map((emoji) => (
                  <motion.button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl p-2 hover:bg-secondary rounded-lg transition-colors"
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border">
        <div className="flex items-center gap-2 px-4 py-3 max-w-lg mx-auto">
          <motion.button 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              showEmojis ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            )}
            onClick={() => setShowEmojis(!showEmojis)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>
          <input
            type="text"
            placeholder="say something..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-3 rounded-full bg-secondary border border-foreground/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
          <motion.button
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              newMessage.trim()
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-violet text-foreground hover:text-foreground"
            )}
            onClick={newMessage.trim() ? handleSend : handleSendHeart}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            {newMessage.trim() ? (
              <Send className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      <ChatOptionsModal
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        profileName={profile.name}
      />
    </div>
  );
};

export default Chat;
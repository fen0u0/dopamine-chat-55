import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Heart, Sparkles, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatOptionsModal from "@/components/ChatOptionsModal";

// Type for message
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatId = id || "default_chat";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const currentUser = localStorage.getItem("currentUser") || "Prithwis";
  const otherUser = currentUser === "Prithwis" ? "Friend" : "Prithwis";

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(chatId) || "[]");
    setMessages(savedMessages);
  }, [chatId]);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const emojis = ["✨", "💀", "😭", "🔥", "💅", "🫶", "😩", "💜", "🤭", "👀", "😈", "🥺"];

  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    localStorage.setItem(chatId, JSON.stringify(newMessages));
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    saveMessages([...messages, message]);
    setNewMessage("");
    setShowEmojis(false);
  };

  const handleSendHeart = () => {
    const message: Message = {
      id: Date.now().toString(),
      text: "🫶",
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    saveMessages([...messages, message]);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  };

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

          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 rounded-full gradient-border flex items-center justify-center bg-card">
                <span className="text-lg font-bold gradient-text">
                  {otherUser.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-foreground tracking-tight">{otherUser}</h1>
              <p className="text-xs text-muted-foreground font-mono">online rn ✨</p>
            </div>
          </div>

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
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === currentUser ? "justify-end" : "justify-start"
                )}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 transition-all",
                    message.sender === currentUser
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm border border-foreground/5"
                  )}
                >
                  <p className="text-sm font-medium">{message.text}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1 font-mono",
                      message.sender === currentUser
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
            {newMessage.trim() ? <Send className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      <ChatOptionsModal
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        profileName={otherUser}
      />
    </div>
  );
};

export default Chat;

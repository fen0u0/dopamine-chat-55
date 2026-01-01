import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Heart, Sparkles, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatOptionsModal from "@/components/ChatOptionsModal";
import { useStats } from "@/contexts/StatsContext";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number; // ⬅️ store raw timestamp
}

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { incrementMessages } = useStats();

  const currentUser = localStorage.getItem("currentUser");

  // ⬇️ safer username handling
  const otherUser = id?.trim() || "unknown";

  // ⬇️ unique chat ID per user pair
  const chatId =
    currentUser && otherUser
      ? `chat_${[currentUser, otherUser].sort().join("_")}`
      : "default_chat";

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  /* 🔒 Redirect if user didn't enter name */
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  /* 📦 Load messages safely */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(chatId) || "[]");
      setMessages(Array.isArray(saved) ? saved : []);
    } catch {
      setMessages([]);
    }
  }, [chatId]);

  /* ⬇️ Auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const emojis = [
    "✨",
    "💀",
    "😭",
    "🔥",
    "💅",
    "🫶",
    "😩",
    "💜",
    "🤭",
    "👀",
    "😈",
    "🥺",
  ];

  const saveMessages = (updated: Message[]) => {
    setMessages(updated);
    localStorage.setItem(chatId, JSON.stringify(updated));
  };

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser) return;

    const message: Message = {
      id: crypto.randomUUID(), // ⬅️ safer ID
      text: newMessage,
      sender: currentUser,
      timestamp: Date.now(),
    };

    saveMessages([...messages, message]);
    incrementMessages(); // Track message sent for aura
    setNewMessage("");
    setShowEmojis(false);
  };

  const handleSendHeart = () => {
    if (!currentUser) return;

    saveMessages([
      ...messages,
      {
        id: crypto.randomUUID(),
        text: "🫶",
        sender: currentUser,
        timestamp: Date.now(),
      },
    ]);
    incrementMessages(); // Track heart sent for aura
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <motion.button
            onClick={() => navigate("/chats")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full gradient-border flex items-center justify-center bg-card">
              <span className="text-lg font-bold gradient-text">
                {otherUser.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-bold">{otherUser}</h1>
              <p className="text-xs text-muted-foreground">online rn ✨</p>
            </div>
          </div>

          <motion.button
            onClick={() => setShowOptions(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary"
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto max-w-lg mx-auto w-full">
        <div className="space-y-3 py-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === currentUser
                    ? "justify-end"
                    : "justify-start"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-3 rounded-2xl text-sm",
                    msg.sender === currentUser
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary border border-foreground/5 rounded-bl-sm"
                  )}
                >
                  {msg.text}
                  <div className="text-[10px] mt-1 opacity-60 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto glass p-3 rounded-2xl">
          <div className="flex flex-wrap justify-center gap-2">
            {emojis.map((e) => (
              <button
                key={e}
                onClick={() => setNewMessage((p) => p + e)}
                className="text-2xl p-2 hover:bg-secondary rounded-lg"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border">
        <div className="flex items-center gap-2 px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={() => setShowEmojis((p) => !p)}
            className="w-10 h-10 rounded-full hover:bg-secondary"
          >
            <Sparkles />
          </button>

          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="say something..."
            className="flex-1 px-4 py-3 rounded-full bg-secondary border border-foreground/5"
          />

          <button
            onClick={newMessage.trim() ? handleSend : handleSendHeart}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground"
          >
            {newMessage.trim() ? <Send /> : <Heart />}
          </button>
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

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Image, Heart, MoreVertical, Smile, X } from "lucide-react";
import { matches } from "@/data/profiles";
import { cn } from "@/lib/utils";
import ChatOptionsModal from "@/components/ChatOptionsModal";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
  image?: string;
}

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = matches.find((m) => m.id === id);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hey! How's it going? 😊", sender: "them", timestamp: "10:30 AM" },
    { id: "2", text: "Hi! I'm doing great, thanks for asking!", sender: "me", timestamp: "10:32 AM" },
    { id: "3", text: "That's awesome! What are you up to today?", sender: "them", timestamp: "10:33 AM" },
    { id: "4", text: "Just relaxing, how about you?", sender: "me", timestamp: "10:35 AM" },
  ]);

  const emojis = ["❤️", "😊", "😂", "🥰", "😍", "🔥", "💕", "✨", "👋", "😘", "🎉", "💯"];

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
        "That sounds great! 💕",
        "Haha, I love that! 😂",
        "We should definitely hang out sometime!",
        "You're so sweet! 🥰",
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

  const handleSendImage = () => {
    const message: Message = {
      id: Date.now().toString(),
      text: "Sent a photo 📷",
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, message]);
    setShowImagePicker(false);
    toast.success("Image sent!");
  };

  const handleSendHeart = () => {
    const message: Message = {
      id: Date.now().toString(),
      text: "❤️",
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
            onClick={() => toast.info(`${profile.name}'s profile`)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={profile.images[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {profile.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{profile.name}</h1>
              <p className="text-xs text-muted-foreground">
                {profile.isOnline ? "Active now" : "Last seen recently"}
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
        <div className="space-y-4 py-4">
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
                    "max-w-[75%] rounded-2xl px-4 py-3",
                    message.sender === "me"
                      ? "bg-gradient-to-br from-coral to-pink text-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.sender === "me"
                        ? "text-foreground/70"
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

      {/* Image Picker Modal */}
      <AnimatePresence>
        {showImagePicker && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImagePicker(false)}
            />
            <motion.div
              className="fixed inset-x-4 bottom-24 z-50 max-w-sm mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="glass rounded-3xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Send Photo</h3>
                  <button onClick={() => setShowImagePicker(false)}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.button
                      key={i}
                      className="aspect-square rounded-xl bg-secondary flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendImage}
                    >
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={handleSendImage}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Take Photo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                    className="text-2xl p-2 hover:bg-secondary rounded-lg"
                    whileHover={{ scale: 1.2 }}
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
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            onClick={() => setShowImagePicker(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image className="w-5 h-5 text-muted-foreground" />
          </motion.button>
          <motion.button 
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            onClick={() => setShowEmojis(!showEmojis)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Smile className={cn("w-5 h-5", showEmojis ? "text-primary" : "text-muted-foreground")} />
          </motion.button>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-3 rounded-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <motion.button
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              newMessage.trim()
                ? "bg-gradient-to-br from-coral to-pink"
                : "bg-secondary"
            )}
            onClick={newMessage.trim() ? handleSend : handleSendHeart}
            whileTap={{ scale: 0.9 }}
          >
            {newMessage.trim() ? (
              <Send className="w-5 h-5 text-foreground" />
            ) : (
              <Heart className="w-5 h-5 text-primary" />
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

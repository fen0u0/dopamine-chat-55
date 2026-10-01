import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Heart, Smile, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatOptionsModal from "@/components/ChatOptionsModal";
import { useStats } from "@/contexts/StatsContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, VibeProfile } from "@/lib/auth";
import { isUuid, REACTIONS } from "@/lib/chat";
import { toast } from "sonner";
import { useChat } from "@/contexts/ChatContext";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
}
interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
}

const EMOJIS = ["✨", "💀", "😭", "🔥", "💅", "🫶", "😩", "💜", "🤭", "👀", "😈", "🥺"];

const Chat = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const { incrementMessages } = useStats();
  const { addNotification } = useChat();
  const endRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimer = useRef<number>();
  const lastTypingSent = useRef(0);

  const [other, setOther] = useState<VibeProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [reactingTo, setReactingTo] = useState<string | null>(null);
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherOnline, setOtherOnline] = useState(false);

  useEffect(() => {
    if (!loading && !profile) navigate("/login", { replace: true });
  }, [loading, profile, navigate]);

  // Demo profiles on the home grid aren't real people
  useEffect(() => {
    if (id && !isUuid(id)) {
      toast("that's a demo stranger 👻 — find real people in messages");
      navigate("/chats", { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!profile || !isUuid(id)) return;
    let active = true;

    (async () => {
      const { data: convo } = await supabase.from("conversations").select("user_a, user_b").eq("id", id).maybeSingle();
      if (!convo) {
        toast.error("chat not found");
        navigate("/chats", { replace: true });
        return;
      }
      const otherId = convo.user_a === profile.id ? convo.user_b : convo.user_a;
      const [{ data: o }, { data: msgs }, { data: rx }] = await Promise.all([
        supabase.from("profiles").select("id, username, avatar, mood").eq("id", otherId).maybeSingle(),
        supabase.from("messages").select("id, text, sender_id, created_at").eq("conversation_id", id).order("created_at").limit(500),
        supabase.from("message_reactions").select("id, message_id, user_id, emoji").eq("conversation_id", id),
      ]);
      if (!active) return;
      setOther(o);
      setMessages(msgs ?? []);
      setReactions(rx ?? []);
    })();

    const channel = supabase
      .channel(`chat:${id}`, { config: { presence: { key: profile.id } } })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` }, (p) => {
        const m = p.new as Message;
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        if (m.sender_id !== profile.id) {
          setOtherTyping(false);
          addNotification({
            id: m.id,
            type: "message",
            name: other?.username ?? "someone",
            time: "just now",
          });
        }
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (p) => {
        setMessages((prev) => prev.filter((x) => x.id !== (p.old as Message).id));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "message_reactions", filter: `conversation_id=eq.${id}` }, (p) => {
        const r = p.new as Reaction;
        setReactions((prev) => (prev.some((x) => x.id === r.id) ? prev : [...prev, r]));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "message_reactions", filter: `conversation_id=eq.${id}` }, (p) => {
        setReactions((prev) => prev.filter((x) => x.id !== (p.old as Reaction).id));
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.user === profile.id) return;
        setOtherTyping(true);
        window.clearTimeout(typingTimer.current);
        typingTimer.current = window.setTimeout(() => setOtherTyping(false), 3000);
      })
      .on("presence", { event: "sync" }, () => {
        const keys = Object.keys(channel.presenceState());
        setOtherOnline(keys.some((k) => k !== profile.id));
      })
      .subscribe((s) => s === "SUBSCRIBED" && channel.track({ at: Date.now() }));
    channelRef.current = channel;

    return () => {
      active = false;
      window.clearTimeout(typingTimer.current);
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [id, profile, navigate, other?.username, addNotification]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherTyping]);

  const reactionsByMsg = useMemo(() => {
    const map: Record<string, Reaction[]> = {};
    reactions.forEach((r) => (map[r.message_id] ||= []).push(r));
    return map;
  }, [reactions]);

  const sendText = async (text: string) => {
    if (!profile || !text.trim()) return;
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: id, sender_id: profile.id, text: text.trim() })
      .select("id, text, sender_id, created_at")
      .single();
    if (error) return toast.error("message didn't send 😩");
    setMessages((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data]));
    incrementMessages();
  };

  const handleSend = () => {
    const t = newMessage;
    setNewMessage("");
    setShowEmojis(false);
    sendText(t);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!profile || !window.confirm("Delete this message permanently?")) return;

    setMessages((previous) => previous.filter((message) => message.id !== messageId));
    const { error } = await supabase.from("messages").delete().eq("id", messageId).eq("sender_id", profile.id);
    if (error) {
      console.error("[chat] failed to delete message", { code: error.code, message: error.message, details: error.details, messageId });
      toast.error("couldn't delete message");
      return;
    }
    setReactions((previous) => previous.filter((reaction) => reaction.message_id !== messageId));
    toast.success("message permanently deleted");
  };

  const handleDeleteChat = async () => {
    if (!profile || !id || !window.confirm("Delete this chat and all of its messages permanently?")) return;
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) {
      console.error("[chat] failed to delete conversation", { code: error.code, message: error.message, details: error.details });
      toast.error("couldn't delete chat");
      return;
    }
    toast.success("chat and messages permanently deleted");
    navigate("/chats", { replace: true });
  };

  const handleTyping = (v: string) => {
    setNewMessage(v);
    const now = Date.now();
    if (now - lastTypingSent.current > 1500 && channelRef.current && profile) {
      lastTypingSent.current = now;
      channelRef.current.send({ type: "broadcast", event: "typing", payload: { user: profile.id } });
    }
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!profile) return;
    setReactingTo(null);
    const mine = reactions.find((r) => r.message_id === messageId && r.user_id === profile.id && r.emoji === emoji);
    if (mine) {
      setReactions((prev) => prev.filter((r) => r.id !== mine.id));
      await supabase.from("message_reactions").delete().eq("id", mine.id);
    } else {
      const { data } = await supabase
        .from("message_reactions")
        .insert({ message_id: messageId, conversation_id: id, user_id: profile.id, emoji })
        .select("id, message_id, user_id, emoji")
        .single();
      if (data) setReactions((prev) => (prev.some((x) => x.id === data.id) ? prev : [...prev, data]));
    }
  };

  const name = other?.username ?? "...";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <motion.button onClick={() => navigate("/chats")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary" whileTap={{ scale: 0.9 }}>
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full gradient-border flex items-center justify-center bg-card text-xl">{other?.avatar ?? "👻"}</div>
            <div>
              <h1 className="font-bold">{name}</h1>
              <p className="text-xs text-muted-foreground">
                {otherTyping ? "typing..." : otherOnline ? "online rn ✨" : "offline 🌙"}
              </p>
            </div>
          </div>
          <motion.button onClick={() => setShowOptions(true)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary" whileTap={{ scale: 0.9 }}>
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto max-w-lg mx-auto w-full">
        <div className="space-y-3 py-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">say hi to {name} 👋</p>
          )}
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const mine = msg.sender_id === profile?.id;
              const rx = reactionsByMsg[msg.id] ?? [];
              const grouped = rx.reduce<Record<string, number>>((a, r) => ({ ...a, [r.emoji]: (a[r.emoji] || 0) + 1 }), {});
              return (
                <motion.div key={msg.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={cn("flex items-center gap-2 max-w-full", mine && "flex-row-reverse")}>
                    <button
                      onClick={() => setReactingTo(reactingTo === msg.id ? null : msg.id)}
                      className={cn(
                        "max-w-[75%] px-4 py-3 rounded-2xl text-sm text-left break-words",
                        mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary border border-foreground/5 rounded-bl-sm"
                      )}
                    >
                      {msg.text}
                      <div className="text-[10px] mt-1 opacity-60 font-mono">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </button>
                    {mine && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label="Delete message permanently"
                        title="Delete message permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {reactingTo === msg.id && (
                    <motion.div className="flex gap-1 mt-1 glass rounded-full px-2 py-1" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      {REACTIONS.map((e) => (
                        <button key={e} onClick={() => toggleReaction(msg.id, e)} className="text-lg hover:scale-125 transition-transform">{e}</button>
                      ))}
                    </motion.div>
                  )}
                  {Object.keys(grouped).length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {Object.entries(grouped).map(([e, n]) => (
                        <button key={e} onClick={() => toggleReaction(msg.id, e)} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border">
                          {e} {n > 1 && n}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {otherTyping && (
            <div className="flex gap-1 px-4 py-3 rounded-2xl bg-secondary w-fit">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </main>

      {showEmojis && (
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto glass p-3 rounded-2xl">
          <div className="flex flex-wrap justify-center gap-2">
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => setNewMessage((p) => p + e)} className="text-2xl p-2 hover:bg-secondary rounded-lg">{e}</button>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border">
        <div className="flex items-center gap-2 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => setShowEmojis((p) => !p)} className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center" aria-label="Emojis">
            <Smile className="w-5 h-5" />
          </button>
          <input
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="say something..."
            maxLength={2000}
            className="flex-1 px-4 py-3 rounded-full bg-secondary border border-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={newMessage.trim() ? handleSend : () => sendText("🫶")}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
            aria-label="Send"
          >
            {newMessage.trim() ? <Send className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <ChatOptionsModal
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        profileName={name}
        onDeleteChat={handleDeleteChat}
      />
    </div>
  );
};

export default Chat;

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Globe2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

interface GlobalMessage {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
}

const GlobalChat = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !profile) navigate("/login", { replace: true });
  }, [loading, profile, navigate]);

  useEffect(() => {
    if (!profile) return;
    let active = true;

    supabase
      .from("global_chat_messages")
      .select("id, text, sender_id, created_at")
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) toast.error("global chat is unavailable right now");
        setMessages(data ?? []);
      });

    const channel = supabase
      .channel(`global-chat-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "global_chat_messages" }, (payload) => {
        const message = payload.new as GlobalMessage;
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "global_chat_messages" }, (payload) => {
        setMessages((current) => current.filter((item) => item.id !== (payload.old as GlobalMessage).id));
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [profile]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const value = text.trim();
    if (!profile || !value) return;
    setText("");
    const { data, error } = await supabase
      .from("global_chat_messages")
      .insert({ sender_id: profile.id, text: value })
      .select("id, text, sender_id, created_at")
      .single();
    if (error) {
      setText(value);
      toast.error("message didn't send");
      return;
    }
    setMessages((current) => current.some((item) => item.id === data.id) ? current : [...current, data]);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Globe2 className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-bold">global chat</h1>
            <p className="text-xs text-muted-foreground">everyone is welcome</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-16">start the conversation</p>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => {
              const mine = message.sender_id === profile?.id;
              return (
                <div key={message.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm break-words ${mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"}`}>
                    <p>{message.text}</p>
                    <p className="text-[10px] mt-1 opacity-60">{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        )}
      </main>

      <div className="fixed bottom-14 left-0 right-0 glass border-t border-border">
        <div className="flex items-center gap-2 px-4 py-3 max-w-lg mx-auto">
          <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) sendMessage(); }} maxLength={500} placeholder="say something to everyone..." className="flex-1 px-4 py-3 rounded-full bg-secondary border border-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <button onClick={sendMessage} disabled={!text.trim()} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50" aria-label="Send message">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GlobalChat;

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Globe2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import BottomNav from "@/components/BottomNav";

interface GlobalMessage {
  id: string;
  sender_id: string;
  text: string;
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
      .select("id, sender_id, text, created_at")
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) toast.error("global chat couldn't load");
        setMessages(data ?? []);
      });

    const channel = supabase
      .channel("global-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "global_chat_messages" }, (payload) => {
        const message = payload.new as GlobalMessage;
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
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
    const trimmed = text.trim();
    if (!profile || !trimmed) return;
    setText("");
    const { error } = await supabase.from("global_chat_messages").insert({ sender_id: profile.id, text: trimmed });
    if (error) {
      setText(trimmed);
      toast.error("message didn't send");
    }
  };

  if (loading || !profile) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center"><Globe2 className="w-5 h-5" /></div>
          <div>
            <h1 className="font-bold">global chat</h1>
            <p className="text-xs text-muted-foreground">everyone is welcome</p>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20 pb-32 px-4 max-w-lg mx-auto w-full overflow-y-auto">
        <div className="py-4 flex flex-col gap-3">
          {messages.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">start the conversation</p>}
          {messages.map((message) => {
            const mine = message.sender_id === profile.id;
            return (
              <div key={message.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                {!mine && <span className="text-[11px] text-muted-foreground mb-1 px-2">someone</span>}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm break-words ${mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary border border-foreground/5 rounded-bl-sm"}`}>
                  {message.text}
                  <div className="text-[10px] mt-1 opacity-60 font-mono">{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 glass border-t border-border">
        <div className="flex items-center gap-2 px-4 py-3 max-w-lg mx-auto">
          <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) sendMessage(); }} placeholder="say something to everyone..." maxLength={500} className="flex-1 px-4 py-3 rounded-full bg-secondary border border-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary/50" />
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

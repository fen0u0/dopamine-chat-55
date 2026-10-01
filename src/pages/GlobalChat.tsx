import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type GlobalMessage = {
  id: string;
  content: string;
  user_id: string;
  username: string;
  created_at: string;
};

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const GlobalChat = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !profile) navigate("/login", { replace: true });
  }, [loading, profile, navigate]);

  useEffect(() => {
    if (!profile) return;
    let active = true;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("global_messages")
        .select("id, content, user_id, username, created_at")
        .order("created_at", { ascending: true })
        .limit(500);

      if (error) {
        toast.error("couldn't load global chat");
        return;
      }
      if (active) setMessages((data ?? []) as GlobalMessage[]);
    };

    loadMessages();

    const channel = supabase
      .channel("global-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "global_messages" },
        (payload) => {
          const incoming = payload.new as GlobalMessage;
          setMessages((current) =>
            current.some((message) => message.id === incoming.id)
              ? current
              : [...current, incoming],
          );
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [profile]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!profile || !content || isSending) return;

    setIsSending(true);
    const { data, error } = await supabase
      .from("global_messages")
      .insert({
        content,
        user_id: profile.id,
        username: profile.username || "anonymous",
      })
      .select("id, content, user_id, username, created_at")
      .single();
    setIsSending(false);

    if (error) {
      toast.error("message didn't send");
      return;
    }

    setDraft("");
    const sent = data as GlobalMessage;
    setMessages((current) =>
      current.some((message) => message.id === sent.id) ? current : [...current, sent],
    );
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-mono">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white" aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-bold tracking-tight">global_chat</h1>
            <p className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
              live room
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col px-4">
        <section className="flex-1 space-y-3 py-6" aria-live="polite">
          {messages.length === 0 ? (
            <div className="py-24 text-center text-xs text-neutral-600">no messages yet — start the room</div>
          ) : (
            messages.map((message) => {
              const mine = message.user_id === profile?.id;
              return (
                <article key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl border px-3.5 py-2.5 ${mine ? "border-violet-900/60 bg-violet-950/50" : "border-neutral-800 bg-neutral-900"}`}>
                    <div className="mb-1 flex items-center gap-2 text-[10px] text-neutral-500">
                      <span className="font-semibold text-neutral-300">@{message.username || "anonymous"}</span>
                      <time dateTime={message.created_at}>{formatTime(message.created_at)}</time>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
                  </div>
                </article>
              );
            })
          )}
          <div ref={endRef} />
        </section>

        <form onSubmit={handleSubmit} className="sticky bottom-0 -mx-4 border-t border-neutral-800 bg-black px-4 py-4">
          <div className="flex items-end gap-2 rounded-xl border border-neutral-800 bg-neutral-950 p-2 transition focus-within:border-neutral-600">
            <label htmlFor="global-message" className="sr-only">Message</label>
            <textarea id="global-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="say something nice..." rows={1} maxLength={500} className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-neutral-600" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
            <button type="submit" disabled={!draft.trim() || isSending} className="rounded-lg bg-white p-2.5 text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Send message">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default GlobalChat;

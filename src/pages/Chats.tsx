import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, VibeProfile } from "@/lib/auth";
import { getOrCreateConversation } from "@/lib/chat";
import { toast } from "sonner";

interface ConvoRow {
  id: string;
  other: VibeProfile;
  last_message_at: string;
}

const Chats = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [convos, setConvos] = useState<ConvoRow[]>([]);
  const [online, setOnline] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !profile) navigate("/login", { replace: true });
  }, [loading, profile, navigate]);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const { data: cs } = await supabase
        .from("conversations")
        .select("id, user_a, user_b, last_message_at")
        .order("last_message_at", { ascending: false });
      const otherIds = (cs ?? []).map((c) => (c.user_a === profile.id ? c.user_b : c.user_a));
      const { data: all } = otherIds.length
        ? await supabase.from("profiles").select("id, username, avatar, mood").in("id", otherIds)
        : { data: [] as VibeProfile[] };
      const lookup = all ?? [];
      setConvos(
        (cs ?? [])
          .map((c) => {
            const other = lookup.find((p) => p.id === (c.user_a === profile.id ? c.user_b : c.user_a));
            return other ? { id: c.id, other, last_message_at: c.last_message_at } : null;
          })
          .filter(Boolean) as ConvoRow[]
      );
    };
    load();

    // live: new convos / new messages bump the list
    const ch = supabase
      .channel("convos-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, load)
      .subscribe();

    // presence: who's online rn
    const presence = supabase.channel("online", { config: { presence: { key: profile.id } } });
    presence
      .on("presence", { event: "sync" }, () => setOnline(new Set(Object.keys(presence.presenceState()))))
      .subscribe((s) => s === "SUBSCRIBED" && presence.track({ at: Date.now() }));

    return () => {
      supabase.removeChannel(ch);
      supabase.removeChannel(presence);
    };
  }, [profile]);

  const filteredConvos = useMemo(
    () => convos.filter((conversation) => conversation.other.username.toLowerCase().includes(searchQuery.toLowerCase())),
    [convos, searchQuery]
  );

  const Avatar = ({ p }: { p: VibeProfile }) => (
    <div className="relative">
      <div className="w-12 h-12 rounded-full bg-card gradient-border flex items-center justify-center text-2xl">{p.avatar}</div>
      {online.has(p.id) && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header title="messages" showLogo={false} />

      <main className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            placeholder="find ur people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-secondary border border-foreground/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {!searchQuery && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">convos 💬</h2>
            {filteredConvos.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">no convos yet — start one from the home page</p>
            ) : (
              <div className="space-y-1">
                {filteredConvos.map((c) => (
                  <motion.button
                    key={c.id}
                    onClick={() => navigate(`/chat/${c.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 text-left"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Avatar p={c.other} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{c.other.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {online.has(c.other.id) ? "online rn ✨" : new Date(c.last_message_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </section>
        )}
        <p className="text-center text-xs text-muted-foreground py-8">find new people on the home page</p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Chats;

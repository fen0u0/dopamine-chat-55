import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { ConfessionInput } from "@/components/ConfessionInput";
import { ConfessionCard } from "@/components/ConfessionCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SortBar, SortOption } from "@/components/SortBar";
import {
  Confession,
  Comment,
  ConfessionCategory,
  getUserAnonIdentity,
} from "@/lib/confessionData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ConfessionRow {
  id: string;
  content: string;
  category: ConfessionCategory;
  user_id: string;
  created_at: string;
}

interface ProfileRow {
  id: string;
  username: string;
  avatar: string;
}

const blankMeta = () => ({
  flags: { red: 0, green: 0 },
  reactions: { crying: 0, skull: 0, eyes: 0, fire: 0, sparkles: 0 },
  comments: [] as Comment[],
  userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
  userFlagged: null as "red" | "green" | null,
});

const rowToConfession = (
  row: ConfessionRow,
  profileMap: Record<string, ProfileRow | undefined>
): Confession => {
  const p = profileMap[row.user_id];
  const anon = getUserAnonIdentity();
  return {
    id: row.id,
    anonName: p?.username ?? anon.name,
    avatar: p?.avatar ?? anon.avatar,
    text: row.content,
    timestamp: row.created_at,
    category: row.category,
    ...blankMeta(),
  };
};

const Confessions = () => {
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, ProfileRow | undefined>>({});
  const [selectedCategory, setSelectedCategory] = useState<ConfessionCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("new");
  const [fetching, setFetching] = useState(true);

  // Ref mirror so the realtime callback always sees the latest profile lookups
  const profileMapRef = useRef(profileMap);
  useEffect(() => {
    profileMapRef.current = profileMap;
  }, [profileMap]);

  useEffect(() => {
    if (!loading && !session) navigate("/login", { replace: true });
  }, [loading, session, navigate]);

  const fetchProfile = useCallback(async (userId: string): Promise<ProfileRow | undefined> => {
    const cached = profileMapRef.current[userId];
    if (cached) return cached;
    const { data } = await supabase
      .from("profiles")
      .select("id, username, avatar")
      .eq("id", userId)
      .maybeSingle();
    const p = (data as ProfileRow | null) ?? undefined;
    if (p) {
      profileMapRef.current = { ...profileMapRef.current, [userId]: p };
      setProfileMap(profileMapRef.current);
    }
    return p;
  }, []);

  const loadConfessions = useCallback(async () => {
    const { data, error } = await supabase
      .from("confessions")
      .select("id, content, category, user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[confessions] failed to load feed", error);
      setLoadError("couldn't load the confession feed right now");
      toast.error("couldn't load confessions 😩");
      setFetching(false);
      return;
    }

    setLoadError(null);

    const rows = (data ?? []) as ConfessionRow[];
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    let pMap: Record<string, ProfileRow | undefined> = {};
    if (userIds.length) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar")
        .in("id", userIds);
      pMap = (profiles ?? []).reduce<Record<string, ProfileRow>>((acc, p) => {
        acc[p.id] = p as ProfileRow;
        return acc;
      }, {});
      profileMapRef.current = pMap;
      setProfileMap(pMap);
    }

    setConfessions(rows.map((r) => rowToConfession(r, pMap)));
    setFetching(false);
  }, []);

  useEffect(() => {
    if (!session) return;
    loadConfessions();

    const channel = supabase
      .channel("confessions-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "confessions" },
        async (payload) => {
          const row = payload.new as ConfessionRow;
          const p = await fetchProfile(row.user_id);
          setConfessions((prev) => {
            if (prev.some((c) => c.id === row.id)) return prev;
            const map: Record<string, ProfileRow | undefined> = p ? { [row.user_id]: p } : {};
            return [rowToConfession(row, map), ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "confessions" },
        (payload) => {
          const oldId = (payload.old as ConfessionRow).id;
          setConfessions((prev) => prev.filter((c) => c.id !== oldId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, loadConfessions, fetchProfile]);

  const currentUser = useMemo(() => getUserAnonIdentity(), []);

  const displayedConfessions = useMemo(() => {
    let filtered = selectedCategory === "all"
      ? confessions
      : confessions.filter((c) => c.category === selectedCategory);

    if (sortBy === "mine") {
      filtered = filtered.filter(
        (c) => c.anonName === currentUser.name && c.avatar === currentUser.avatar
      );
      return [...filtered].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    switch (sortBy) {
      case "hot":
        return [...filtered].sort((a, b) => {
          const aTotal = Object.values(a.reactions).reduce((sum, v) => sum + v, 0) + a.flags.red + a.flags.green;
          const bTotal = Object.values(b.reactions).reduce((sum, v) => sum + v, 0) + b.flags.red + b.flags.green;
          return bTotal - aTotal;
        });
      case "new":
        return [...filtered].sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      default:
        return filtered;
    }
  }, [confessions, selectedCategory, sortBy, currentUser]);

  const handleAddConfession = async (text: string, category: ConfessionCategory) => {
    if (!profile) return;
    const { data, error } = await supabase
      .from("confessions")
      .insert({ content: text, category, user_id: profile.id })
      .select("id, content, category, user_id, created_at")
      .single();

    if (error) {
      toast.error("couldn't post confession 😩");
      return;
    }

    const row = data as ConfessionRow;
    const ownProfile: Record<string, ProfileRow | undefined> = {
      [profile.id]: { id: profile.id, username: profile.username, avatar: profile.avatar },
    };
    setConfessions((prev) => {
      if (prev.some((c) => c.id === row.id)) return prev;
      return [rowToConfession(row, ownProfile), ...prev];
    });
  };

  const handleReactToConfession = (
    confessionId: string,
    reaction: keyof Confession["reactions"]
  ) => {
    setConfessions((prev) =>
      prev.map((conf) => {
        if (conf.id !== confessionId) return conf;
        const wasReacted = conf.userReacted?.[reaction] || false;
        return {
          ...conf,
          reactions: {
            ...conf.reactions,
            [reaction]: wasReacted
              ? conf.reactions[reaction] - 1
              : conf.reactions[reaction] + 1,
          },
          userReacted: {
            ...conf.userReacted,
            [reaction]: !wasReacted,
          },
        };
      })
    );
  };

  const handleFlagConfession = (confessionId: string, flag: "red" | "green") => {
    setConfessions((prev) =>
      prev.map((conf) => {
        if (conf.id !== confessionId) return conf;
        const previousVote = conf.userFlagged;
        const newFlags = { ...conf.flags };
        if (previousVote) {
          newFlags[previousVote] = Math.max(0, newFlags[previousVote] - 1);
        }
        if (previousVote === flag) {
          return { ...conf, flags: newFlags, userFlagged: null };
        }
        newFlags[flag] = newFlags[flag] + 1;
        return { ...conf, flags: newFlags, userFlagged: flag };
      })
    );
  };

  const handleAddComment = (confessionId: string, comment: Comment) => {
    setConfessions((prev) =>
      prev.map((conf) =>
        conf.id === confessionId
          ? { ...conf, comments: [...conf.comments, comment] }
          : conf
      )
    );
  };

  const handleReactToComment = (
    confessionId: string,
    commentId: string,
    reaction: keyof Comment["reactions"]
  ) => {
    setConfessions((prev) =>
      prev.map((conf) => {
        if (conf.id !== confessionId) return conf;
        return {
          ...conf,
          comments: conf.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            const wasReacted = comment.userReacted?.[reaction] || false;
            return {
              ...comment,
              reactions: {
                ...comment.reactions,
                [reaction]: wasReacted
                  ? comment.reactions[reaction] - 1
                  : comment.reactions[reaction] + 1,
              },
              userReacted: {
                ...comment.userReacted,
                [reaction]: !wasReacted,
              },
            };
          }),
        };
      })
    );
  };

  const handleDeleteComment = (confessionId: string, commentId: string) => {
    setConfessions((prev) =>
      prev.map((conf) => {
        if (conf.id !== confessionId) return conf;
        return {
          ...conf,
          comments: conf.comments.filter((comment) => comment.id !== commentId),
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="confessions" showLogo={false} />

      <main className="max-w-2xl mx-auto px-4 py-6 pt-24 space-y-5">
        <ConfessionInput onSubmit={handleAddConfession} />

        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <SortBar selected={sortBy} onSelect={setSortBy} />

        <div className="space-y-5">
          {fetching ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-xl">loading the tea... 🫖</p>
            </div>
          ) : loadError ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-xl">{loadError}</p>
              <button className="mt-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground" onClick={loadConfessions}>
                try again
              </button>
            </div>
          ) : displayedConfessions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-xl">no tea in this category yet 🫖</p>
              <p className="text-base mt-2">be the first to spill!</p>
            </div>
          ) : (
            displayedConfessions.map((confession) => (
              <ConfessionCard
                key={confession.id}
                confession={confession}
                onReact={handleReactToConfession}
                onAddComment={handleAddComment}
                onReactToComment={handleReactToComment}
                onFlag={handleFlagConfession}
                onDeleteComment={handleDeleteComment}
              />
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Confessions;

import { useState, useMemo, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { ConfessionInput } from "@/components/ConfessionInput";
import { ConfessionCard } from "@/components/ConfessionCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SortBar, SortOption } from "@/components/SortBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  Confession,
  Comment,
  ConfessionCategory,
  getUserAnonIdentity,
} from "@/lib/confessionData";

type ConfessionRow = {
  id: string;
  content: string;
  category: ConfessionCategory;
  user_id: string;
  created_at: string;
};

const toConfession = (row: ConfessionRow): Confession => {
  const identity = getUserAnonIdentity();
  return {
    id: row.id,
    userId: row.user_id,
    anonName: identity.name,
    avatar: identity.avatar,
    text: row.content,
    timestamp: row.created_at,
    category: row.category,
    flags: { red: 0, green: 0 },
    reactions: { crying: 0, skull: 0, eyes: 0, fire: 0, sparkles: 0 },
    comments: [],
    userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
  };
};

const Confessions = () => {
  const { session } = useAuth();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ConfessionCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("hot");
  const [isLoading, setIsLoading] = useState(true);

  const loadConfessions = useCallback(async () => {
    const { data, error } = await supabase
      .from("confessions")
      .select("id, content, category, user_id, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load confessions:", error.message);
      setIsLoading(false);
      return;
    }

    setConfessions((data as ConfessionRow[]).map(toConfession));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadConfessions();

    const channel = supabase
      .channel("confessions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "confessions" },
        (payload) => {
          const confession = toConfession(payload.new as ConfessionRow);
          setConfessions((current) =>
            current.some((item) => item.id === confession.id)
              ? current
              : [confession, ...current]
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadConfessions]);

  // Get current user identity for filtering "mine"
  const currentUser = useMemo(() => getUserAnonIdentity(), []);

  // Filter and sort confessions
  const displayedConfessions = useMemo(() => {
    let filtered = selectedCategory === "all"
      ? confessions
      : confessions.filter((c) => c.category === selectedCategory);

    // Filter for "mine" sort option
    if (sortBy === "mine") {
      filtered = filtered.filter(
        (c) => c.anonName === currentUser.name && c.avatar === currentUser.avatar
      );
      // Sort by newest for own posts
      return [...filtered].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    // Sort based on selected option
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
    if (!session?.user.id) {
      throw new Error("You must be signed in to post a confession.");
    }

    const { error } = await supabase.from("confessions").insert({
      content: text,
      category,
      user_id: session.user.id,
    });

    if (error) {
      console.error("Failed to save confession:", error.message);
      throw error;
    }
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
        let newFlags = { ...conf.flags };

        // Remove previous vote if exists
        if (previousVote) {
          newFlags[previousVote] = Math.max(0, newFlags[previousVote] - 1);
        }

        // If clicking same flag, just remove (toggle off)
        if (previousVote === flag) {
          return { ...conf, flags: newFlags, userFlagged: null };
        }

        // Add new vote
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
          {displayedConfessions.length === 0 ? (
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

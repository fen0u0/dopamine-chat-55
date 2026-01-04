import { useState, useMemo, useEffect } from "react";
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
  INITIAL_CONFESSIONS,
  generateAnonIdentity,
} from "@/lib/confessionData";

const STORAGE_KEY = "vibe_confessions";
const USER_ANON_KEY = "vibe_user_anon";

const loadConfessions = (): Confession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load confessions:", e);
  }
  return INITIAL_CONFESSIONS;
};

const getUserAnonIdentity = (): { name: string; avatar: string } => {
  try {
    const stored = localStorage.getItem(USER_ANON_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load user anon identity:", e);
  }
  const identity = generateAnonIdentity();
  localStorage.setItem(USER_ANON_KEY, JSON.stringify(identity));
  return identity;
};

const Confessions = () => {
  const [confessions, setConfessions] = useState<Confession[]>(loadConfessions);

  // Persist confessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(confessions));
    } catch (e) {
      console.error("Failed to save confessions:", e);
    }
  }, [confessions]);
  const [selectedCategory, setSelectedCategory] = useState<ConfessionCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("hot");

  // Filter and sort confessions
  const displayedConfessions = useMemo(() => {
    let filtered = selectedCategory === "all"
      ? confessions
      : confessions.filter((c) => c.category === selectedCategory);

    // Sort based on selected option
    switch (sortBy) {
      case "hot":
        return [...filtered].sort((a, b) => {
          const aTotal = Object.values(a.reactions).reduce((sum, v) => sum + v, 0) + a.flags.red + a.flags.green;
          const bTotal = Object.values(b.reactions).reduce((sum, v) => sum + v, 0) + b.flags.red + b.flags.green;
          return bTotal - aTotal;
        });
      case "chaotic":
        return [...filtered].sort((a, b) => b.flags.red - a.flags.red);
      case "valid":
        return [...filtered].sort((a, b) => b.flags.green - a.flags.green);
      case "new":
        return [...filtered].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      case "random":
        return [...filtered].sort(() => Math.random() - 0.5);
      default:
        return filtered;
    }
  }, [confessions, selectedCategory, sortBy]);

  // Stats
  const totalConfessions = confessions.length;
  const totalReactions = confessions.reduce((sum, c) => 
    sum + Object.values(c.reactions).reduce((s, v) => s + v, 0), 0
  );

  const handleAddConfession = (text: string, category: ConfessionCategory) => {
    const { name, avatar } = getUserAnonIdentity();
    const newConfession: Confession = {
      id: `conf-${Date.now()}`,
      anonName: name,
      avatar,
      text,
      timestamp: new Date().toISOString(),
      category,
      flags: { red: 0, green: 0 },
      reactions: { crying: 0, skull: 0, eyes: 0, fire: 0, sparkles: 0 },
      comments: [],
      userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
    };
    setConfessions([newConfession, ...confessions]);
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="confessions" showLogo={false} />
      
      <main className="max-w-lg mx-auto px-4 py-4 pt-20 space-y-4">
        {/* Stats bar */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span>📝</span>
            <span className="font-semibold text-foreground">{totalConfessions}</span>
            <span>confessions</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <span>💫</span>
            <span className="font-semibold text-foreground">{totalReactions}</span>
            <span>reactions</span>
          </span>
        </div>

        <ConfessionInput onSubmit={handleAddConfession} />
        
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <SortBar selected={sortBy} onSelect={setSortBy} />
        
        <div className="space-y-4">
          {displayedConfessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">no tea in this category yet 🫖</p>
              <p className="text-sm mt-1">be the first to spill!</p>
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

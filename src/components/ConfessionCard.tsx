import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Flag, ChevronDown, ChevronUp, Send, MoreHorizontal } from "lucide-react";
import { Confession, Comment, formatTimeAgo, getUserAnonIdentity } from "@/lib/confessionData";

const CATEGORY_STYLES: Record<string, string> = {
  crush: "bg-pink-500/20 text-pink-400",
  ick: "bg-green-500/20 text-green-400",
  regret: "bg-orange-500/20 text-orange-400",
  flex: "bg-purple-500/20 text-purple-400",
  rant: "bg-red-500/20 text-red-400",
  random: "bg-blue-500/20 text-blue-400",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  crush: "💘",
  ick: "🤢",
  regret: "😩",
  flex: "💅",
  rant: "😤",
  random: "🎲",
};

const REACTIONS: { key: keyof Confession["reactions"]; emoji: string }[] = [
  { key: "crying", emoji: "😭" },
  { key: "skull", emoji: "💀" },
  { key: "eyes", emoji: "👀" },
  { key: "fire", emoji: "🔥" },
  { key: "sparkles", emoji: "✨" },
];

const COMMENT_REACTIONS: { key: keyof Comment["reactions"]; emoji: string }[] = [
  { key: "fire", emoji: "🔥" },
  { key: "skull", emoji: "💀" },
  { key: "eyes", emoji: "👀" },
];

interface ConfessionCardProps {
  confession: Confession;
  onReact: (confessionId: string, reaction: keyof Confession["reactions"]) => void;
  onAddComment: (confessionId: string, comment: Comment) => void;
  onReactToComment: (confessionId: string, commentId: string, reaction: keyof Comment["reactions"]) => void;
  onFlag: (confessionId: string, flag: "red" | "green") => void;
}

export const ConfessionCard = ({
  confession,
  onReact,
  onAddComment,
  onReactToComment,
  onFlag,
}: ConfessionCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const currentUser = useMemo(() => getUserAnonIdentity(), []);
  const isOwnConfession = confession.anonName === currentUser.name && confession.avatar === currentUser.avatar;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const { name, avatar } = getUserAnonIdentity();
    const comment: Comment = {
      id: `com-${Date.now()}`,
      anonName: name,
      avatar,
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
      reactions: { fire: 0, skull: 0, eyes: 0 },
    };
    onAddComment(confession.id, comment);
    setNewComment("");
  };

  const totalReactions = Object.values(confession.reactions).reduce((a, b) => a + b, 0);

  const getDisplayName = (name: string, avatar: string) => {
    if (name === currentUser.name && avatar === currentUser.avatar) {
      return name;
    }
    return "anon";
  };

  return (
    <motion.div
      className="glass rounded-2xl p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
          {confession.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">
              {getDisplayName(confession.anonName, confession.avatar)}
            </span>
            {isOwnConfession && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                you
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_STYLES[confession.category]}`}>
              {CATEGORY_EMOJIS[confession.category]} {confession.category}
            </span>
            <span className="text-sm text-muted-foreground">· {formatTimeAgo(confession.timestamp)}</span>
          </div>
          <p className="text-foreground text-base mt-3 break-words leading-relaxed">{confession.text}</p>
        </div>
      </div>

      {/* Flags */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/50">
        <motion.button
          onClick={() => onFlag(confession.id, "red")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
            confession.userFlagged === "red"
              ? "bg-red-500/30 text-red-400"
              : "bg-secondary/50 text-muted-foreground hover:bg-red-500/20 hover:text-red-400"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Flag className="w-4 h-4" />
          <span>chaotic</span>
          <span className="font-medium">{confession.flags.red}</span>
        </motion.button>

        <motion.button
          onClick={() => onFlag(confession.id, "green")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
            confession.userFlagged === "green"
              ? "bg-green-500/30 text-green-400"
              : "bg-secondary/50 text-muted-foreground hover:bg-green-500/20 hover:text-green-400"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Flag className="w-4 h-4" />
          <span>valid</span>
          <span className="font-medium">{confession.flags.green}</span>
        </motion.button>

        <div className="flex-1" />

        <span className="text-sm text-muted-foreground">{totalReactions} reactions</span>
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {REACTIONS.map(({ key, emoji }) => (
          <motion.button
            key={key}
            onClick={() => onReact(confession.id, key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
              confession.userReacted?.[key]
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base">{emoji}</span>
            <span>{confession.reactions[key]}</span>
          </motion.button>
        ))}
      </div>

      {/* Comments section */}
      <div className="mt-4">
        <motion.button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{confession.comments.length} replies</span>
          {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </motion.button>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4">
                {/* Add comment */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="add a reply..."
                    className="flex-1 bg-secondary/50 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <motion.button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Comments list */}
                {confession.comments.map((comment) => {
                  const isOwnComment = comment.anonName === currentUser.name && comment.avatar === currentUser.avatar;
                  return (
                    <motion.div
                      key={comment.id}
                      className="flex gap-3 pl-3 border-l-2 border-border/50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-base">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground">
                              {getDisplayName(comment.anonName, comment.avatar)}
                            </span>
                            {isOwnComment && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                you
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">· {formatTimeAgo(comment.timestamp)}</span>
                          </div>
                          <button className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-foreground/90 mt-1 break-words">{comment.text}</p>
                        <div className="flex gap-1.5 mt-2">
                          {COMMENT_REACTIONS.map(({ key, emoji }) => (
                            <motion.button
                              key={key}
                              onClick={() => onReactToComment(confession.id, comment.id, key)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                                comment.userReacted?.[key]
                                  ? "bg-primary/20 text-primary"
                                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                              }`}
                              whileTap={{ scale: 0.9 }}
                            >
                              <span>{emoji}</span>
                              <span>{comment.reactions[key]}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

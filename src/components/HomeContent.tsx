import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { profiles as demoProfiles } from "@/data/profiles";
import { Profile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getOrCreateConversation } from "@/lib/chat";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ProfileCardExpanded from "./ProfileCardExpanded";
import { 
  Ghost, Cat, Sparkles, Moon, Flame, Coffee, Cloud, Bug, Zap, MessageCircle
} from "lucide-react";

// ==================== MOOD PARTICLES ====================
const moodParticles: Record<string, string[]> = {
  "✨ manifesting": ["✨", "🌟", "💫", "⭐"],
  "🌙 nocturnal mode": ["🌙", "⭐", "💫", "🌟"],
  "🔥 unhinged": ["🔥", "💥", "⚡", "🌶️"],
  "📖 deep thoughts": ["📖", "💭", "🧠", "✨"],
  "🎭 dramatic": ["🎭", "💅", "✨", "🌹"],
  "🎮 in my era": ["🎮", "🕹️", "⚡", "🔥"],
  "💃 slay mode": ["💃", "✨", "💅", "🔥"],
  "🎧 in the zone": ["🎧", "🎵", "🎶", "💜"],
  "☁️ floating": ["☁️", "💭", "🌙", "✨"],
  "👻 lurking": ["👻", "🌙", "💀", "🖤"],
  "🌀 unhinged hours": ["🌀", "💀", "🔥", "⚡"],
  "🥱 sleepy": ["😴", "💤", "🌙", "☁️"],
};

const MoodParticles = ({ mood }: { mood?: string }) => {
  const particles = useMemo(() => {
    if (!mood) return [];
    const emojis = moodParticles[mood] || ["✨", "💫"];
    
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: Math.random() * 40 - 20,
      y: Math.random() * 40 - 20,
      delay: i * 0.3,
      duration: 2 + Math.random() * 1,
    }));
  }, [mood]);

  if (!mood) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute text-xs"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            top: `calc(50% + ${particle.y}px)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
            y: [0, -15, -25, -35],
            x: [0, particle.x * 0.3, particle.x * 0.5, particle.x * 0.7],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeOut",
          }}
        >
          {particle.emoji}
        </motion.span>
      ))}
    </div>
  );
};

// ==================== PROFILE HOVER CARD ====================
const ProfileHoverCard = ({ profile }: { profile: Profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-48"
    >
      <div className="glass rounded-2xl p-3 border border-primary/20 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{profile.mood?.split(' ')[0] || '✨'}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
            <p className="text-[10px] text-muted-foreground">{profile.vibe}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-3">
          {profile.bio}
        </p>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary pixel-icon" />
            <span>{profile.interests?.slice(0, 2).join(', ')}</span>
          </div>
          <span className={cn("flex items-center gap-1", profile.isOnline ? "text-emerald-400" : "text-muted-foreground/60")}>
            <span className={cn("h-1.5 w-1.5", profile.isOnline ? "bg-emerald-400" : "bg-muted-foreground/50")} />
            {profile.isOnline ? "online rn" : "offline"}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 mt-3 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
            <MessageCircle className="w-3 h-3" />
            <span>tap to view</span>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 glass border-r border-b border-primary/20" />
    </motion.div>
  );
};

// ==================== MAIN GRID COMPONENT ====================
const profileIcons: Record<string, React.ElementType> = {
  "cosmic_cat": Cat,
  "sleepy_panda": Moon,
  "chaotic_bean": Flame,
  "midnight_owl": Moon,
  "fuzzy_potato": Coffee,
  "vibing_cactus": Zap,
  "lost_sock": Ghost,
  "spicy_noodle": Flame,
  "lazy_cloud": Cloud,
  "pixel_ghost": Ghost,
  "chaos_gremlin": Bug,
  "cozy_burrito": Coffee,
};

const colorClasses = {
  1: "border-muted-foreground/45 text-muted-foreground",
  2: "border-primary/60 text-primary",
  3: "border-accent/60 text-accent",
  4: "border-muted-foreground/60 text-foreground",
  5: "border-primary/80 text-primary",
};

const glowClasses = {
  1: "shadow-muted-foreground/20",
  2: "shadow-primary/20",
  3: "shadow-accent/20",
  4: "shadow-muted-foreground/20",
  5: "shadow-primary/25",
};

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-24 h-24",
};

const iconSizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const gridPositions = [
  { size: "lg" as const },
  { size: "sm" as const },
  { size: "md" as const },
  { size: "sm" as const },
  { size: "lg" as const },
  { size: "sm" as const },
  { size: "md" as const },
  { size: "sm" as const },
  { size: "lg" as const },
  { size: "sm" as const },
  { size: "md" as const },
  { size: "sm" as const },
];

interface HomeContentProps {
  userMood?: string;
  searchTerm?: string;
}

const HomeContent = ({ userMood, searchTerm = "" }: HomeContentProps) => {
  const navigate = useNavigate();
  const { profile: currentProfile } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentProfile?.id) return;

    const presenceChannel = supabase.channel("vibe-online-users", {
      config: { presence: { key: currentProfile.id } },
    });

    const syncPresence = () => {
      const state = presenceChannel.presenceState<{ user_id: string }>();
      const ids = new Set(Object.keys(state));
      setOnlineUserIds(ids);
    };

    presenceChannel
      .on("presence", { event: "sync" }, syncPresence)
      .on("presence", { event: "join" }, syncPresence)
      .on("presence", { event: "leave" }, syncPresence)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ user_id: currentProfile.id });
          syncPresence();
        }
      });

    return () => {
      void supabase.removeChannel(presenceChannel);
    };
  }, [currentProfile?.id]);

  const { data: liveProfiles = [], isLoading } = useQuery({
    queryKey: ["home-profiles", currentProfile?.id, [...onlineUserIds].sort().join(",")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar, mood, bio_currently, into_tags, onboarding_completed")
        .eq("onboarding_completed", true)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).filter((item) => item.id !== currentProfile?.id).map((item) => ({
        id: item.id,
        name: item.username,
        age: 0,
        bio: item.bio_currently || "here to vibe and connect",
        images: item.avatar ? [item.avatar] : [],
        interests: item.into_tags ?? [],
        isOnline: onlineUserIds.has(item.id),
        mood: item.mood ?? undefined,
        vibe: "good energy",
      } satisfies Profile));
    },
    enabled: Boolean(currentProfile),
  });

  const availableProfiles = liveProfiles.length > 0 ? liveProfiles : demoProfiles;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProfiles = availableProfiles.filter((p) => {
    const matchesMood = !userMood || p.mood === userMood;
    const matchesSearch = !normalizedSearch || [p.name, p.bio, p.mood, p.vibe, ...p.interests]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedSearch));
    return matchesMood && matchesSearch;
  });

  const displayProfiles = filteredProfiles.length > 0 ? filteredProfiles : [];


  const handleAvatarClick = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleMessage = async () => {
    if (!selectedProfile || !currentProfile) return;
    try {
      const conversationId = await getOrCreateConversation(currentProfile.id, selectedProfile.id);
      navigate(`/chat/${conversationId}`);
    } catch {
      toast.error("couldn't open chat, try again");
    }
  };

  const handleLike = () => {
    setSelectedProfile(null);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6 px-2">
        <AnimatePresence mode="popLayout">
          {displayProfiles.slice(0, 12).map((profile, index) => {
            const pos = gridPositions[index % gridPositions.length];
            const colorIndex = ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5;
            const IconComponent = profileIcons[profile.name] || Ghost;
            
            return (
              <motion.div
                key={profile.id}
                layout
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                <div 
                  className="relative"
                  onMouseEnter={() => setHoveredProfile(profile.id)}
                  onMouseLeave={() => setHoveredProfile(null)}
                >
                  <AnimatePresence>
                    {hoveredProfile === profile.id && (
                      <ProfileHoverCard profile={profile} />
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={() => handleAvatarClick(profile)}
                    className={cn(
                      "rounded-full flex items-center justify-center bg-background border-2 cursor-pointer relative z-10 transition-shadow duration-300",
                      sizeClasses[pos.size],
                      colorClasses[colorIndex],
                      hoveredProfile === profile.id && `shadow-lg ${glowClasses[colorIndex]}`
                    )}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      y: {
                        duration: 2 + (index % 3) * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <IconComponent className={cn(iconSizes[pos.size], "opacity-80 pixel-icon")} />
                    
                    {profile.isOnline && (
                      <motion.span 
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background z-20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>

                  <MoodParticles mood={profile.mood} />
                </div>

                <span className="text-xs text-muted-foreground font-medium truncate max-w-full">
                  {profile.name}
                </span>

                {profile.mood && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                    {profile.mood.replace(/^[^\s]+\s/, '')}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredProfiles.length === 0 && userMood && (
        <div className="text-center py-8">
          <Ghost className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">no one else vibing like you rn</p>
          <p className="text-xs text-muted-foreground/60 mt-1">showing everyone instead ✨</p>
        </div>
      )}

      <ProfileCardExpanded
        profile={selectedProfile}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onMessage={handleMessage}
        onLike={handleLike}
      />
    </>
  );
};

export default HomeContent;

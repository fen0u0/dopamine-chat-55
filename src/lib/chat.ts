import { supabase } from "@/integrations/supabase/client";

export const AVATARS = ["👻", "🐸", "🦋", "🌙", "🍄", "👽", "🐱", "🦊", "🌈", "🔮", "🐙", "🧃"];
export const REACTIONS = ["🫶", "😭", "💀", "🔥", "👀"];

const ADJ = ["cosmic", "sleepy", "chaotic", "feral", "soft", "lunar", "glitchy", "sneaky", "velvet", "static"];
const NOUN = ["potato", "cat", "moth", "ghost", "frog", "comet", "gremlin", "noodle", "pixel", "cryptid"];

export const randomAlias = () =>
  `${ADJ[Math.floor(Math.random() * ADJ.length)]}_${NOUN[Math.floor(Math.random() * NOUN.length)]}${Math.floor(Math.random() * 100)}`;

/** Aliases only: lowercase letters, numbers, underscores. No spaces = no "First Last" real names. */
export const validateAlias = (name: string): string | null => {
  if (!/^[a-z0-9_]{3,20}$/.test(name)) return "3–20 chars, lowercase letters, numbers or _ only";
  if (!/[0-9_]/.test(name)) return "add a number or _ — keep it anon, no real names 👻";
  return null;
};

export const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/** Returns an existing DM between two users, or creates one. */
export const getOrCreateConversation = async (me: string, other: string) => {
  const [user_a, user_b] = [me, other].sort();
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", user_a)
    .eq("user_b", user_b)
    .maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_a, user_b })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
};

export type ConfessionCategory = "crush" | "ick" | "regret" | "flex" | "rant" | "random";

export interface Comment {
  id: string;
  anonName: string;
  avatar: string;
  text: string;
  timestamp: string;
  reactions: { fire: number; skull: number; eyes: number };
  userReacted?: { fire: boolean; skull: boolean; eyes: boolean };
}

export interface Confession {
  id: string;
  anonName: string;
  avatar: string;
  text: string;
  timestamp: string;
  category: ConfessionCategory;
  flags: { red: number; green: number };
  reactions: { crying: number; skull: number; eyes: number; fire: number; sparkles: number };
  comments: Comment[];
  userReacted?: { crying: boolean; skull: boolean; eyes: boolean; fire: boolean; sparkles: boolean };
  userFlagged?: "red" | "green" | null;
}

const ANON_NAMES = [
  "chaotic goblin",
  "sleepy ghost",
  "unhinged potato",
  "feral cat",
  "dramatic cloud",
  "mysterious soup",
  "vibing skeleton",
  "confused penguin",
  "rogue burrito",
  "sentient meme",
  "caffeinated owl",
  "existential toast",
  "cryptic mushroom",
  "chaoticneutral",
  "main character",
  "side quest npc",
  "delulu enthusiast",
  "roman empire thinker",
];

const ANON_AVATARS = ["🦝", "👻", "🥔", "🐱", "☁️", "🍜", "💀", "🐧", "🌯", "🧠", "🦉", "🍞", "🍄", "⚡", "✨", "🎭", "🌙", "🏛️"];

export const generateAnonIdentity = () => {
  const name = ANON_NAMES[Math.floor(Math.random() * ANON_NAMES.length)];
  const avatar = ANON_AVATARS[Math.floor(Math.random() * ANON_AVATARS.length)];
  return { name, avatar };
};

export const INITIAL_CONFESSIONS: Confession[] = [
  {
    id: "conf-1",
    anonName: "chaotic goblin",
    avatar: "🦝",
    text: "i still think about that one compliment from 3 years ago at least once a week",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    category: "random",
    flags: { red: 2, green: 47 },
    reactions: { crying: 89, skull: 12, eyes: 5, fire: 23, sparkles: 156 },
    comments: [
      {
        id: "com-1",
        anonName: "sleepy ghost",
        avatar: "👻",
        text: "literally same, mine was someone saying i had nice handwriting in 8th grade",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        reactions: { fire: 34, skull: 2, eyes: 8 },
      },
    ],
    userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
  },
  {
    id: "conf-2",
    anonName: "unhinged potato",
    avatar: "🥔",
    text: "my crush liked my story and i've been unable to function since",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    category: "crush",
    flags: { red: 0, green: 89 },
    reactions: { crying: 234, skull: 45, eyes: 67, fire: 12, sparkles: 178 },
    comments: [],
    userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
  },
  {
    id: "conf-3",
    anonName: "dramatic cloud",
    avatar: "☁️",
    text: "the ick is when they pronounce 'gif' with a hard g",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    category: "ick",
    flags: { red: 156, green: 23 },
    reactions: { crying: 12, skull: 234, eyes: 89, fire: 5, sparkles: 2 },
    comments: [
      {
        id: "com-2",
        anonName: "feral cat",
        avatar: "🐱",
        text: "this is objectively wrong, it's gif not jif",
        timestamp: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
        reactions: { fire: 45, skull: 67, eyes: 12 },
      },
    ],
    userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
  },
  {
    id: "conf-4",
    anonName: "vibing skeleton",
    avatar: "💀",
    text: "i got hired at my dream company last week and haven't told anyone yet because i'm scared i'll jinx it",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    category: "flex",
    flags: { red: 3, green: 234 },
    reactions: { crying: 56, skull: 2, eyes: 12, fire: 345, sparkles: 456 },
    comments: [],
    userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
  },
  {
    id: "conf-5",
    anonName: "existential toast",
    avatar: "🍞",
    text: "why do i overshare with strangers but can't tell my friends anything real",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    category: "rant",
    flags: { red: 1, green: 567 },
    reactions: { crying: 678, skull: 45, eyes: 23, fire: 89, sparkles: 234 },
    comments: [
      {
        id: "com-3",
        anonName: "cryptic mushroom",
        avatar: "🍄",
        text: "no fr because strangers have no context and can't judge you properly",
        timestamp: new Date(Date.now() - 1000 * 60 * 250).toISOString(),
        reactions: { fire: 123, skull: 5, eyes: 34 },
      },
    ],
    userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
  },
  {
    id: "conf-6",
    anonName: "caffeinated owl",
    avatar: "🦉",
    text: "i pretend to forget things so people don't realize how much i remember about them",
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    category: "random",
    flags: { red: 12, green: 345 },
    reactions: { crying: 456, skull: 234, eyes: 567, fire: 34, sparkles: 89 },
    comments: [],
    userReacted: { crying: false, skull: false, eyes: false, fire: false, sparkles: false },
  },
];

export const formatTimeAgo = (timestamp: string): string => {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

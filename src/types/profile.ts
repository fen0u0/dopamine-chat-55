export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  interests: string[];
  isOnline?: boolean;
  verified?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}
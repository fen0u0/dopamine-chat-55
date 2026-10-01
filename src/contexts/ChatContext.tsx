import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

interface ChatState {
  [chatId: string]: Message[];
}

export interface AppNotification {
  id: string;
  type: "message";
  name: string;
  time: string;
  read: boolean;
}

interface ChatContextType {
  messages: ChatState;
  notifications: AppNotification[];
  addMessage: (chatId: string, message: Message) => void;
  initializeChat: (chatId: string, initialMessages: Message[]) => void;
  addNotification: (notification: Omit<AppNotification, "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const defaultMessages: Message[] = [
  { id: "1", text: "yo whats good 👋", sender: "them", timestamp: "10:30 AM" },
  { id: "2", text: "heyyy im doing great wbu!", sender: "me", timestamp: "10:32 AM" },
  { id: "3", text: "chillin rn, wanna hang later?", sender: "them", timestamp: "10:33 AM" },
  { id: "4", text: "yesss im so down", sender: "me", timestamp: "10:35 AM" },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatState>({});
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const initializeChat = (chatId: string, initialMessages: Message[]) => {
    setMessages((prev) => {
      if (prev[chatId]) return prev;
      return { ...prev, [chatId]: initialMessages };
    });
  };

  const addMessage = (chatId: string, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));
  };

  const addNotification = (notification: Omit<AppNotification, "read">) => {
    setNotifications((prev) => [
      { ...notification, read: false },
      ...prev.filter((item) => item.id !== notification.id),
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, read: true } : item));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <ChatContext.Provider value={{ messages, notifications, addMessage, initializeChat, addNotification, markNotificationRead, markAllNotificationsRead }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const getDefaultMessages = () => defaultMessages;

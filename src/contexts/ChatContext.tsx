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

interface ChatContextType {
  messages: ChatState;
  addMessage: (chatId: string, message: Message) => void;
  initializeChat: (chatId: string, initialMessages: Message[]) => void;
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

  return (
    <ChatContext.Provider value={{ messages, addMessage, initializeChat }}>
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

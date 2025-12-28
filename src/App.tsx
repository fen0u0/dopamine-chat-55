import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { GemsProvider } from "@/contexts/GemsContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { SettingsProvider } from "@/contexts/SettingsContext";

import Index from "./pages/Index";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Confessions from "./pages/Confessions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GemsProvider>
      <SettingsProvider>
        <ChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/confessions" element={<Confessions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

          </TooltipProvider>
        </ChatProvider>
      </SettingsProvider>
    </GemsProvider>
  </QueryClientProvider>
);

export default App;

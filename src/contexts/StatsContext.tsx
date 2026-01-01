import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface StatsState {
  messagesSent: number;
  profilesOpened: number;
}

interface StatsContextType extends StatsState {
  incrementMessages: () => void;
  incrementProfilesOpened: () => void;
  getAura: () => number;
  getEnergy: () => number;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<StatsState>(() => {
    const stored = localStorage.getItem("cupid-stats");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { messagesSent: 0, profilesOpened: 0 };
      }
    }
    return { messagesSent: 0, profilesOpened: 0 };
  });

  useEffect(() => {
    localStorage.setItem("cupid-stats", JSON.stringify(stats));
  }, [stats]);

  const incrementMessages = () => {
    setStats((prev) => ({ ...prev, messagesSent: prev.messagesSent + 1 }));
  };

  const incrementProfilesOpened = () => {
    setStats((prev) => ({ ...prev, profilesOpened: prev.profilesOpened + 1 }));
  };

  // Aura: base 100 + 10 per message sent (capped at 9999)
  const getAura = () => Math.min(100 + stats.messagesSent * 10, 9999);

  // Energy: base 20% + 5% per profile opened (capped at 100%)
  const getEnergy = () => Math.min(20 + stats.profilesOpened * 5, 100);

  return (
    <StatsContext.Provider
      value={{
        ...stats,
        incrementMessages,
        incrementProfilesOpened,
        getAura,
        getEnergy,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};

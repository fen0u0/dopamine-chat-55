import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const STREAK_REWARDS = [5, 10, 15, 20, 30, 50, 100];

interface GemsContextType {
  gems: number;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  unlockedProfiles: string[];
  unlockProfile: (profileId: string) => boolean;
  isProfileUnlocked: (profileId: string) => boolean;
  // Daily rewards
  streak: number;
  lastClaimDate: string | null;
  canClaimDaily: boolean;
  claimDailyReward: () => void;
  // Profile boost
  boostEndTime: number | null;
  activateBoost: (duration: number, cost: number) => boolean;
  isBoostActive: boolean;
}

const GemsContext = createContext<GemsContextType | undefined>(undefined);

export const GemsProvider = ({ children }: { children: ReactNode }) => {
  const [gems, setGems] = useState(25);
  const [unlockedProfiles, setUnlockedProfiles] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  const [boostEndTime, setBoostEndTime] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("gemsData");
    if (saved) {
      const data = JSON.parse(saved);
      setGems(data.gems ?? 25);
      setUnlockedProfiles(data.unlockedProfiles ?? []);
      setStreak(data.streak ?? 0);
      setLastClaimDate(data.lastClaimDate ?? null);
      setBoostEndTime(data.boostEndTime ?? null);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(
      "gemsData",
      JSON.stringify({
        gems,
        unlockedProfiles,
        streak,
        lastClaimDate,
        boostEndTime,
      })
    );
  }, [gems, unlockedProfiles, streak, lastClaimDate, boostEndTime]);

  // Check if daily reward can be claimed
  const today = new Date().toDateString();
  const canClaimDaily = lastClaimDate !== today;

  // Check if boost is active
  const isBoostActive = boostEndTime !== null && boostEndTime > Date.now();

  const addGems = (amount: number) => {
    setGems((prev) => prev + amount);
  };

  const spendGems = (amount: number) => {
    if (gems >= amount) {
      setGems((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const unlockProfile = (profileId: string) => {
    if (gems >= 10) {
      setGems((prev) => prev - 10);
      setUnlockedProfiles((prev) => [...prev, profileId]);
      return true;
    }
    return false;
  };

  const isProfileUnlocked = (profileId: string) => {
    return unlockedProfiles.includes(profileId);
  };

  const claimDailyReward = () => {
    if (!canClaimDaily) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = lastClaimDate === yesterday.toDateString();

    // Update streak
    const newStreak = wasYesterday ? streak + 1 : 1;
    setStreak(newStreak);

    // Calculate reward
    const rewardIndex = Math.min(newStreak - 1, STREAK_REWARDS.length - 1);
    const reward = STREAK_REWARDS[rewardIndex];

    // Add gems and update claim date
    addGems(reward);
    setLastClaimDate(today);
  };

  const activateBoost = (duration: number, cost: number) => {
    if (gems < cost) return false;
    
    spendGems(cost);
    const endTime = Date.now() + duration * 60 * 1000;
    setBoostEndTime(endTime);
    return true;
  };

  return (
    <GemsContext.Provider
      value={{
        gems,
        addGems,
        spendGems,
        unlockedProfiles,
        unlockProfile,
        isProfileUnlocked,
        streak,
        lastClaimDate,
        canClaimDaily,
        claimDailyReward,
        boostEndTime,
        activateBoost,
        isBoostActive,
      }}
    >
      {children}
    </GemsContext.Provider>
  );
};

export const useGems = () => {
  const context = useContext(GemsContext);
  if (!context) {
    throw new Error("useGems must be used within a GemsProvider");
  }
  return context;
};

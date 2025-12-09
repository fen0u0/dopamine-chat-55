import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsState {
  // Notifications
  notifications: boolean;
  messageNotifs: boolean;
  matchNotifs: boolean;
  // Sounds & Haptics
  sounds: boolean;
  vibration: boolean;
  // Appearance
  darkMode: boolean;
  // Privacy
  showOnline: boolean;
  showTimezone: boolean;
  readReceipts: boolean;
  typingIndicator: boolean;
  // Quirky settings
  chaoticMode: boolean;
  unhingedReplies: boolean;
  cryptidMode: boolean;
  goblinHours: boolean;
}

interface SettingsContextType extends SettingsState {
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  resetSettings: () => void;
}

const defaultSettings: SettingsState = {
  notifications: true,
  messageNotifs: true,
  matchNotifs: true,
  sounds: true,
  vibration: true,
  darkMode: true,
  showOnline: true,
  showTimezone: true,
  readReceipts: true,
  typingIndicator: true,
  chaoticMode: false,
  unhingedReplies: false,
  cryptidMode: false,
  goblinHours: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const stored = localStorage.getItem("cupid-settings");
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem("cupid-settings", JSON.stringify(settings));
  }, [settings]);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

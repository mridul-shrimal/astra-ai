import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import defaultSettings from "./defaultSettings";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...JSON.parse(
      localStorage.getItem("astra-settings") || "{}"
    ),
  }));

  const setSetting = (key, value) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      localStorage.setItem(
        "astra-settings",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const value = useMemo(
  () => ({
    // Raw settings (optional)
    settings,

    // Privacy
    saveHistory: settings.saveHistory,
    setSaveHistory: (value) =>
      setSetting("saveHistory", value),

    deleteConfirmation:
      settings.deleteConfirmation,
    setDeleteConfirmation: (value) =>
      setSetting(
        "deleteConfirmation",
        value
      ),

    autoLock: settings.autoLock,
    setAutoLock: (value) =>
      setSetting("autoLock", value),

    appPin: settings.appPin,
    setAppPin: (value) =>
      setSetting("appPin", value),

    // Generic setter (keep for future)
    setSetting,
  }),
  [settings]
);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}
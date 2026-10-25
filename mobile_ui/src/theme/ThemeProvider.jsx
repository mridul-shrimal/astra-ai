import { createContext, useContext, useEffect, useState } from "react";

import { useColorScheme } from "react-native";

import { darkColor, lightColor } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { radius } from "./radius";
import { loadPreferences, savePreferences, defaultPreferences } from "../storage/preferences";

const ThemeContext = createContext({
  colors: darkColor,
  spacing,
  typography,
  radius,
  theme: "dark",
  colorScheme: "dark",
  updateTheme: () => {},
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(systemColorScheme || "dark");
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    let active = true;

    loadPreferences()
      .then((stored) => {
        if (active) {
          setPreferences(stored);
        }
      })
      .catch(() => {})

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (preferences.theme === "system") {
      const scheme = systemColorScheme || "dark";
      setColorScheme(scheme);
    } else {
      setColorScheme(preferences.theme);
    }
  }, [preferences.theme, systemColorScheme]);

  const updateTheme = (newTheme) => {
    const updated = { ...preferences, theme: newTheme };
    setPreferences(updated);
    savePreferences(updated).catch(() => {});
  };

  const themeColors = colorScheme === "light" ? lightColor : darkColor;

  return (
    <ThemeContext.Provider
      value={{
        colors: themeColors,
        spacing,
        typography,
        radius,
        theme: colorScheme,
        colorScheme,
        updateTheme,
        preferences,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

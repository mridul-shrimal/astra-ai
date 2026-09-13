import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

import { darkColors, lightColors } from "./colors";
import { radius, spacing } from "./spacing";
import { typography } from "./typography";

const ThemeContext = createContext(null);

export function ThemeProvider({ preference, children }) {
  const systemColorScheme = useColorScheme();
  const mode =
    preference === "system" ? systemColorScheme || "dark" : preference;
  const colors = mode === "light" ? lightColors : darkColors;

  const value = useMemo(
    () => ({ mode, colors, spacing, radius, typography }),
    [mode, colors]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return theme;
}

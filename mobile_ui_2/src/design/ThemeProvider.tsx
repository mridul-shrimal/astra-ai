import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { resolveTheme, type ThemePreference } from "../features/settings/preferences";
import { darkTheme, lightTheme, type ThemeTokens } from "./tokens";
type ThemeContextValue = { theme: ThemeTokens; preference: ThemePreference; setPreference: (preference: ThemePreference) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
export function ThemeProvider({ children }: { children: ReactNode }) { const systemScheme = useColorScheme(); const [preference, setPreference] = useState<ThemePreference>("system"); const theme = resolveTheme(preference, systemScheme) === "dark" ? darkTheme : lightTheme; const value = useMemo(() => ({ theme, preference, setPreference }), [theme, preference]); return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>; }
export function useTheme() { const context = useContext(ThemeContext); if (!context) throw new Error("useTheme must be used within ThemeProvider."); return context; }

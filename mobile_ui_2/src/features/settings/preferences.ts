import type { ColorSchemeName } from "react-native";
export type ThemePreference = "system" | "light" | "dark";
export function resolveTheme(preference: ThemePreference, systemScheme: ColorSchemeName): "light" | "dark" { return preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference; }

import { Text, View } from "react-native";
import { Screen } from "../design/components/Screen";
import { useTheme } from "../design/ThemeProvider";
export function HomePlaceholderScreen() { const { theme } = useTheme(); return <Screen><View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 10 }}><Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: "800" }}>Welcome to Astra AI</Text><Text style={{ color: theme.colors.textMuted, fontSize: 16 }}>Your chat workspace will arrive in the next phase.</Text></View></Screen>; }

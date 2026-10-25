import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Screen } from "./Screen";
import { useTheme } from "../ThemeProvider";
export function LoadingScreen({ label = "Loading Astra AI…" }: { label?: string }) { const { theme } = useTheme(); return <Screen><View style={styles.content}><ActivityIndicator size="large" color={theme.colors.primary} /><Text style={{ color: theme.colors.textMuted, marginTop: 16 }}>{label}</Text></View></Screen>; }
const styles = StyleSheet.create({ content: { flex: 1, alignItems: "center", justifyContent: "center" } });

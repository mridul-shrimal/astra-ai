import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "./AppButton";
import { Screen } from "./Screen";
import { useTheme } from "../ThemeProvider";
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) { const { theme } = useTheme(); return <Screen><View style={styles.content}><Text style={[styles.title, { color: theme.colors.text }]}>Astra AI needs attention</Text><Text style={[styles.message, { color: theme.colors.textMuted }]}>{message}</Text>{onRetry ? <AppButton label="Try again" onPress={onRetry} /> : null}</View></Screen>; }
const styles = StyleSheet.create({ content: { flex: 1, justifyContent: "center", padding: 24, gap: 16 }, title: { fontSize: 22, fontWeight: "800" }, message: { fontSize: 16, lineHeight: 23 } });

import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../design/components/AppButton";
import { Screen } from "../design/components/Screen";
import { useTheme } from "../design/ThemeProvider";
import type { ThemePreference } from "../features/settings/preferences";
import { useAuth } from "../features/auth/AuthProvider";
export function SettingsPlaceholderScreen() { const { theme, preference, setPreference } = useTheme(); const { session, signOut } = useAuth(); const choices: ThemePreference[] = ["system", "light", "dark"]; return <Screen><View style={styles.content}><Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text><Text style={{ color: theme.colors.textMuted }}>{session?.user.email}</Text><Text style={[styles.label, { color: theme.colors.text }]}>Appearance</Text><View style={styles.choices}>{choices.map((choice) => <AppButton key={choice} label={`${preference === choice ? "✓ " : ""}${choice[0].toUpperCase()}${choice.slice(1)}`} onPress={() => setPreference(choice)} variant={preference === choice ? "primary" : "secondary"} />)}</View><View style={{ marginTop: "auto" }}><AppButton label="Sign out" onPress={() => { void signOut(); }} variant="secondary" /></View></View></Screen>; }
const styles = StyleSheet.create({ content: { flex: 1, padding: 24, gap: 16 }, title: { fontSize: 28, fontWeight: "800" }, label: { marginTop: 16, fontSize: 17, fontWeight: "700" }, choices: { gap: 10 } });

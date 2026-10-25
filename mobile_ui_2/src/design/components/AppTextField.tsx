import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { useTheme } from "../ThemeProvider";
export function AppTextField({ label, ...props }: TextInputProps & { label: string }) { const { theme } = useTheme(); return <View style={styles.wrapper}><Text style={{ color: theme.colors.textMuted, fontWeight: "600", marginBottom: 7 }}>{label}</Text><TextInput placeholderTextColor={theme.colors.textMuted} style={[styles.input, { backgroundColor: theme.colors.input, borderColor: theme.colors.border, color: theme.colors.text }]} {...props} /></View>; }
const styles = StyleSheet.create({ wrapper: { width: "100%" }, input: { minHeight: 52, borderWidth: 1, borderRadius: 16, paddingHorizontal: 15, fontSize: 16 } });

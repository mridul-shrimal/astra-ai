import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../ThemeProvider";
export function Screen({ children, style }: { children: ReactNode; style?: ViewStyle }) { const { theme } = useTheme(); return <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}><View style={[styles.content, style]}>{children}</View></SafeAreaView>; }
const styles = StyleSheet.create({ safeArea: { flex: 1 }, content: { flex: 1 } });

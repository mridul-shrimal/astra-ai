import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";
import { useTheme } from "../design/ThemeProvider";
import { HomePlaceholderScreen } from "../screens/HomePlaceholderScreen";
import { SettingsPlaceholderScreen } from "../screens/SettingsPlaceholderScreen";
const Stack = createNativeStackNavigator();
export function AppNavigator() { const { theme } = useTheme(); return <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: theme.colors.surface }, headerTintColor: theme.colors.text, contentStyle: { backgroundColor: theme.colors.background } }}><Stack.Screen name="Home" component={HomePlaceholderScreen} options={({ navigation }) => ({ title: "Astra AI", headerRight: () => <Pressable accessibilityRole="button" onPress={() => navigation.navigate("Settings")}><Text style={{ color: theme.colors.primary, fontWeight: "700" }}>Settings</Text></Pressable> })} /><Stack.Screen name="Settings" component={SettingsPlaceholderScreen} /></Stack.Navigator>; }

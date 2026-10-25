import { TouchableOpacity, StyleSheet } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import MemoryScreen from "../screens/MemoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AuthScreen from "../screens/AuthScreen";
import { useSidebar } from "../context/SidebarContext";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";

const Stack = createNativeStackNavigator();

function HeaderMenuButton() {
  const { openSidebar } = useSidebar();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={openSidebar}
      activeOpacity={0.7}
      style={styles.menuBtn}
    >
      <Ionicons name="menu" size={24} color={colors.text} />
    </TouchableOpacity>
  );
}

export function AppNavigator() {
  const { colors, radius } = useTheme();
  const { auth } = useAppContext();
  const { session } = auth;

  if (session === undefined) {
    return null;
  }

  const isAuthenticated = !!session;

  return (
    <Stack.Navigator
      key={isAuthenticated ? "authenticated" : "unauthenticated"}
      initialRouteName={isAuthenticated ? "Home" : "Auth"}
      screenOptions={{
        headerLeft: () => <HeaderMenuButton />,
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
          fontSize: 18,
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: "slide_from_right",
      }}
    >
      {!isAuthenticated && (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false, animation: "fade" }}
        />
      )}

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Astra AI" }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="Memory"
        component={MemoryScreen}
        options={{ title: "Memory" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  menuBtn: {
    marginRight: 12,
    padding: 10,
  },
});

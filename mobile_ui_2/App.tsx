import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/features/auth/AuthProvider";
import { ThemeProvider } from "./src/design/ThemeProvider";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

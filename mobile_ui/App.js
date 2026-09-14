import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "./src/theme/ThemeProvider";
import { SidebarProvider, AppNavigation } from "./src/navigation";
import { AppProvider } from "./src/context/AppContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <SidebarProvider>
            <AppNavigation />
          </SidebarProvider>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

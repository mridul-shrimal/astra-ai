import { createContext, useCallback, useContext, useState } from "react";

import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";

import { AppNavigator } from "../navigation/AppNavigator";
import Sidebar from "../components/Sidebar";

export const NavigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (NavigationRef.isReady()) {
    NavigationRef.navigate(name, params);
  }
}

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function AppNavigation() {
  const [currentRoute, setCurrentRoute] = useState("Home");

  return (
    <NavigationContainer
      ref={NavigationRef}
      onStateChange={(state) => {
        const route = state?.routes?.[state.index ?? 0]?.name;
        setCurrentRoute(route || "Home");
      }}
    >
      <AppNavigator />
      <Sidebar currentRoute={currentRoute} />
    </NavigationContainer>
  );
}

import { NavigationContainer } from "@react-navigation/native";
import { ErrorState } from "../design/components/ErrorState";
import { LoadingScreen } from "../design/components/LoadingScreen";
import { useAuth } from "../features/auth/AuthProvider";
import { AppNavigator } from "./AppNavigator";
import { AuthNavigator } from "./AuthNavigator";
export function RootNavigator() { const { session, isRestoring, error } = useAuth(); if (isRestoring) return <LoadingScreen label="Restoring your secure session…" />; if (error && !session) return <ErrorState message={error.message} />; return <NavigationContainer>{session ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>; }

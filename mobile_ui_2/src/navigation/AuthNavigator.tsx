import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreen } from "../features/auth/AuthScreen";
const Stack = createNativeStackNavigator();
export function AuthNavigator() { return <Stack.Navigator screenOptions={{ headerShown: false }}><Stack.Screen name="SignIn" component={AuthScreen} /></Stack.Navigator>; }

import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "./supabase";
import { api } from "./api";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Signup failed", error.message);
    } else {
      Alert.alert(
        "Signup successful",
        "Check your email if confirmation is enabled."
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const testBackend = async () => {
    try {
      const response = await api.get("/conversations");

      console.log("CONVERSATIONS RESPONSE:", response.data);

      Alert.alert(
        "Authenticated Backend Connected",
        `Conversations: ${response.data.conversations?.length ?? 0}`
      );
    } catch (error) {
      console.log(
        "CONVERSATIONS ERROR:",
        error.response?.status,
        error.response?.data || error.message
      );

      Alert.alert(
        "Backend Error",
        error.response?.data?.message ||
          `HTTP ${error.response?.status || "unknown"}`
      );
    }
  };

  if (session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Astra AI</Text>

          <Text style={styles.loggedIn}>Logged in as:</Text>

          <Text style={styles.email}>{session.user.email}</Text>

          <View style={styles.button}>
            <Button title="Test Backend" onPress={testBackend} />
          </View>

          <View style={styles.button}>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Astra AI</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.button}>
          <Button title="Login" onPress={handleLogin} />
        </View>

        <View style={styles.button}>
          <Button title="Create Account" onPress={handleSignup} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  button: {
    marginTop: 10,
  },

  loggedIn: {
    fontSize: 16,
    textAlign: "center",
  },

  email: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 25,
  },
});
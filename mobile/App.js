import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "./supabase";
import { api } from "./api";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

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

  useEffect(() => {
    if (session) {
      loadConversations();
    } else {
      setConversations([]);
      setSelectedConversation(null);
    }
  }, [session]);

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

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);

      const response = await api.get("/conversations");

      setConversations(response.data.conversations || []);
    } catch (error) {
      console.log(
        "LOAD CONVERSATIONS ERROR:",
        error.response?.status,
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Could not load conversations."
      );
    } finally {
      setLoadingConversations(false);
    }
  };

  const createConversation = async () => {
    try {
      const response = await api.post("/conversations");

      const newConversation = response.data.conversation;

      setConversations((current) => [
        newConversation,
        ...current,
      ]);

      openConversation(newConversation);
    } catch (error) {
      console.log(
        "CREATE CONVERSATION ERROR:",
        error.response?.status,
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Could not create conversation."
      );
    }
  };

  const openConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      setMessages([]);
      setLoadingMessages(true);

      const response = await api.get(
        `/conversations/${conversation.session_id}/messages`
      );

      setMessages(response.data.messages || []);
    } catch (error) {
      console.log(
        "LOAD MESSAGES ERROR:",
        error.response?.status,
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Could not load messages."
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  const renderConversation = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.conversation}
        onPress={() => openConversation(item)}
      >
        <Text style={styles.conversationTitle}>
          {item.title || "Untitled conversation"}
        </Text>

        <Text style={styles.conversationDate}>
          {item.updated_at || item.created_at || ""}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }) => {
    const text =
      item.content ||
      item.message ||
      item.text ||
      "";

    return (
      <View style={styles.message}>
        <Text style={styles.messageText}>{text}</Text>
      </View>
    );
  };

  if (session && selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={
            Platform.OS === "ios" ? "padding" : undefined
          }
        >
          <View style={styles.chatHeader}>
            <Button
              title="← Back"
              onPress={() => {
                setSelectedConversation(null);
                setMessages([]);
              }}
            />

            <Text style={styles.chatTitle}>
              {selectedConversation.title || "New Chat"}
            </Text>

            <View style={{ width: 60 }} />
          </View>

          {loadingMessages ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              style={styles.messagesList}
              data={messages}
              keyExtractor={(item, index) =>
                String(item.id || index)
              }
              renderItem={renderMessage}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  No messages yet.
                </Text>
              }
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Astra AI</Text>
            <Text style={styles.subtitle}>
              {session.user.email}
            </Text>
          </View>

          <Button title="Logout" onPress={handleLogout} />
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            Your Conversations
          </Text>

          {loadingConversations ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={(item) =>
                String(item.id || item.session_id)
              }
              renderItem={renderConversation}
              refreshing={loadingConversations}
              onRefresh={loadConversations}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  No conversations yet.
                </Text>
              }
            />
          )}
        </View>

        <View style={styles.newChat}>
          <Button
            title="+ New Chat"
            onPress={createConversation}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginCard}>
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
          <Button
            title="Create Account"
            onPress={handleSignup}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  loginCard: {
    flex: 1,
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 4,
    color: "#666",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },

  conversation: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },

  conversationTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  conversationDate: {
    marginTop: 6,
    color: "#777",
    fontSize: 12,
  },

  newChat: {
    marginTop: 15,
    marginBottom: 10,
  },

  chatContainer: {
    flex: 1,
  },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },

  messagesList: {
    flex: 1,
    marginTop: 15,
  },

  message: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },

  messageText: {
    fontSize: 16,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
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
});
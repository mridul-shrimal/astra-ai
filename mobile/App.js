import React, { useState } from "react";

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
import api from "./api";

import useAuth from "./hooks/useAuth";
import useAuthActions from "./hooks/useAuthActions";
import useConversations from "./hooks/useConversations";
import useMessages from "./hooks/useMessages";
import useChat from "./hooks/useChat";

export default function App() {
  // =========================================================
  // AUTH INPUT
  // =========================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================================================
  // AUTH SESSION
  // =========================================================

  const {
    session,
    loading: authSessionLoading,
  } = useAuth();

  // =========================================================
  // AUTH ACTIONS
  // =========================================================

  const {
    login,
    register,
    authLoading,
  } = useAuthActions();

  // =========================================================
  // CONVERSATIONS
  // =========================================================

  const {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    loadingConversations,
    loadConversations,
  } = useConversations(session);

  // =========================================================
  // MESSAGES
  // =========================================================

  const {
    messages,
    setMessages,
    loadingMessages,
  } = useMessages(
    session,
    selectedConversation
  );

  // =========================================================
  // CHAT
  // =========================================================

  const {
    messageText,
    setMessageText,
    sendMessage,
    isSending,
  } = useChat({
    session,
    selectedConversation,
    setMessages,
  });

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    const result = await login(
      email.trim(),
      password
    );

    if (!result.success) {
      Alert.alert(
        "Login failed",
        result.message || "Login failed."
      );

      return;
    }

    console.log("✅ LOGIN SUCCESS");

    setPassword("");
  };

  // =========================================================
  // SIGNUP
  // =========================================================

  const handleSignup = async () => {
    const result = await register(
      email.trim(),
      password
    );

    if (!result.success) {
      Alert.alert(
        "Signup failed",
        result.message || "Signup failed."
      );

      return;
    }

    Alert.alert(
      "Signup successful",
      "Your account has been created. Please check your email if confirmation is required."
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setSelectedConversation(null);
      setMessages([]);
      setEmail("");
      setPassword("");

      console.log("✅ LOGOUT SUCCESS");
    } catch (error) {
      console.log(
        "❌ LOGOUT ERROR:",
        error.message
      );

      Alert.alert(
        "Logout failed",
        error.message || "Could not logout."
      );
    }
  };

  // =========================================================
  // CREATE CONVERSATION
  // =========================================================

  const createConversation = async () => {
    try {
      const response = await api.post(
        "/conversations"
      );

      const newConversation =
        response.data?.conversation;

      if (!newConversation) {
        throw new Error(
          "Conversation was not returned by the server."
        );
      }

      setConversations((current) => [
        newConversation,
        ...current,
      ]);

      openConversation(newConversation);
    } catch (error) {
      console.log(
        "CREATE CONVERSATION ERROR:",
        error.response?.status,
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Could not create conversation."
      );
    }
  };

  // =========================================================
  // OPEN CONVERSATION
  // =========================================================

  const openConversation = (
    conversation
  ) => {
    setSelectedConversation(conversation);
  };

  // =========================================================
  // RENDER CONVERSATION
  // =========================================================

  const renderConversation = ({
    item,
  }) => {
    return (
      <TouchableOpacity
        style={styles.conversation}
        onPress={() =>
          openConversation(item)
        }
      >
        <Text style={styles.conversationTitle}>
          {item.title ||
            "Untitled conversation"}
        </Text>

        <Text style={styles.conversationDate}>
          {item.updated_at ||
            item.created_at ||
            ""}
        </Text>
      </TouchableOpacity>
    );
  };

  // =========================================================
  // RENDER MESSAGE
  // =========================================================

  const renderMessage = ({ item }) => {
    const text =
      item.content ||
      item.message ||
      item.text ||
      "";

    return (
      <View style={styles.message}>
        <Text style={styles.messageText}>
          {text}
        </Text>
      </View>
    );
  };

  // =========================================================
  // AUTH SESSION LOADING
  // =========================================================

  if (authSessionLoading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading Astra...
        </Text>
      </SafeAreaView>
    );
  }

  // =========================================================
  // CHAT SCREEN
  // =========================================================

  if (
    session &&
    selectedConversation
  ) {
    return (
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <SafeAreaView
          style={styles.chatContainer}
        >
          {/* HEADER */}

          <View style={styles.chatHeader}>
            <Button
              title="← Back"
              onPress={() => {
                setSelectedConversation(
                  null
                );
                setMessages([]);
              }}
            />

            <Text
              style={styles.chatTitle}
            >
              {selectedConversation.title ||
                "New Chat"}
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* MESSAGES */}

          {loadingMessages ? (
            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
              />

              <Text
                style={styles.loadingText}
              >
                Loading messages...
              </Text>
            </View>
          ) : (
            <FlatList
              style={styles.messagesList}
              data={messages}
              keyExtractor={(
                item,
                index
              ) =>
                String(
                  item.id || index
                )
              }
              renderItem={
                renderMessage
              }
              contentContainerStyle={
                styles.messagesContent
              }
              ListEmptyComponent={
                <Text
                  style={styles.empty}
                >
                  No messages yet.
                </Text>
              }
            />
          )}

          {/* INPUT */}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.messageInput}
              placeholder="Message Astra..."
              value={messageText}
              onChangeText={
                setMessageText
              }
              multiline
              editable={!isSending}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                isSending &&
                  styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator
                  size="small"
                />
              ) : (
                <Text
                  style={
                    styles.sendButtonText
                  }
                >
                  Send
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  // =========================================================
  // LOGGED-IN HOME SCREEN
  // =========================================================

  if (session) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text
              style={styles.appTitle}
            >
              Astra AI
            </Text>

            <Text
              style={styles.userEmail}
            >
              {session.user.email}
            </Text>
          </View>

          <Button
            title="Logout"
            onPress={handleLogout}
          />
        </View>

        {/* CONVERSATIONS */}

        <View style={styles.content}>
          <Text
            style={styles.sectionTitle}
          >
            Your Conversations
          </Text>

          {loadingConversations ? (
            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
              />
            </View>
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={(item) =>
                String(
                  item.id ||
                    item.session_id
                )
              }
              renderItem={
                renderConversation
              }
              refreshing={
                loadingConversations
              }
              onRefresh={
                loadConversations
              }
              ListEmptyComponent={
                <Text
                  style={styles.empty}
                >
                  No conversations yet.
                </Text>
              }
            />
          )}
        </View>

        {/* NEW CHAT */}

        <View style={styles.newChat}>
          <Button
            title="+ New Chat"
            onPress={
              createConversation
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================
  // LOGIN / REGISTER SCREEN
  // =========================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.authContainer}>
        <Text
          style={styles.appTitle}
        >
          Astra AI
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!authLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!authLoading}
        />

        <View style={styles.button}>
          <Button
            title={
              authLoading
                ? "Logging in..."
                : "Login"
            }
            onPress={handleLogin}
            disabled={authLoading}
          />
        </View>

        <View style={styles.button}>
          <Button
            title={
              authLoading
                ? "Creating..."
                : "Create Account"
            }
            onPress={handleSignup}
            disabled={authLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  appTitle: {
    fontSize: 28,
    fontWeight: "700",
  },

  userEmail: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },

  content: {
    flex: 1,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },

  conversation: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },

  conversationTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  conversationDate: {
    marginTop: 5,
    fontSize: 12,
    color: "#777",
  },

  newChat: {
    padding: 16,
  },

  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  chatHeader: {
    minHeight: 60,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  chatTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  headerSpacer: {
    width: 60,
  },

  messagesList: {
    flex: 1,
  },

  messagesContent: {
    padding: 16,
    flexGrow: 1,
  },

  message: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
  },

  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  messageInput: {
    flex: 1,
    minHeight: 45,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },

  sendButton: {
    minHeight: 45,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  authContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },

  button: {
    marginTop: 15,
  },
});
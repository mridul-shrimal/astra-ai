import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "./supabase";
import api from "./api";

import useAuth from "./hooks/useAuth";
import useAuthActions from "./hooks/useAuthActions";
import useConversations from "./hooks/useConversations/useConversations";
import useMessages from "./hooks/useMessages";
import useChat from "./hooks/useChat";
import ConversationManagement from "./src/components/ConversationManagement";

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
// RENAME CONVERSATION STATE
// =========================================================

const [renameConversationTarget, setRenameConversationTarget] =
  useState(null);

const [renameText, setRenameText] =
  useState("");

 // =========================================================
// CONVERSATION MANAGEMENT
// =========================================================

const {
  conversations,
  setConversations,

  selectedConversation,
  setSelectedConversation,

  loadingConversations,
  actionLoading,

  loadConversations,

  createConversation,
  openConversation,

  renameConversation,
  deleteConversation,
  confirmDeleteConversation,
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
  const cleanEmail = email.trim();

  if (!cleanEmail || !password) {
    Alert.alert(
      "Missing Information",
      "Please enter your email and password."
    );
    return;
  }

  const result = await login(
    cleanEmail,
    password
  );

  if (!result.success) {
    Alert.alert(
      "Login Failed",
      result.message ||
        "Unable to log in. Please check your credentials and try again."
    );

    return;
  }

  setPassword("");
};

// =========================================================
// SIGNUP
// =========================================================

const handleSignup = async () => {
  const cleanEmail = email.trim();

  if (!cleanEmail || !password) {
    Alert.alert(
      "Missing Information",
      "Please enter your email and password."
    );
    return;
  }

  if (password.length < 6) {
    Alert.alert(
      "Password Too Short",
      "Your password must be at least 6 characters long."
    );
    return;
  }

  const result = await register(
    cleanEmail,
    password
  );

  if (!result.success) {
    Alert.alert(
      "Signup Failed",
      result.message ||
        "Unable to create your account. Please try again."
    );

    return;
  }

  setPassword("");

  Alert.alert(
    "Account Created 🎉",
    "Your Astra AI account has been created successfully. Please check your email if confirmation is required."
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
  } catch (error) {
    Alert.alert(
      "Logout Failed",
      error.message ||
        "Could not log out. Please try again."
    );
  }
};

// =========================================================
// RENDER CONVERSATION
// =========================================================

const renderConversation = ({ item }) => {
  const title =
    item?.title?.trim() ||
    "New Conversation";

  const date =
    item?.updated_at ||
    item?.created_at ||
    "";

  const isSelected =
    selectedConversation?.session_id ===
    item?.session_id;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.conversation,
        isSelected &&
          styles.conversationSelected,
      ]}
      onPress={() => openConversation(item)}
    >
      <View style={styles.conversationContent}>
        <Text
          style={[
            styles.conversationTitle,
            isSelected &&
              styles.conversationTitleSelected,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        {!!date && (
          <Text
            style={styles.conversationDate}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {date}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};


// =========================================================
// RENDER MESSAGE
// =========================================================

const renderMessage = ({ item }) => {
  const text =
    item?.content ||
    item?.message ||
    item?.text ||
    "";

  const cleanText =
    typeof text === "string"
      ? text.trim()
      : String(text || "").trim();

  if (!cleanText) {
    return null;
  }

  return (
    <View style={styles.message}>
      <Text style={styles.messageText}>
        {cleanText}
      </Text>
    </View>
  );
};

  // =========================================================
// AUTH SESSION LOADING
// =========================================================

if (authSessionLoading) {
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator
        size="large"
        color="#22d3ee"
      />

      <Text style={styles.loadingText}>
        Loading Astra...
      </Text>
    </SafeAreaView>
  );
}


// =========================================================
// CHAT SCREEN
// =========================================================

if (session && selectedConversation) {
  const conversationTitle =
    selectedConversation?.title?.trim() ||
    "New Chat";

  return (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      <SafeAreaView style={styles.chatContainer}>

        {/* =================================================
            CHAT HEADER
        ================================================= */}

        <View style={styles.chatHeader}>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backButton}
            onPress={() => {
              setSelectedConversation(null);
              setMessages([]);
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back to conversations"
          >
            <Text style={styles.backButtonText}>
              ‹
            </Text>

            <Text style={styles.backButtonLabel}>
              Back
            </Text>
          </TouchableOpacity>


          <View style={styles.chatHeaderCenter}>
            <Text
              style={styles.chatTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {conversationTitle}
            </Text>

            <Text style={styles.chatSubtitle}>
              Astra AI
            </Text>
          </View>


          {/* Keeps the title perfectly centered */}
          <View style={styles.headerSpacer} />

        </View>

          {/* =================================================
    MESSAGES
================================================= */}

{loadingMessages ? (
  <View style={styles.loading}>
    <ActivityIndicator
      size="large"
      color="#22d3ee"
    />

    <Text style={styles.loadingText}>
      Loading messages...
    </Text>
  </View>
) : (
  <FlatList
    style={styles.messagesList}
    data={messages}
    keyExtractor={(item, index) =>
      String(item.id || `${item.created_at || "message"}-${index}`)
    }
    renderItem={renderMessage}
    contentContainerStyle={[
      styles.messagesContent,
      messages.length === 0 &&
        styles.messagesEmptyContent,
    ]}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode={
      Platform.OS === "ios"
        ? "interactive"
        : "on-drag"
    }
    showsVerticalScrollIndicator={false}
    removeClippedSubviews={Platform.OS === "android"}
    initialNumToRender={20}
    maxToRenderPerBatch={10}
    windowSize={7}
    ListEmptyComponent={
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>
          ✦
        </Text>

        <Text style={styles.emptyTitle}>
          Start a conversation
        </Text>

        <Text style={styles.empty}>
          Ask Astra anything.
        </Text>
      </View>
    }
  />
)}


{/* =================================================
    MESSAGE INPUT
================================================= */}

<View style={styles.inputContainer}>
  <View style={styles.inputRow}>

    <TextInput
      style={styles.messageInput}
      placeholder="Message Astra..."
      placeholderTextColor="#64748b"
      value={messageText}
      onChangeText={setMessageText}
      multiline
      maxLength={4000}
      editable={!isSending}
      textAlignVertical="top"
      returnKeyType="send"
      blurOnSubmit={false}
      keyboardAppearance="dark"
      autoCorrect
      spellCheck
      accessibilityLabel="Message Astra"
    />

    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.sendButton,
        isSending &&
          styles.sendButtonDisabled,
      ]}
      onPress={sendMessage}
      disabled={isSending}
      accessibilityRole="button"
      accessibilityLabel={
        isSending
          ? "Sending message"
          : "Send message"
      }
    >
      {isSending ? (
        <ActivityIndicator
          size="small"
          color="#ffffff"
        />
      ) : (
        <Text style={styles.sendButtonText}>
          ↑
        </Text>
      )}
    </TouchableOpacity>

  </View>

  <Text style={styles.inputHint}>
    Astra AI can make mistakes. Check important information.
  </Text>
</View>

</SafeAreaView>
</KeyboardAvoidingView>
);
}

// =========================================================
// RENAME CONVERSATION HANDLER
// =========================================================

const handleRenameConversation = (
  conversation
) => {
  if (!conversation?.session_id) {
    return;
  }

  console.log(
    "✏️ RENAME CLICKED:",
    conversation.session_id
  );

  setRenameConversationTarget(
    conversation
  );

  setRenameText(
    conversation.title?.trim() ||
      "New Chat"
  );
};

  // =========================================================
// LOGGED-IN HOME SCREEN
// =========================================================

if (session) {
  const userEmail =
    session?.user?.email || "Astra User";

  return (
    <SafeAreaView style={styles.container}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>
              ✦
            </Text>
          </View>

          <View style={styles.headerBrandText}>
            <Text style={styles.appTitle}>
              Astra AI
            </Text>

            <Text
              style={styles.userEmail}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userEmail}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={authLoading}
          accessibilityRole="button"
          accessibilityLabel="Log out of Astra AI"
        >
          <Text style={styles.logoutButtonText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>


      {/* =================================================
    CONVERSATION MANAGEMENT
================================================= */}

<View style={styles.content}>
<ConversationManagement
  conversations={conversations}
  selectedConversation={selectedConversation}
  loadingConversations={loadingConversations}
  actionLoading={actionLoading}
  onOpenConversation={openConversation}
  onRefresh={loadConversations}
  onNewChat={createConversation}
  onRenameConversation={handleRenameConversation}
/>
{/* =================================================
    RENAME CONVERSATION MODAL
================================================= */}

<Modal
  visible={!!renameConversationTarget}
  transparent
  animationType="fade"
  onRequestClose={() => {
    setRenameConversationTarget(null);
    setRenameText("");
  }}
>
  <View style={styles.renameModalOverlay}>
    <View style={styles.renameModal}>
      <Text style={styles.renameModalTitle}>
        Rename Chat
      </Text>

      <Text style={styles.renameModalDescription}>
        Enter a new name for this conversation.
      </Text>

      <TextInput
        style={styles.renameInput}
        value={renameText}
        onChangeText={setRenameText}
        placeholder="Conversation name"
        placeholderTextColor="#64748b"
        autoFocus
        maxLength={100}
      />

      <View style={styles.renameModalActions}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setRenameConversationTarget(null);
            setRenameText("");
          }}
        >
          <Text style={styles.renameCancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
      onPress={async () => {
  const trimmedTitle =
    renameText.trim();

  if (!trimmedTitle) {
    Alert.alert(
      "Invalid Name",
      "Please enter a conversation name."
    );
    return;
  }

  const success =
    await renameConversation(
      renameConversationTarget.session_id,
      trimmedTitle
    );

  if (success) {
    setRenameConversationTarget(null);
    setRenameText("");
  }
}}
        >
          <Text style={styles.renameSaveText}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
</View>
</SafeAreaView>
  );
}

// =========================================================
// LOGIN / REGISTER SCREEN
// =========================================================

return (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      style={styles.authContainer}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      <ScrollView
        contentContainerStyle={styles.authContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={
          Platform.OS === "ios"
            ? "interactive"
            : "on-drag"
        }
        showsVerticalScrollIndicator={false}
        bounces={false}
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <View style={styles.authBrand}>
          <View
            style={styles.authLogo}
            accessibilityElementsHidden
          >
            <Text style={styles.authLogoText}>
              ✦
            </Text>
          </View>

          <Text style={styles.appTitle}>
            Astra AI
          </Text>

          <Text style={styles.authSubtitle}>
            Your personal AI assistant
          </Text>
        </View>
        {/* =================================================
    AUTH CARD
================================================= */}

<View style={styles.authCard}>
  <Text style={styles.authHeading}>
    Welcome back
  </Text>

  <Text style={styles.authDescription}>
    Sign in to continue to Astra AI.
  </Text>


  {/* Email */}

  <View style={styles.authField}>
    <Text style={styles.authFieldLabel}>
      Email
    </Text>

    <TextInput
      style={styles.input}
      placeholder="you@example.com"
      placeholderTextColor="#64748b"
      value={email}
      onChangeText={setEmail}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      keyboardType="email-address"
      textContentType="emailAddress"
      autoComplete="email"
      editable={!authLoading}
      returnKeyType="next"
      blurOnSubmit={false}
      accessibilityLabel="Email address"
    />
  </View>


  {/* Password */}

  <View style={styles.authField}>
    <Text style={styles.authFieldLabel}>
      Password
    </Text>

    <TextInput
      style={styles.input}
      placeholder="Enter your password"
      placeholderTextColor="#64748b"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      textContentType="password"
      autoComplete="password"
      editable={!authLoading}
      returnKeyType="done"
      onSubmitEditing={
        authLoading
          ? undefined
          : handleLogin
      }
      accessibilityLabel="Password"
    />
  </View>


  {/* Login */}

  <TouchableOpacity
    activeOpacity={0.85}
    style={[
      styles.authButton,
      authLoading &&
        styles.authButtonDisabled,
    ]}
    onPress={handleLogin}
    disabled={authLoading}
    accessibilityRole="button"
    accessibilityLabel={
      authLoading
        ? "Signing in"
        : "Log in"
    }
  >
    {authLoading ? (
      <View style={styles.authButtonContent}>
        <ActivityIndicator
          size="small"
          color="#ffffff"
        />

        <Text style={styles.authButtonText}>
          Signing in...
        </Text>
      </View>
    ) : (
      <Text style={styles.authButtonText}>
        Login
      </Text>
    )}
  </TouchableOpacity>

          {/* Divider */}

<View style={styles.authDivider}>
  <View style={styles.authDividerLine} />

  <Text style={styles.authDividerText}>
    OR
  </Text>

  <View style={styles.authDividerLine} />
</View>


{/* Create Account */}

<TouchableOpacity
  activeOpacity={0.85}
  style={[
    styles.secondaryAuthButton,
    authLoading &&
      styles.authButtonDisabled,
  ]}
  onPress={handleSignup}
  disabled={authLoading}
  accessibilityRole="button"
  accessibilityLabel={
    authLoading
      ? "Creating account"
      : "Create account"
  }
>
  {authLoading ? (
    <View style={styles.authButtonContent}>
      <ActivityIndicator
        size="small"
        color="#22d3ee"
      />

      <Text style={styles.secondaryAuthButtonText}>
        Creating account...
      </Text>
    </View>
  ) : (
    <Text style={styles.secondaryAuthButtonText}>
      Create Account
    </Text>
  )}
</TouchableOpacity>

</View>


{/* Footer */}

<Text style={styles.authFooter}>
  Secure access to your personal AI assistant
</Text>

<Text style={styles.authVersion}>
  Astra AI
</Text>

</ScrollView>
</KeyboardAvoidingView>
</SafeAreaView>
);
}

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  // =======================================================
  // GLOBAL
// =======================================================

  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#020617",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#020617",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#94a3b8",
  },

  // =======================================================
// HOME HEADER
// =======================================================

  header: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },

  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  logoBadge: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#06b6d4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 5,
  },

  logoBadgeText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
  },

  appTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },

  userEmail: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#94a3b8",
    maxWidth: 190,
  },

  logoutButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutButtonText: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "700",
  },

  // =======================================================
// HOME CONTENT
// =======================================================

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#64748b",
  },

  conversationCount: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 9,
    borderRadius: 16,
    backgroundColor: "#083344",
    color: "#67e8f9",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 13,
    fontWeight: "800",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#164e63",
  },

  conversationsList: {
    paddingBottom: 20,
  },

  conversationsEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },

  conversation: {
    padding: 16,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    backgroundColor: "#0f172a",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  conversationSelected: {
    borderColor: "#06b6d4",
    backgroundColor: "#083344",
    shadowColor: "#06b6d4",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },

  conversationContent: {
    flex: 1,
  },

  conversationTitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21,
    color: "#e2e8f0",
  },

  conversationTitleSelected: {
    color: "#67e8f9",
  },

  conversationDate: {
    marginTop: 7,
    fontSize: 12,
    color: "#64748b",
  },

  // =======================================================
// EMPTY STATES
// =======================================================

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 56,
  },

  emptyStateIcon: {
    fontSize: 40,
    marginBottom: 16,
    color: "#22d3ee",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e2e8f0",
    textAlign: "center",
    letterSpacing: -0.2,
  },

  empty: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 21,
    color: "#64748b",
    textAlign: "center",
  },

  // =======================================================
// NEW CHAT
// =======================================================

  newChat: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#020617",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },

  newChatButton: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: "#06b6d4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#06b6d4",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 5,
  },

  newChatIcon: {
    marginRight: 8,
    color: "#ffffff",
    fontSize: 25,
    lineHeight: 25,
    fontWeight: "400",
  },

  newChatButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  // =======================================================
// CHAT
// =======================================================

  chatContainer: {
    flex: 1,
    backgroundColor: "#020617",
  },

  chatHeader: {
    minHeight: 66,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },

  backButton: {
    width: 82,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 11,
    backgroundColor: "#111c30",
  },

  backButtonText: {
    color: "#22d3ee",
    fontSize: 30,
    lineHeight: 32,
    marginRight: 2,
    fontWeight: "400",
  },

  backButtonLabel: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
  },

  chatHeaderCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },

  chatTitle: {
    maxWidth: "90%",
    color: "#f8fafc",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  chatSubtitle: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 11,
    fontWeight: "500",
  },

  headerSpacer: {
    width: 82,
  },

 // =======================================================
// MESSAGES
// =======================================================

  messagesList: {
    flex: 1,
  },

  messagesContent: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 22,
    flexGrow: 1,
  },

  messagesEmptyContent: {
    justifyContent: "center",
  },

  message: {
    alignSelf: "flex-start",
    maxWidth: "88%",
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 11,
    borderRadius: 17,
    borderBottomLeftRadius: 6,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },

  messageText: {
    color: "#e2e8f0",
    fontSize: 16,
    lineHeight: 24,
  },

// =======================================================
// MESSAGE INPUT
// =======================================================

inputContainer: {
  paddingHorizontal: 14,
  paddingTop: 10,
  paddingBottom: 12,
  backgroundColor: "#0f172a",
  borderTopWidth: 1,
  borderTopColor: "#1e293b",
},

inputRow: {
  flexDirection: "row",
  alignItems: "flex-end",
},

messageInput: {
  flex: 1,
  minHeight: 50,
  maxHeight: 130,
  paddingHorizontal: 16,
  paddingVertical: 13,
  marginRight: 9,
  borderWidth: 1,
  borderColor: "#334155",
  borderRadius: 16,
  backgroundColor: "#020617",
  color: "#f8fafc",
  fontSize: 15,
  lineHeight: 21,
},

sendButton: {
  width: 50,
  height: 50,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#06b6d4",
  shadowColor: "#06b6d4",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
},

sendButtonDisabled: {
  opacity: 0.5,
},

sendButtonText: {
  color: "#ffffff",
  fontSize: 25,
  fontWeight: "700",
  lineHeight: 28,
},

inputHint: {
  marginTop: 7,
  paddingHorizontal: 4,
  color: "#475569",
  fontSize: 10,
  textAlign: "center",
},

// =======================================================
// AUTH
// =======================================================

  authContainer: {
    flex: 1,
    backgroundColor: "#020617",
  },

  authContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 44,
  },

  authBrand: {
    alignItems: "center",
    marginBottom: 32,
  },

  authLogo: {
    width: 76,
    height: 76,
    marginBottom: 17,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#06b6d4",
    shadowColor: "#06b6d4",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },

  authLogoText: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "800",
  },

  authSubtitle: {
    marginTop: 7,
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },

  authCard: {
    padding: 22,
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 22,
    backgroundColor: "#0f172a",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 5,
  },

  authHeading: {
    color: "#f8fafc",
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  authDescription: {
    marginTop: 7,
    marginBottom: 9,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 19,
  },

  input: {
    height: 52,
    paddingHorizontal: 15,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 13,
    backgroundColor: "#020617",
    color: "#f8fafc",
    fontSize: 15,
  },

  button: {
    marginTop: 14,
  },

  authButton: {
    height: 51,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#06b6d4",
    shadowColor: "#06b6d4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  authButtonDisabled: {
    opacity: 0.55,
  },

  authButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryAuthButton: {
    height: 51,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e293b",
  },

  secondaryAuthButtonText: {
    color: "#67e8f9",
    fontSize: 15,
    fontWeight: "700",
  },

  authFooter: {
    marginTop: 26,
    color: "#475569",
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },

  // =========================================================
// RENAME MODAL STYLES
// =========================================================

renameModalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 24,
  backgroundColor: "rgba(0, 0, 0, 0.65)",
},

renameModal: {
  width: "100%",
  maxWidth: 420,
  padding: 22,
  borderRadius: 18,
  backgroundColor: "#0f172a",
  borderWidth: 1,
  borderColor: "#1e293b",
},

renameModalTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#f8fafc",
},

renameModalDescription: {
  marginTop: 6,
  fontSize: 14,
  lineHeight: 20,
  color: "#64748b",
},

renameInput: {
  marginTop: 18,
  minHeight: 50,
  paddingHorizontal: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#334155",
  backgroundColor: "#020617",
  color: "#f8fafc",
  fontSize: 15,
},

renameModalActions: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  marginTop: 18,
},

renameCancelText: {
  marginRight: 22,
  color: "#94a3b8",
  fontSize: 15,
  fontWeight: "600",
},

renameSaveText: {
  color: "#22d3ee",
  fontSize: 15,
  fontWeight: "700",
},

});
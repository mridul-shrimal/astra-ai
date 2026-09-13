import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createConversationService,
  getConversationSessionId,
} from "@astra/shared";

import api from "./api";
import { supabase } from "./supabase";

import useAuth from "./src/hooks/useAuth";
import useAuthActions from "./src/hooks/useAuthActions";
import useChat from "./src/hooks/useChat";
import useConversations from "./src/hooks/useConversations";
import useMessages from "./src/hooks/useMessages";
import usePreferences from "./src/hooks/usePreferences";

import ChatScreen from "./src/screens/ChatScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MemoryScreen from "./src/screens/MemoryScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

import { Button, Card, Screen } from "./src/components/ui";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";

import {
  authenticateWithBiometrics,
  canUseBiometrics,
} from "./src/security/biometrics";

import { requestNotificationPermission } from "./src/notifications/notifications";

const conversationService = createConversationService(api);

export default function App() {
  const { preferences, loading: preferencesLoading, setPreference } =
    usePreferences();

  return (
    <ThemeProvider preference={preferences.theme}>
      <AstraMobile
        preferences={preferences}
        preferencesLoading={preferencesLoading}
        setPreference={setPreference}
      />
    </ThemeProvider>
  );
}

function AstraMobile({
  preferences,
  preferencesLoading,
  setPreference,
}) {
  const { colors, spacing, radius, typography } = useTheme();

  const [route, setRoute] = useState("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pinTarget, setPinTarget] = useState(null);
  const [pin, setPin] = useState("");

  const { session, loading: authLoading } = useAuth();

  const {
    login,
    register,
    authLoading: submittingAuth,
  } = useAuthActions();

  const conversationsState = useConversations(session);

  const {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    loadingConversations,
    actionLoading,
    setActionLoading,
    loadConversations,
    createConversation,
    openConversation,
    renameConversation,
    deleteConversation,
    confirmDeleteConversation,
  } = conversationsState;

  const {
    messages,
    setMessages,
    loadingMessages,
  } = useMessages(session, selectedConversation);

  const chat = useChat({
    selectedConversation,
    setMessages,
    renameConversation,
    preferences,
  });

  if (authLoading || preferencesLoading) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />

          <Text
            style={[
              typography.body,
              {
                color: colors.textMuted,
                marginTop: spacing.sm,
              },
            ]}
          >
            Loading Astra AI…
          </Text>
        </View>
      </Screen>
    );
  }

  if (!session) {
    return (
      <AuthView
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        busy={submittingAuth}
        onLogin={async () => {
          const result = await login(email.trim(), password);

          if (!result.success) {
            Alert.alert("Login failed", result.message);
          }
        }}
        onRegister={async () => {
          const result = await register(email.trim(), password);

          if (!result.success) {
            Alert.alert("Sign up failed", result.message);
          } else {
            Alert.alert(
              "Account created",
              "Check your email if confirmation is required."
            );
          }
        }}
      />
    );
  }

  const selectConversation = (conversation) => {
    openConversation(conversation);
    setRoute("chat");
  };

  const pinConversation = (conversation) => {
    const id = getConversationSessionId(conversation);

    setConversations((current) =>
      current.map((item) =>
        getConversationSessionId(item) === id
          ? { ...item, pinned: !item.pinned }
          : item
      )
    );
  };

  const archiveConversation = (conversation) => {
    const id = getConversationSessionId(conversation);

    setConversations((current) =>
      current.map((item) =>
        getConversationSessionId(item) === id
          ? { ...item, archived: !item.archived }
          : item
      )
    );

    if (
      getConversationSessionId(selectedConversation) === id &&
      !conversation.archived
    ) {
      setSelectedConversation(null);
      setMessages([]);
    }
  };

  const duplicateConversation = async (conversation) => {
    try {
      setActionLoading(true);

      const duplicated =
        await conversationService.duplicateConversation(conversation);

      const local = {
        ...duplicated,
        pinned: false,
        archived: false,
        locked: false,
        lockPin: "",
      };

      setConversations((current) => [local, ...current]);
      setSelectedConversation(local);
      setRoute("chat");
    } catch {
      Alert.alert(
        "Couldn't duplicate chat",
        "Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const requestDelete = (conversation) => {
    const remove = () =>
      deleteConversation(
        getConversationSessionId(conversation)
      );

    if (preferences.deleteConfirmation) {
      Alert.alert(
        "Delete conversation?",
        `Delete “${conversation.title || "New Chat"}”?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: remove,
          },
        ]
      );
    } else {
      remove();
    }
  };

  const requestUnlock = async (conversation) => {
    if (
      preferences.biometricEnabled &&
      (await authenticateWithBiometrics()).success
    ) {
      const id = getConversationSessionId(conversation);

      setConversations((current) =>
        current.map((item) =>
          getConversationSessionId(item) === id
            ? {
                ...item,
                locked: false,
                lockPin: "",
              }
            : item
        )
      );

      selectConversation({
        ...conversation,
        locked: false,
        lockPin: "",
      });

      return;
    }

    setPinTarget({
      conversation,
      openAfter: true,
    });

    setPin("");
  };

  const requestLock = (conversation) => {
    setPinTarget({
      conversation,
      openAfter: false,
    });

    setPin("");
  };

  const savePin = () => {
    const conversation = pinTarget?.conversation;
    const id = getConversationSessionId(conversation);

    if (!/^\d{4}$/.test(pin)) {
      return Alert.alert(
        "Invalid PIN",
        "PIN must contain exactly four digits."
      );
    }

    if (
      conversation.locked &&
      pin !== conversation.lockPin
    ) {
      return Alert.alert(
        "Incorrect PIN",
        "Try again or use your configured biometric unlock."
      );
    }

    const next = conversation.locked
      ? {
          ...conversation,
          locked: false,
          lockPin: "",
        }
      : {
          ...conversation,
          locked: true,
          lockPin: pin,
        };

    setConversations((current) =>
      current.map((item) =>
        getConversationSessionId(item) === id
          ? next
          : item
      )
    );

    setPinTarget(null);

    if (pinTarget.openAfter) {
      selectConversation(next);
    }
  };

  const changeBiometric = async (value) => {
    if (!value) {
      return setPreference("biometricEnabled", false);
    }

    if (await canUseBiometrics()) {
      setPreference("biometricEnabled", true);
    } else {
      Alert.alert(
        "Biometrics unavailable",
        "Set up an enrolled biometric on this device first."
      );
    }
  };

  const changeNotifications = async (value) => {
    if (!value) {
      return setPreference("notificationEnabled", false);
    }

    if (await requestNotificationPermission()) {
      setPreference("notificationEnabled", true);
    } else {
      Alert.alert(
        "Notifications unavailable",
        "Permission was not granted."
      );
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();

    setSelectedConversation(null);
    setMessages([]);
    setRoute("home");
  };

  if (route === "chat" && selectedConversation) {
    return (
     <ChatScreen
  conversation={selectedConversation}
  messages={messages}
  loading={loadingMessages}
  messageText={chat.messageText}
  setMessageText={chat.setMessageText}
  isSending={chat.isSending}
  attachments={chat.attachments}
  onPickAttachments={chat.pickAttachments}
  onRemoveAttachment={chat.removeAttachment}
  onSend={chat.sendMessage}
  onStop={chat.stopGeneration}
  preferences={preferences}
  onRename={(conversation, title) =>
    renameConversation(conversation, title)
  }
  onDuplicate={duplicateConversation}
  onPin={pinConversation}
  onArchive={archiveConversation}
  onLock={requestLock}
  onUnlock={requestUnlock}
  onDelete={requestDelete}
  onBack={() => {
          setSelectedConversation(null);
          setMessages([]);
          setRoute("home");
        }}
        onMessageAction={(message) =>
          Alert.alert(
            "Message actions",
            "Choose an action",
            [
              {
                text: "Favorite",
              },
              {
                text: "Like",
              },
              {
                text: "Dislike",
              },
              ...(message.role === "assistant"
                ? [
                    {
                      text: "Regenerate",
                      onPress: () =>
                        chat.regenerate(
                          messages,
                          message.id
                        ),
                    },
                  ]
                : []),
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          )
        }
      />
    );
  }

  if (route === "settings") {
    return (
      <SettingsScreen
        preferences={preferences}
        setPreference={setPreference}
        userEmail={
          session.user?.email || "Astra User"
        }
        onBack={() => setRoute("home")}
        onMemory={() => setRoute("memory")}
        onLogout={logout}
        onBiometric={changeBiometric}
        onNotifications={changeNotifications}
      />
    );
  }

  if (route === "memory") {
    return (
      <MemoryScreen
        onBack={() => setRoute("settings")}
      />
    );
  }

  return (
    <>
      <HomeScreen
        userEmail={
          session.user?.email || "Astra User"
        }
        conversations={conversations}
        selectedConversation={selectedConversation}
        loading={loadingConversations}
        actionLoading={actionLoading}
        onRefresh={loadConversations}
        onNewChat={async () => {
          const created = await createConversation();

          if (created) {
            setRoute("chat");
          }
        }}
        onOpen={selectConversation}
        onRename={(conversation, title) =>
          renameConversation(conversation, title)
        }
        onDuplicate={duplicateConversation}
        onPin={pinConversation}
        onArchive={archiveConversation}
        onLock={requestLock}
        onUnlock={requestUnlock}
        onDelete={requestDelete}
        onSettings={() => setRoute("settings")}
        onMemory={() => setRoute("memory")}
        onLogout={logout}
      />

      <PinModal
        visible={!!pinTarget}
        value={pin}
        onChange={setPin}
        locked={pinTarget?.conversation?.locked}
        onCancel={() => setPinTarget(null)}
        onSave={savePin}
      />
    </>
  );
}

function AuthView({
  email,
  password,
  setEmail,
  setPassword,
  busy,
  onLogin,
  onRegister,
}) {
  const { colors, spacing, radius, typography } =
    useTheme();

  return (
    <Screen>
      <View
        style={[
          styles.auth,
          {
            padding: spacing.lg,
          },
        ]}
      >
        <Text
          style={[
            typography.display,
            {
              color: colors.text,
              textAlign: "center",
            },
          ]}
        >
          Astra AI
        </Text>

        <Text
          style={[
            typography.body,
            {
              color: colors.textMuted,
              textAlign: "center",
              marginTop: spacing.xs,
            },
          ]}
        >
          Your thoughtful AI workspace.
        </Text>

        <Card
          style={{
            marginTop: spacing.xxl,
          }}
        >
          <Text
            style={[
              typography.title,
              {
                color: colors.text,
              },
            ]}
          >
            Welcome
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                borderRadius: radius.sm,
                marginTop: spacing.lg,
              },
            ]}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                borderRadius: radius.sm,
                marginTop: spacing.sm,
              },
            ]}
          />

          <Button
            label={busy ? "Please wait…" : "Log in"}
            disabled={busy}
            onPress={onLogin}
            style={{
              marginTop: spacing.lg,
            }}
          />

          <Button
            label="Create account"
            variant="secondary"
            disabled={busy}
            onPress={onRegister}
            style={{
              marginTop: spacing.sm,
            }}
          />
        </Card>
      </View>
    </Screen>
  );
}

function PinModal({
  visible,
  value,
  onChange,
  locked,
  onCancel,
  onSave,
}) {
  const { colors, spacing, radius, typography } =
    useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View
        style={[
          styles.modalOverlay,
          {
            backgroundColor: colors.overlay,
          },
        ]}
      >
        <Card style={styles.pinCard}>
          <Text
            style={[
              typography.title,
              {
                color: colors.text,
              },
            ]}
          >
            {locked
              ? "Unlock conversation"
              : "Lock conversation"}
          </Text>

          <Text
            style={[
              typography.body,
              {
                color: colors.textMuted,
                marginTop: spacing.xs,
              },
            ]}
          >
            {locked
              ? "Enter your four-digit PIN."
              : "Create a four-digit PIN for this local conversation lock."}
          </Text>

          <TextInput
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            autoFocus
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                borderRadius: radius.sm,
                marginTop: spacing.md,
              },
            ]}
          />

          <View style={styles.pinActions}>
            <Button
              label="Cancel"
              variant="secondary"
              onPress={onCancel}
              style={{
                flex: 1,
              }}
            />

            <Button
              label={locked ? "Unlock" : "Lock"}
              onPress={onSave}
              style={{
                flex: 1,
              }}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  auth: {
    flex: 1,
    justifyContent: "center",
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  pinCard: {
    width: "100%",
  },

  pinActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
});
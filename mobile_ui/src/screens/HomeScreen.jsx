import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";

import ChatEmptyState from "../components/ChatEmptyState";
import ChatInput from "../components/ChatInput";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];

export default function HomeScreen() {
  const { colors, typography, spacing } = useTheme();
  const navigation = useNavigation();
  const {
    conversations: conversationState,
    messages: messageState,
    chat: chatState,
    preferences: preferenceState,
  } = useAppContext();
  const { createConversation } = conversationState;
  const { setMessages } = messageState;
  const { preferences } = preferenceState;
  const { sendMessage, isStreaming, streamingError, stopGeneration } = chatState;

  const [inputText, setInputText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if ((!text && !attachment) || isSending || isStreaming) return;

    setIsSending(true);
    setInputText("");
    let assistantId = null;

    try {
      const conversation = await createConversation();

      if (!conversation) {
        throw new Error("Could not start a new conversation.");
      }

      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text || "Uploaded document(s)",
      };
      assistantId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setMessages((current) => [
        ...current,
        userMessage,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      navigation.navigate("Chat");

      await sendMessage({
        conversation,
        message: text,
        files: attachment ? [attachment] : [],
        onMessageUpdate: (content) => {
          if (typeof content !== "string") return;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId ? { ...message, content } : message
            )
          );
        },
      });

      setAttachment(null);
    } catch (error) {
      if (error.name !== "AbortError") {
        Alert.alert(
          "Message failed",
          streamingError || error.message || "Could not send message."
        );
      }
      if (assistantId) {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: error.message || "Message failed." }
              : message
          )
        );
      }
    } finally {
      setIsSending(false);
    }
  }, [
    attachment,
    createConversation,
    inputText,
    isSending,
    isStreaming,
    navigation,
    sendMessage,
    setMessages,
    streamingError,
  ]);

  const handlePickAttachment = async (key) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: key === "photos" ? "image/*" : "*/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const extension = (asset.name || "").split(".").pop().toLowerCase();
      setAttachment({
        uri: asset.uri,
        name: asset.name || (key === "photos" ? "image" : "document"),
        size: asset.size || null,
        type:
          asset.mimeType ||
          (IMAGE_EXTENSIONS.includes(extension)
            ? "image/*"
            : "application/octet-stream"),
      });
    } catch {
      Alert.alert("Attachment failed", "Could not select that attachment.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
        <Text style={[typography.display, { color: colors.text }]}>Astra AI</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs }]}>
          How can I help you?
        </Text>
      </View>

      <View style={styles.emptyState}>
        <ChatEmptyState onSuggestionPress={setInputText} />
      </View>

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        onPickAttachment={handlePickAttachment}
        onVoiceInput={() => {}}
        isSending={isSending}
        isStreaming={isStreaming}
        onStop={stopGeneration}
        enterToSend={preferences.enterToSend}
        attachment={attachment}
        onRemoveAttachment={() => setAttachment(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 24, alignItems: "center" },
  emptyState: { flex: 1 },
});

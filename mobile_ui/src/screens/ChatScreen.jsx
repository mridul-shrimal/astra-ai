import { useCallback, useState } from "react";
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

import * as DocumentPicker from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatEmptyState from "../components/ChatEmptyState";
import MessageList from "../components/MessageList";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";
import usePreferences from "../hooks/usePreferences";
import { navigate } from "../context/SidebarContext";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];

export default function ChatScreen() {
  const { colors } = useTheme();
  const { conversations: convState, messages: msgState, chat: chatState, auth } = useAppContext();
  const { preferences } = usePreferences();

  const { selectedConversation } = convState;
  const {
    renameConversation,
    duplicateConversation,
    pinConversation,
    archiveConversation,
    lockConversation,
    unlockConversation,
    deleteConversation,
  } = convState;
  const { messages, setMessages, loadingMessages, error: messagesError } = msgState;
  const { sendMessage, isStreaming, streamingError, stopGeneration } = chatState;
  const { session } = auth;

  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isComposedSending, setIsComposedSending] = useState(false);
  const [feedbackByMessageId, setFeedbackByMessageId] = useState({});
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameText, setRenameText] = useState("");

  const conversationTitle = selectedConversation?.title || "New Chat";

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!selectedConversation) return;
    if ((!text && !attachment) || isStreaming || isComposedSending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((current) => [...current, userMessage]);
    setInputText("");
    setIsComposedSending(true);
    setIsThinking(true);
    let assistantId = null;

    const filesForUpload = attachment ? [attachment] : [];
    try {
      let currentContent = "";
      assistantId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      await sendMessage({
        message: text,
        files: filesForUpload,
        onMessageUpdate: (update) => {
          if (typeof update === "string") {
            currentContent = update;
            setMessages((current) => {
              const updated = [...current];
              const assistantIdx = updated.findIndex((m) => m.id === assistantId);
              if (assistantIdx !== -1) {
                updated[assistantIdx] = {
                  ...updated[assistantIdx],
                  content: update,
                };
              }
              return updated;
            });
          }
        },
      });

      setAttachment(null);
    } catch (error) {
      if (error.name !== "AbortError") {
        Alert.alert(
          "Message Failed",
          streamingError || error.message || "Failed to send message. Please try again.",
          [{ text: "OK" }]
        );
      }

      if (assistantId) {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: streamingError || error.message || "Failed to get response.",
                }
              : message
          )
        );
      }
    } finally {
      setIsThinking(false);
      setIsComposedSending(false);
    }
  }, [
    inputText,
    isStreaming,
    isComposedSending,
    sendMessage,
    attachment,
    streamingError,
    setMessages,
  ]);

  const handleSuggestionPress = (suggestion) => {
    setInputText(suggestion);
  };

  const handlePickAttachment = async (key) => {
    try {
      if (key === "photos" || key === "camera") {
        const result = await DocumentPicker.getDocumentAsync({
          type: "image/*",
          multiple: false,
          copyToCacheDirectory: true,
        });

        if (result?.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          setAttachment({
            uri: asset.uri,
            name: asset.name || "image",
            size: asset.size || null,
            type: asset.mimeType || "image/*",
          });
        }
      } else if (key === "files") {
        const result = await DocumentPicker.getDocumentAsync({
          type: "*/*",
          multiple: false,
          copyToCacheDirectory: true,
        });

        if (result?.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          const ext = (asset.name || "").split(".").pop().toLowerCase();
          const isImage = IMAGE_EXTENSIONS.includes(ext);

          setAttachment({
            uri: asset.uri,
            name: asset.name || "document",
            size: asset.size || null,
            type: asset.mimeType || (isImage ? "image/*" : "application/octet-stream"),
          });
        }
      }
    } catch (err) {
      Alert.alert("Error", "Could not select attachment.");
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleCopy = (message) => {
    if (message?.content) {
      Clipboard.setString(message.content);
    }
  };

  const handleAction = (message, actionKey) => {
    switch (actionKey) {
      case "copy":
        handleCopy(message);
        break;
      case "regenerate":
        handleRegenerate(message);
        break;
      case "like":
      case "dislike":
        setFeedbackByMessageId((current) => {
          const previous = current[message.id] || {};
          const isLike = actionKey === "like";
          return {
            ...current,
            [message.id]: {
              liked: isLike ? !previous.liked : false,
              disliked: isLike ? false : !previous.disliked,
            },
          };
        });
        break;
      default:
        break;
    }
  };

  const handleRegenerate = async (assistantMessage) => {
    if (!assistantMessage || isStreaming) return;

    const messageIndex = messages.findIndex((message) => message.id === assistantMessage.id);
    const userMsg = messages
      .slice(0, messageIndex)
      .reverse()
      .find((message) => message.role === "user");
    if (!userMsg) return;

    const assistantId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((current) => [
      ...current.filter((m) => m.id !== assistantMessage.id),
      { id: assistantId, role: "assistant", content: "" },
    ]);

    setIsThinking(true);
    setIsComposedSending(true);

    let currentContent = "";

    try {
      await sendMessage({
        message: userMsg.content,
        files: [],
        onMessageUpdate: (update) => {
          if (typeof update === "string") {
            currentContent = update;
            setMessages((current) => {
              const updated = [...current];
              const assistantIdx = updated.findIndex((m) => m.id === assistantId);
              if (assistantIdx !== -1) {
                updated[assistantIdx] = {
                  ...updated[assistantIdx],
                  content: update,
                };
              }
              return updated;
            });
          }
        },
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        Alert.alert(
          "Message Failed",
          streamingError || error.message || "Failed to send message. Please try again.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setIsThinking(false);
      setIsComposedSending(false);
    }
  };

  const handleMenuAction = async (actionKey) => {
    switch (actionKey) {
      case "rename": {
        setRenameText(selectedConversation?.title || "New Chat");
        setRenameVisible(true);
        break;
      }
      case "duplicate":
        duplicateConversation(selectedConversation);
        break;
      case "pin":
        pinConversation(selectedConversation);
        break;
      case "archive":
        archiveConversation(selectedConversation);
        navigate("Home");
        break;
      case "lock":
        lockConversation(selectedConversation);
        navigate("Home");
        break;
      case "unlock":
        unlockConversation(selectedConversation);
        break;
      case "clear":
        setMessages([]);
        break;
      case "delete":
        if (await deleteConversation(selectedConversation)) {
          navigate("Home");
        }
        break;
      case "info":
        Alert.alert(
          selectedConversation?.title || "Conversation",
          "Conversation details are available from the current chat history."
        );
        break;
      default:
        break;
    }
  };

  const showEmpty = messages.length === 0;

  const renderListEmpty = () => {
    if (loadingMessages) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (messagesError) {
      return null;
    }

    return <ChatEmptyState onSuggestionPress={handleSuggestionPress} />;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <ChatHeader
        title={conversationTitle}
        onMenuAction={handleMenuAction}
        conversation={selectedConversation}
      />

      <View style={styles.body}>
        {loadingMessages && messages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : showEmpty ? (
          renderListEmpty()
        ) : (
          <MessageList
            messages={messages}
            isThinking={isThinking}
            onAction={handleAction}
            feedbackByMessageId={feedbackByMessageId}
            showTimestamp={preferences.showTimestamp}
          />
        )}
      </View>

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        onPickAttachment={handlePickAttachment}
        onVoiceInput={() => {}}
        isSending={isThinking || isComposedSending}
        isStreaming={isStreaming}
        onStop={stopGeneration}
        enterToSend={preferences.enterToSend}
        placeholder="Ask Astra anything..."
        attachment={attachment}
        onRemoveAttachment={handleRemoveAttachment}
      />

      <Modal
        transparent
        visible={renameVisible}
        animationType="fade"
        onRequestClose={() => setRenameVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={() => setRenameVisible(false)}
        >
          <View style={[styles.renameModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.renameTitle, { color: colors.text }]}>Rename Conversation</Text>
            <TextInput
              value={renameText}
              onChangeText={setRenameText}
              autoFocus
              maxLength={100}
              placeholder="Conversation name"
              placeholderTextColor={colors.textMuted}
              style={[styles.renameInput, { color: colors.text, borderColor: colors.border }]}
            />
            <View style={styles.renameActions}>
              <TouchableOpacity
                onPress={() => setRenameVisible(false)}
                style={[styles.renameButton, { backgroundColor: colors.surfaceMuted }]}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const title = renameText.trim();
                  if (!title) return;
                  renameConversation(selectedConversation, title);
                  setRenameVisible(false);
                }}
                style={[styles.renameButton, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: colors.background }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    overflow: "hidden",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  renameModal: {
    padding: 20,
    borderRadius: 16,
  },
  renameTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  renameInput: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 16,
    fontSize: 16,
  },
  renameActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  renameButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
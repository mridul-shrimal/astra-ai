import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  StyleSheet,
  View,
  SafeAreaView,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";

import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatEmptyState from "../components/ChatEmptyState";
import MessageList from "../components/MessageList";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";
import { navigate } from "../context/SidebarContext";
import { uploadFile } from "../services/upload";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];

export default function ChatScreen() {
  const { colors } = useTheme();
  const { conversations: convState, messages: msgState, chat: chatState, auth } = useAppContext();

  const { selectedConversation } = convState;
  const { messages, setMessages, loadingMessages, error: messagesError } = msgState;
  const { sendMessage, isStreaming, streamingError } = chatState;
  const { session } = auth;

  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isComposedSending, setIsComposedSending] = useState(false);

  const conversationTitle = selectedConversation?.title || "New Chat";

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isStreaming || isComposedSending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((current) => [...current, userMessage]);
    setInputText("");
    setIsComposedSending(true);
    setIsThinking(true);

    const filesForUpload = attachment ? [attachment] : [];
    let uploadedFileRefs = [];

    try {
      if (filesForUpload.length > 0) {
        for (const file of filesForUpload) {
          try {
            const uploaded = await uploadFile(file, session?.access_token);
            uploadedFileRefs.push({
              ...uploaded,
              localUri: file.uri,
            });
          } catch (uploadErr) {
            Alert.alert(
              "Upload Failed",
              uploadErr.message || "Could not upload attachment. Sending without it."
            );
          }
        }
      }

      let currentContent = "";
      const assistantId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setMessages((current) => [
        ...current,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      await sendMessage({
        message: text,
        files: uploadedFileRefs,
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

      setMessages((current) => {
        const updated = [...current];
        const assistantIdx = updated.findIndex(
          (m) => m.id && m.id.startsWith("ai-") && m.content === ""
        );
        if (assistantIdx !== -1) {
          updated[assistantIdx] = {
            ...updated[assistantIdx],
            content: streamingError || error.message || "Failed to get response.",
          };
        }
        return updated;
      });
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
            type: "image",
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
            type: isImage ? "image" : asset.mimeType || "application/octet-stream",
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

  const handleCopy = () => {
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
    if (lastAssistantMsg?.content) {
      Clipboard.setString(lastAssistantMsg.content);
    }
  };

  const handleAction = (actionKey) => {
    switch (actionKey) {
      case "copy":
        handleCopy();
        break;
      case "regenerate":
        handleRegenerate();
        break;
      case "like":
      case "dislike":
        break;
      default:
        break;
    }
  };

  const handleRegenerate = async () => {
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistantMsg || isStreaming) return;

    const userMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!userMsg) return;

    const updatedMessages = messages.filter((m) => m.id !== lastAssistantMsg.id);

    const assistantId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((current) => [
      ...current.filter((m) => m.id !== lastAssistantMsg.id),
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

  const handleMenuAction = (actionKey) => {
    switch (actionKey) {
      case "rename":
        break;
      case "clear":
        setMessages([]);
        break;
      case "delete":
        setMessages([]);
        navigate("Home");
        break;
      case "info":
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
      <ChatHeader title={conversationTitle} onMenuAction={handleMenuAction} />

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
        placeholder="Ask Astra anything..."
        attachment={attachment}
        onRemoveAttachment={handleRemoveAttachment}
      />
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
});
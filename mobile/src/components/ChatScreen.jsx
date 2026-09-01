import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function ChatScreen({
  styles,
  selectedConversation,
  messages,
  loadingMessages,
  messageText,
  isSending,
  onMessageTextChange,
  onSendMessage,
  onBack,
}) {
  const conversationTitle =
    selectedConversation?.title?.trim() ||
    "New Chat";

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
        <View style={styles.chatHeader}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backButton}
            onPress={onBack}
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

          <View style={styles.headerSpacer} />
        </View>

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

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.messageInput}
              placeholder="Message Astra..."
              placeholderTextColor="#64748b"
              value={messageText}
              onChangeText={onMessageTextChange}
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
              onPress={onSendMessage}
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

export default ChatScreen;

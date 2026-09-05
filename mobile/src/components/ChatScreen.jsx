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
  attachments,
  onPickAttachments,
  onRemoveAttachment,
  onStopGeneration,
  onRegenerate,
  onMessageAction,
  preferences,
  isLight,
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
      <TouchableOpacity style={styles.message} onLongPress={() => onMessageAction?.(item)}>
        <Text style={styles.messageText}>
          {cleanText}
        </Text>
        {preferences?.showTimestamp && item.created_at && <Text style={styles.messageTime}>{new Date(item.created_at).toLocaleString()}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.chatContainer, isLight && { backgroundColor: "#f8fafc" }]}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      <SafeAreaView style={[styles.chatContainer, isLight && { backgroundColor: "#f8fafc" }]}>
        <View style={[styles.chatHeader, isLight && { backgroundColor: "#ffffff", borderBottomColor: "#cbd5e1" }]}>
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
          {!!attachments?.length && <View style={styles.attachmentRow}>{attachments.map((file) => <TouchableOpacity key={file.uri} style={styles.attachment} onPress={() => onRemoveAttachment(file.uri)}><Text style={styles.attachmentText} numberOfLines={1}>{file.name} ×</Text></TouchableOpacity>)}</View>}
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton} onPress={onPickAttachments} disabled={isSending}><Text style={styles.attachText}>+</Text></TouchableOpacity>
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
              returnKeyType={preferences?.enterToSend === false ? "default" : "send"}
              blurOnSubmit={false}
              onSubmitEditing={preferences?.enterToSend === false ? undefined : onSendMessage}
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
              onPress={isSending ? onStopGeneration : onSendMessage}
              accessibilityRole="button"
              accessibilityLabel={
                isSending
                  ? "Stop generation"
                  : "Send message"
              }
            >
              {isSending ? (
                <Text style={styles.sendButtonText}>■</Text>
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

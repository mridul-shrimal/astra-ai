import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ActionSheet,
  AlertPrompt,
  ChatHeader,
  Screen,
} from "../components/ui";
import { useTheme } from "../theme/ThemeProvider";

function MessageBubble({
  message,
  onLongPress,
  showTimestamp,
}) {
  const { colors, spacing, radius, typography } =
    useTheme();

  const content =
    message.content ||
    message.message ||
    message.text ||
    "";

  const isUser =
    message.role === "user" ||
    message.sender === "user";

  if (!content) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onLongPress={() => onLongPress(message)}
      style={[
        styles.bubble,
        {
          alignSelf: isUser
            ? "flex-end"
            : "flex-start",
          backgroundColor: isUser
            ? colors.user
            : colors.assistant,
          borderColor: isUser
            ? colors.user
            : colors.border,
          borderRadius: radius.md,
          padding: spacing.sm,
        },
      ]}
    >
      <Text
        style={[
          typography.body,
          {
            color: isUser
              ? colors.userText
              : colors.text,
          },
        ]}
      >
        {content}
      </Text>

      {showTimestamp && message.created_at ? (
        <Text
          style={[
            typography.caption,
            {
              color: isUser
                ? colors.userText
                : colors.textMuted,
              opacity: 0.75,
              marginTop: 6,
            },
          ]}
        >
          {new Date(
            message.created_at
          ).toLocaleString()}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

function SendIcon() {
  const { colors } = useTheme();

  return (
    <View style={styles.sendIcon}>
      <View
        style={[
          styles.sendArrow,
          {
            borderLeftColor: colors.primaryText,
          },
        ]}
      />
    </View>
  );
}

function StopIcon() {
  return (
    <View style={styles.stopIcon} />
  );
}

export default function ChatScreen({
  conversation,
  messages,
  messageText,
  setMessageText,
  isSending,
  attachments,
  onPickAttachments,
  onRemoveAttachment,
  onSend,
  onStop,
  onBack,
  onMessageAction,
  preferences,
  onRename,
  onDuplicate,
  onPin,
  onArchive,
  onLock,
  onUnlock,
  onDelete,
}) {
  const {
    colors,
    spacing,
    radius,
    typography,
  } = useTheme();

  const [focused, setFocused] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameText, setRenameText] = useState("");

  const openRename = () => {
    setMenuVisible(false);
    setRenameText(conversation.title || "New Chat");
    setRenameVisible(true);
  };

  const saveRename = () => {
    const title = renameText.trim();
    if (!title) return;
    onRename(conversation, title);
    setRenameVisible(false);
  };

  const runAction = (handler) => {
    setMenuVisible(false);
    handler(conversation);
  };

  const menuActions = [
    { label: "Rename", onPress: openRename },
    { label: "Duplicate", onPress: () => runAction(onDuplicate) },
    { label: conversation.pinned ? "Unpin" : "Pin", onPress: () => runAction(onPin) },
    { label: conversation.archived ? "Restore" : "Archive", onPress: () => runAction(onArchive) },
    { label: conversation.locked ? "Unlock" : "Lock", onPress: () => runAction(conversation.locked ? onUnlock : onLock) },
    { label: "Delete", destructive: true, onPress: () => runAction(onDelete) },
  ];

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ChatHeader
          title={
            conversation.title || "New Chat"
          }
          leftLabel="Back"
          onLeft={onBack}
          right={
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Conversation actions"
              hitSlop={10}
              onPress={() => setMenuVisible(true)}
            >
              <Text
                style={[
                  styles.menuButton,
                  {
                    color: colors.text,
                  },
                ]}
              >
                •••
              </Text>
            </TouchableOpacity>
          }
        />

        <FlatList
          data={messages}
          keyExtractor={(item, index) =>
            String(
              item.id ||
                `${item.created_at}-${index}`
            )
          }
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              onLongPress={onMessageAction}
              showTimestamp={
                preferences.showTimestamp
              }
            />
          )}
          contentContainerStyle={[
            styles.messages,
            {
              padding: spacing.md,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text
                style={[
                  typography.title,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Start a conversation
              </Text>

              <Text
                style={[
                  typography.body,
                  {
                    color: colors.textMuted,
                    marginTop: 8,
                  },
                ]}
              >
                Ask Astra anything.
              </Text>
            </View>
          }
        />

        {attachments.length ? (
          <View
            style={[
              styles.attachments,
              {
                backgroundColor:
                  colors.background,
                paddingHorizontal:
                  spacing.md,
              },
            ]}
          >
            {attachments.map((file) => (
              <TouchableOpacity
                key={file.uri}
                onPress={() =>
                  onRemoveAttachment(
                    file.uri
                  )
                }
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      colors.primarySoft,
                    borderRadius:
                      radius.pill,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    {
                      color: colors.primary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {file.name} ×
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View
          style={[
            styles.composer,
            {
              backgroundColor:
                colors.background,
              borderTopColor: colors.border,
              padding: spacing.sm,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.attach,
              {
                backgroundColor:
                  colors.surfaceMuted,
                borderRadius: radius.md,
              },
            ]}
            disabled={isSending}
            onPress={onPickAttachments}
          >
            <Text
              style={[
                typography.title,
                {
                  color: colors.primary,
                },
              ]}
            >
              +
            </Text>
          </TouchableOpacity>

          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Message Astra…"
            placeholderTextColor={
              colors.textMuted
            }
            multiline
            editable={!isSending}
            returnKeyType={
              preferences.enterToSend
                ? "send"
                : "default"
            }
            onSubmitEditing={
              preferences.enterToSend
                ? onSend
                : undefined
            }
            style={[
              styles.input,
              typography.body,
              {
                color: colors.text,
                backgroundColor:
                  colors.surface,
                borderColor: focused
                  ? colors.primary
                  : colors.border,
                borderRadius: radius.md,
              },
            ]}
          />

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={
              isSending
                ? "Stop generating"
                : "Send message"
            }
            style={[
              styles.send,
              {
                backgroundColor:
                  isSending
                    ? colors.danger
                    : colors.primary,
                borderRadius: radius.md,
              },
            ]}
            onPress={
              isSending
                ? onStop
                : onSend
            }
          >
            {isSending ? (
              <StopIcon />
            ) : (
              <SendIcon />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ActionSheet
        visible={menuVisible}
        actions={menuActions}
        onClose={() => setMenuVisible(false)}
      />

      <AlertPrompt
        visible={renameVisible}
        title="Rename Conversation"
        value={renameText}
        onChange={setRenameText}
        onCancel={() => setRenameVisible(false)}
        onSave={saveRename}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  menuButton: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 24,
    paddingHorizontal: 8,
  },

  messages: {
    flexGrow: 1,
  },

  bubble: {
    maxWidth: "86%",
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },

  empty: {
    flex: 1,
    minHeight: 250,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  attachments: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingTop: 8,
  },

  chip: {
    maxWidth: "70%",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  attach: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 130,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },

  send: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  sendIcon: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  sendArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },

  stopIcon: {
    width: 15,
    height: 15,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
});
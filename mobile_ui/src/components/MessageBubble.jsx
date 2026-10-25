import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import MessageContent from "./MessageContent";

export default function MessageBubble({ message, showTimestamp }) {
  const { colors, spacing, radius, typography } = useTheme();

  const isUser = message.role === "user" || message.sender === "user";

  const content = message.content || message.message || message.text || "";

  const timestamp = message.createdAt || message.created_at;

  return (
    <View style={[styles.messageRow, isUser && styles.userRow]}>
      {!isUser && (
        <View
          style={[
            styles.avatar,
            styles.assistantAvatar,
            { backgroundColor: colors.surfaceDim },
          ]}
        >
          <Ionicons name="sparkles" size={16} color={colors.primary} />
        </View>
      )}

      <View style={containerStyle(isUser, colors, radius, spacing)}>
        <MessageContent content={content} />
      </View>

      {isUser && (
        <View
          style={[
            styles.avatar,
            styles.userAvatar,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons name="person" size={14} color={colors.background} />
        </View>
      )}

      {showTimestamp && timestamp ? (
        <Text
          style={[
            typography.caption,
            {
              color: isUser ? colors.userText : colors.textMuted,
              opacity: 0.75,
              marginTop: 6,
            },
          ]}
        >
          {new Date(timestamp).toLocaleString()}
        </Text>
      ) : null}
    </View>
  );
}

const containerStyle = (isUser, colors, radius, spacing) => [
  styles.userContainer,
  {
    backgroundColor: isUser ? colors.primary : colors.surface,
    borderBottomRightRadius: isUser ? 4 : radius.md,
    borderBottomLeftRadius: isUser ? radius.md : 4,
    borderWidth: isUser ? 0 : StyleSheet.hairlineWidth,
    borderColor: isUser ? colors.user : colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
];

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    marginHorizontal: 16,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  assistantAvatar: {
    marginRight: 8,
  },
  userAvatar: {
    marginLeft: 8,
  },
  userContainer: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  assistantContainer: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
});

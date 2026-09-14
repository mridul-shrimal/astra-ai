import { StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import MessageContent from "./MessageContent";

export default function MessageBubble({ message }) {
  const { colors } = useTheme();

  const isUser = message.role === "user" || message.sender === "user";

  const containerStyle = isUser
    ? [
        styles.userContainer,
        {
          backgroundColor: colors.primary,
          borderBottomRightRadius: 4,
        },
      ]
    : [
        styles.assistantContainer,
        {
          backgroundColor: colors.surface,
          borderBottomLeftRadius: 4,
        },
      ];

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

      <View style={containerStyle}>
        <MessageContent content={message.content || message.message || message.text || ""} />
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
    </View>
  );
}

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
    borderWidth: 1,
    borderColor: "transparent",
  },
});

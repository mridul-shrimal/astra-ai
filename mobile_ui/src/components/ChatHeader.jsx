import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSidebar } from "../context/SidebarContext";
import ChatHeaderMenu from "./ChatHeaderMenu";
import { useTheme } from "../theme/ThemeProvider";

export default function ChatHeader({ title, onMenuAction, conversation }) {
  const { openSidebar } = useSidebar();
  const { colors, typography, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 10,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.sideSlot}>
        <TouchableOpacity
          onPress={openSidebar}
          activeOpacity={0.7}
          style={styles.menuBtn}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        </View>

        {/* CENTER: Conversation title */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              typography.body,
              {
                color: colors.text,
                fontWeight: "600",
                fontSize: 17,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title || "New Chat"}
          </Text>
          <Text
            style={[
              typography.caption,
              { color: colors.textMuted },
            ]}
          >
            ● AI Assistant
          </Text>
        </View>

        <View style={styles.sideSlot}>
          <ChatHeaderMenu onMenuAction={onMenuAction} conversation={conversation} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuBtn: {
    padding: 10,
  },
  sideSlot: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
});

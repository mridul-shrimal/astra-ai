import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

const MENU_ITEMS = [
  { key: "rename", label: "Rename Chat", icon: "create-outline" },
  { key: "clear", label: "Clear Conversation", icon: "trash-outline" },
  { key: "delete", label: "Delete Chat", icon: "trash-bin-outline" },
  { key: "info", label: "Conversation Info", icon: "information-outline" },
];

export default function ChatHeaderMenu({ onMenuAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, typography, radius } = useTheme();

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
        style={styles.menuBtn}
        accessibilityLabel="More options"
        accessibilityRole="button"
      >
        <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
      </TouchableOpacity>

      {isOpen && (
        <>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          />
          <View
            style={[
              styles.menu,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  setIsOpen(false);
                  onMenuAction?.(item.key);
                }}
                style={styles.menuItem}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={colors.textMuted}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    typography.body,
                    { color: colors.text, fontSize: 15 },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menuBtn: {
    padding: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  menu: {
    position: "absolute",
    top: 44,
    right: 0,
    minWidth: 160,
    paddingVertical: 8,
    borderWidth: 1,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIcon: {
    marginRight: 12,
  },
});

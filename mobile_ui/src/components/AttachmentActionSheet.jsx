import { useCallback } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeProvider";

const ATTACHMENT_OPTIONS = [
  {
    key: "photos",
    label: "Photos & Images",
    icon: "image-outline",
    description: "Select from photo library",
  },
  {
    key: "files",
    label: "Files & Documents",
    icon: "document-outline",
    description: "Browse files",
  },
];

export default function AttachmentActionSheet({ visible, onClose, onSelect }) {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSelect = useCallback(
    (key) => {
      onSelect?.(key);
      onClose();
    },
    [onSelect, onClose]
  );

  if (!visible) return null;

  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <Modal transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <TouchableOpacity
        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      />

      <View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: colors.surfaceElevated,
            borderTopColor: colors.borderDim,
            paddingBottom: bottomPadding,
          },
        ]}
      >
        <View style={styles.handle} />

        <Text
          style={[
            typography.caption,
            {
              color: colors.textMuted,
              textAlign: "center",
              paddingVertical: spacing.xs,
              paddingBottom: spacing.sm,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontSize: 11,
            },
          ]}
        >
          Attach From
        </Text>

        {ATTACHMENT_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={option.key}
            onPress={() => handleSelect(option.key)}
            activeOpacity={0.7}
            style={[
              styles.optionRow,
              {
                borderBottomColor: colors.borderDim,
                borderBottomWidth: index < ATTACHMENT_OPTIONS.length - 1 ? 1 : 0,
                paddingHorizontal: spacing.lg,
                paddingVertical: 16,
              },
            ]}
          >
            <View
              style={[
                styles.optionIcon,
                { backgroundColor: colors.primaryDim },
              ]}
            >
              <Ionicons name={option.icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text
                style={[
                  typography.body,
                  { color: colors.text, fontSize: 16, fontWeight: "500" },
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: colors.textMuted, marginTop: 2 },
                ]}
              >
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={[
            styles.cancelBtn,
            {
              backgroundColor: colors.surface,
              marginTop: spacing.md,
              marginHorizontal: spacing.md,
              borderRadius: radius.md,
              height: 52,
            },
          ]}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  handle: {
    width: 32,
    height: 4,
    backgroundColor: "#33333333",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  cancelBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
});

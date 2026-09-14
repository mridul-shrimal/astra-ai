import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AttachmentActionSheet from "./AttachmentActionSheet";
import AttachmentPreview from "./AttachmentPreview";
import EmojiPicker from "./EmojiPicker";
import { useTheme } from "../theme/ThemeProvider";

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  onPickAttachment,
  onVoiceInput,
  isSending,
  placeholder = "Ask Astra anything...",
  attachment,
  onRemoveAttachment,
}) {
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const hasText = value && value.trim().length > 0;

  const handleEmojiSelect = (emoji) => {
    onChangeText((prev) => prev + emoji);
    setEmojiPickerVisible(false);
  };

  const handleAttachmentSelect = (key) => {
    setActionSheetVisible(false);
    onPickAttachment?.(key);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: "height" })}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {attachment ? (
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingBottom: 4,
            }}
          >
            <AttachmentPreview attachment={attachment} onRemove={onRemoveAttachment} />
          </View>
        ) : null}

        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.xl,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              marginHorizontal: spacing.lg,
              marginBottom: insets.bottom > 0 ? insets.bottom : spacing.sm,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setActionSheetVisible(true)}
            activeOpacity={0.7}
            style={[styles.iconBtn, { padding: 10 }]}
            hitSlop={16}
            accessibilityLabel="Add attachment"
          >
            <Ionicons name="attach" size={22} color={colors.icon} />
          </TouchableOpacity>

          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              { color: colors.text, maxHeight: 120 },
            ]}
            multiline
            maxLength={4000}
            textAlignVertical="top"
            accessibilityLabel="Chat input"
          />

          {!hasText ? (
            <View style={styles.iconGroup}>
              <TouchableOpacity
                onPress={() => setEmojiPickerVisible(true)}
                activeOpacity={0.7}
                style={[styles.iconBtn, { padding: 10 }]}
                hitSlop={12}
                accessibilityLabel="Insert emoji"
              >
                <Ionicons name="ellipsis-wavy" size={22} color={colors.icon} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onVoiceInput}
                activeOpacity={0.7}
                style={[styles.iconBtn, { padding: 10 }]}
                hitSlop={12}
                accessibilityLabel="Voice input"
              >
                <Ionicons name="mic" size={22} color={colors.icon} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onSend}
              disabled={isSending}
              activeOpacity={0.7}
              style={[
                styles.iconBtn,
                {
                  backgroundColor: isSending ? colors.textDim : colors.primary,
                  borderRadius: radius.full,
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              hitSlop={8}
              accessibilityLabel="Send message"
            >
              <Ionicons name="send" size={18} color={colors.background} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      <EmojiPicker
        visible={emojiPickerVisible}
        onClose={() => setEmojiPickerVisible(false)}
        onSelectEmoji={handleEmojiSelect}
      />

      <AttachmentActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        onSelect={handleAttachmentSelect}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 4,
    paddingVertical: 6,
    includeFontPadding: false,
  },
  iconBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconGroup: {
    flexDirection: "row",
    gap: 4,
  },
});

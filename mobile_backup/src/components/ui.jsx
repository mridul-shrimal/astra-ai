import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";

export function Screen({ children, scroll = false, contentStyle }) {
  const { colors, spacing } = useTheme();

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[{ padding: spacing.md }, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <SafeAreaView
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {body}
    </SafeAreaView>
  );
}

export function Header({
  title,
  subtitle,
  leftLabel,
  onLeft,
  right,
  compact = false,
}) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          paddingHorizontal: spacing.md,
          borderBottomColor: colors.border,
        },
        compact && styles.headerCompact,
      ]}
    >
      <View style={styles.headerSide}>
        {leftLabel ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={leftLabel}
            hitSlop={10}
            onPress={onLeft}
          >
            <Text
              style={[
                styles.headerAction,
                {
                  color: colors.primary,
                },
              ]}
            >
              {leftLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.headerCenter}>
        <Text
          style={[
            typography.title,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={[
              typography.caption,
              {
                color: colors.textMuted,
              },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.headerSide, styles.headerRight]}>
        {right}
      </View>
    </View>
  );
}

export function ChatHeader({
  title,
  leftLabel,
  onLeft,
  right,
}) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.chatHeader,
        {
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.chatHeaderSide}>
        {leftLabel ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={leftLabel}
            hitSlop={10}
            onPress={onLeft}
          >
            <Text
              style={[
                styles.headerAction,
                {
                  color: colors.primary,
                },
              ]}
            >
              {leftLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.chatHeaderCenter}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.chatHeaderTitle,
            {
              color: colors.text,
            },
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.chatHeaderSide}>
        {right}
      </View>
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  style,
}) {
  const { colors, radius, spacing, typography } = useTheme();

  const palette =
    variant === "danger"
      ? {
          background: colors.danger,
          text: "#fff",
        }
      : variant === "secondary"
        ? {
            background: colors.surfaceMuted,
            text: colors.text,
          }
        : {
            background: colors.primary,
            text: colors.primaryText,
          };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.82}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: palette.background,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          typography.label,
          {
            color: palette.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function Card({ children, style }) {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function LoadingState({ label = "Loading…" }) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.state}>
      <ActivityIndicator color={colors.primary} />

      <Text
        style={[
          typography.body,
          {
            color: colors.textMuted,
            marginTop: 12,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function EmptyState({ title, description }) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.state}>
      <Text
        style={[
          typography.title,
          {
            color: colors.text,
            textAlign: "center",
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          typography.body,
          {
            color: colors.textMuted,
            textAlign: "center",
            marginTop: 8,
          },
        ]}
      >
        {description}
      </Text>
    </View>
  );
}

export function AlertPrompt({
  visible,
  title,
  value,
  onChange,
  onCancel,
  onSave,
}) {
  const { colors, spacing, radius, typography } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible
      onRequestClose={onCancel}
      animationType="fade"
    >
      <Pressable
        style={[
          styles.modalOverlay,
          {
            backgroundColor: colors.overlay,
          },
        ]}
        onPress={onCancel}
      >
        <Pressable
          style={[
            styles.renameModal,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: spacing.lg,
              margin: spacing.md,
            },
          ]}
          onPress={() => {}}
        >
          <Text
            style={[
              typography.title,
              {
                color: colors.text,
                marginBottom: spacing.md,
              },
            ]}
          >
            {title}
          </Text>
          <TextInput
            value={value}
            onChangeText={onChange}
            autoFocus
            maxLength={100}
            placeholder="Conversation name"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.renameInput,
              typography.body,
              {
                color: colors.text,
                borderColor: colors.border,
                borderRadius: radius.sm,
                borderWidth: 1,
              },
            ]}
          />
          <View style={styles.renameActions}>
            <Button
              label="Cancel"
              variant="secondary"
              onPress={onCancel}
              style={{ flex: 1 }}
            />
            <Button label="Save" onPress={onSave} style={{ flex: 1 }} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ActionSheet({
  visible,
  actions,
  onClose,
}) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.overlay,
          {
            backgroundColor: colors.overlay,
          },
        ]}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              padding: spacing.lg,
            },
          ]}
          onPress={() => {}}
        >
          {actions.map((action) => (
            <TouchableOpacity
              key={action.label}
              disabled={action.disabled}
              style={[
                styles.sheetAction,
                {
                  borderTopColor: colors.border,
                },
              ]}
              onPress={action.onPress}
            >
              <Text
                style={[
                  typography.body,
                  {
                    color: action.destructive
                      ? colors.danger
                      : colors.text,
                  },
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  headerCompact: {
    height: 52,
  },

  headerSide: {
    width: 56,
    flex: 1,
    justifyContent: "center",
  },

  headerRight: {
    alignItems: "flex-end",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerAction: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },

  chatHeader: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  chatHeaderSide: {
    width: 44,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  chatHeaderCenter: {
    flex: 1,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  chatHeaderTitle: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "center",
  },

  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.5,
  },

  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },

  state: {
    flex: 1,
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },

  sheet: {
    width: "100%",
  },

  sheetAction: {
    minHeight: 52,
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  renameModal: {
    width: "100%",
  },

  renameInput: {
    minHeight: 48,
    paddingHorizontal: 12,
  },

  renameActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
});
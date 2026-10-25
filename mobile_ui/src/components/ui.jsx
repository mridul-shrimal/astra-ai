import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeProvider";

export function Screen({ children, style, ...props }) {
  const { colors } = useTheme();

  return (
    <View
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  style,
  labelStyle,
}) {
  const { colors, radius, typography } = useTheme();

  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";

  const bg = isPrimary
    ? colors.primary
    : isSecondary
      ? colors.surfaceDim
      : colors.primary;

  const textColor = isPrimary
    ? colors.background
    : isSecondary
      ? colors.text
      : colors.background;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? colors.textDim : bg,
          borderRadius: radius.md,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          typography.body,
          { color: textColor, fontWeight: "600", textAlign: "center" },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function Card({ children, style, ...props }) {
  const { colors, radius } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export function MenuButton({ onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.menuButton}
    >
      <Ionicons name="menu" size={24} color={colors.text} />
    </TouchableOpacity>
  );
}

export function ActionSheet({ visible, actions, onClose }) {
  const { colors, radius, spacing, typography } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.modalOverlay,
          { backgroundColor: colors.overlay },
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
  button: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    borderWidth: 1,
    padding: 16,
  },
  menuButton: {
    marginRight: 12,
    padding: 10,
  },
  modalOverlay: {
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
});

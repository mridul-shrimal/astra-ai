import { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

const ACTIONS = [
  { key: "copy", label: "Copy", icon: "copy-outline", iconSize: 16 },
  { key: "regenerate", label: "Regenerate", icon: "reload-outline", iconSize: 16 },
  { key: "like", label: "Like", icon: "thumbs-up-outline", iconSize: 16 },
  { key: "dislike", label: "Dislike", icon: "thumbs-down-outline", iconSize: 16 },
];

function ActionButton({ action, onAction, selected, colors, typography }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <TouchableOpacity
      onPress={() => onAction?.(action.key)}
      onPressIn={() => Animated.spring(scaleAnim, {
        toValue: 0.92,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start()}
      onPressOut={() => Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start()}
      activeOpacity={1}
        style={[styles.actionBtn, { flexGrow: 1, flexShrink: 0, flexBasis: 0 }]}
      hitSlop={8}
      accessibilityLabel={action.label}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons
          name={action.icon}
          size={action.iconSize}
          color={selected ? colors.primary : colors.textMuted}
        />
      </Animated.View>
      <Text
        style={[
          typography.caption,
          {
            color: selected ? colors.primary : colors.textMuted,
            marginLeft: 4,
            fontSize: 12,
            flexShrink: 0,
          },
        ]}
      >
        {action.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function MessageActions({ onAction, liked, disliked, style }) {
  const { colors, typography, spacing } = useTheme();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceDim,
          borderColor: colors.borderDim,
          marginLeft: 48,
          marginRight: spacing.lg,
        },
        style,
      ]}
    >
      <View style={styles.actionRow}>
        {ACTIONS.slice(0, 2).map((action) => (
          <ActionButton
            key={action.key}
            action={action}
            onAction={onAction}
            selected={false}
            colors={colors}
            typography={typography}
          />
        ))}
      </View>
      <View style={styles.actionRow}>
        {ACTIONS.slice(2).map((action) => (
          <ActionButton
            key={action.key}
            action={action}
            onAction={onAction}
            selected={action.key === "like" ? liked : disliked}
            colors={colors}
            typography={typography}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "stretch",
  },
    actionBtn: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingHorizontal: 4,
      paddingVertical: 8,
  },
  actionRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
});

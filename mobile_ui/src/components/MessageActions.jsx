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

export default function MessageActions({ onAction, style }) {
  const { colors, typography, spacing } = useTheme();

  const renderAction = (action) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        key={action.key}
        onPress={() => onAction?.(action.key)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[styles.actionBtn, { minHeight: 40 }]}
        hitSlop={12}
        accessibilityLabel={action.label}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={action.icon}
            size={action.iconSize}
            color={colors.textMuted}
          />
        </Animated.View>
        <Text
          style={[
            typography.caption,
            { color: colors.textMuted, marginLeft: 4, fontSize: 12 },
          ]}
        >
          {action.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceDim,
          borderColor: colors.borderDim,
          marginHorizontal: spacing.lg,
          marginLeft: 48,
        },
        style,
      ]}
    >
      {ACTIONS.map(renderAction)}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

const SUGGESTED_PROMPTS = [
  "Explain quantum computing in simple terms",
  "What are the latest AI breakthroughs?",
  "Help me write a professional email",
  "Summarize the key points of React hooks",
];

export default function ChatEmptyState({ onSuggestionPress }) {
  const { colors, typography, spacing } = useTheme();

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const chipsOpacity = useRef(new Animated.Value(0)).current;
  const chipsTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(chipsOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(chipsTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [titleOpacity, titleTranslate, subtitleOpacity, chipsOpacity, chipsTranslate]);

  const renderChip = (prompt, index) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
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
      <Animated.View
        key={prompt}
        style={{
          opacity: chipsOpacity,
          transform: [{ translateY: chipsTranslate }],
        }}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={() => onSuggestionPress?.(prompt)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            style={[
              styles.chip,
              {
                backgroundColor: colors.surfaceDim,
                borderColor: colors.border,
              },
            ]}
            accessibilityLabel={`Suggestion: ${prompt}`}
          >
            <Text
              style={[
                typography.body,
                { color: colors.text, fontSize: 14 },
              ]}
            >
              {prompt}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslate }],
          },
        ]}
      >
        <View
          style={[styles.avatar, { backgroundColor: colors.surfaceDim }]}
        >
          <Ionicons name="sparkles" size={32} color={colors.primary} />
        </View>

        <Text
          style={[
            typography.display,
            { color: colors.text, marginTop: spacing.xl, fontSize: 28 },
          ]}
        >
          Astra AI
        </Text>

        <Animated.Text
          style={[
            typography.body,
            {
              color: colors.textMuted,
              marginTop: spacing.sm,
              textAlign: "center",
              opacity: subtitleOpacity,
            },
          ]}
        >
          Your thoughtful AI workspace. Ask me anything — I'm here to help.
        </Animated.Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.chipContainer,
          {
            marginTop: spacing.xl,
            opacity: chipsOpacity,
            transform: [{ translateY: chipsTranslate }],
          },
        ]}
      >
        {SUGGESTED_PROMPTS.map((prompt, index) => renderChip(prompt, index))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chipContainer: {
    width: "100%",
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 44,
    justifyContent: "center",
  },
});

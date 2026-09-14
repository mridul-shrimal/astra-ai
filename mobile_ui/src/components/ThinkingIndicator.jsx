import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

export default function ThinkingIndicator({ visible }) {
  const { colors } = useTheme();

  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    const dots = [dot1Anim, dot2Anim, dot3Anim];

    const animateDots = () => {
      dots.forEach((anim, index) => {
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });

      Animated.stagger(200, dots.map((anim) =>
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )).start(() => {
        if (visible) {
          animateDots();
        }
      });
    };

    const pulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDots();
    pulse();

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [visible, dot1Anim, dot2Anim, dot3Anim, pulseAnim]);

  if (!visible) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Animated.View
        style={[
          styles.avatar,
          {
            backgroundColor: colors.surfaceDim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Ionicons name="sparkles" size={16} color={colors.primary} />
      </Animated.View>

      <View
        style={[
          styles.bubble,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.dotsRow}>
          {[dot1Anim, dot2Anim, dot3Anim].map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: colors.primary,
                  opacity: anim,
                  transform: [
                    {
                      scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    marginHorizontal: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    height: 20,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
});

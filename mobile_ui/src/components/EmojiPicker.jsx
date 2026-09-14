import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";

const EMOJI_CATEGORIES = [
  {
    id: "smileys",
    label: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "😊", "😇", "😍", "🥰", "😘", "😗", "😙", "😚", "🙂", "🙃", "🤗", "🤔", "🤭", "😜", "🤪", "🫠", "🤪", "🥱", "😅"],
  },
  {
    id: "hearts",
    label: "Hearts",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💘", "💝", "💟", "✨", "⚡", "🔥", "😎"],
  },
  {
    id: "gestures",
    label: "Gestures",
    emojis: ["👋", "👍", "👎", "👏", "🙏", "🙌", "👐", "🤲", "🤝", "💪", "🫡", "😉", "😌", "🙏", "👌"],
  },
  {
    id: "objects",
    label: "Objects",
    emojis: ["📱", "💻", "⌚", "📷", "📹", "🎧", "🎮", "🎯", "📚", "✏️", "💡", "🔧", "🧰", "🧴", "☕", "🍽️", "🚗", "✈️", "🏠", "🌈"],
  },
];

const EMOJI_SIZE = 28;
const CATEGORY_HEIGHT = 48;

const EmojiCategoryTab = ({ category, isActive, onPress, colors }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    style={[
      styles.categoryTab,
      {
        backgroundColor: isActive ? colors.primaryDim : "transparent",
        borderBottomColor: isActive ? colors.primary : "transparent",
        borderBottomWidth: isActive ? 2 : 0,
      },
    ]}
    hitSlop={8}
  >
    <Text
      style={{
        fontSize: 20,
        opacity: isActive ? 1 : 0.5,
      }}
    >
      {category.emojis[0]}
    </Text>
  </TouchableOpacity>
);

const EmojiCategoryRow = ({ emojis, onSelect }) => {
  const renderEmoji = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      activeOpacity={0.5}
      style={styles.emojiCell}
      hitSlop={4}
    >
      <Text style={{ fontSize: EMOJI_SIZE }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={emojis}
      keyExtractor={(item, index) => `emoji-${item}-${index}`}
      renderItem={renderEmoji}
      numColumns={8}
      columnWrapperStyle={styles.emojiRow}
      scrollEnabled={false}
    />
  );
};

export default function EmojiPicker({ visible, onClose, onSelectEmoji }) {
  const { colors, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(CATEGORY_HEIGHT + 44)).current;
  const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0].id);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 20,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(CATEGORY_HEIGHT + 44);
    }
  }, [visible, slideAnim]);

  const activeEmojis =
    EMOJI_CATEGORIES.find((cat) => cat.id === activeCategory)?.emojis || [];

  const handleSelect = useCallback(
    (emoji) => {
      onSelectEmoji?.(emoji);
    },
    [onSelectEmoji]
  );

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View
        style={[
          styles.pickerContainer,
          {
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            paddingBottom: Math.max(insets.bottom, 12),
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.handle} />

        <View style={[styles.categoryTabs, { borderBottomColor: colors.border }]}>
          {EMOJI_CATEGORIES.map((category) => (
            <EmojiCategoryTab
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
              onPress={() => setActiveCategory(category.id)}
              colors={colors}
            />
          ))}
        </View>

        <EmojiCategoryRow
          emojis={activeEmojis}
          onSelect={handleSelect}
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
  categoryTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 4,
    height: CATEGORY_HEIGHT,
  },
  categoryTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: CATEGORY_HEIGHT,
    paddingHorizontal: 4,
  },
  emojiRow: {
    justifyContent: "flex-start",
  },
  emojiCell: {
    width: EMOJI_SIZE + 6,
    height: EMOJI_SIZE + 6,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
});

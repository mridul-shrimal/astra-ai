import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, FlatList, StyleSheet, View } from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import MessageBubble from "./MessageBubble";
import MessageActions from "./MessageActions";
import ThinkingIndicator from "./ThinkingIndicator";

export default function MessageList({
  messages,
  isThinking,
  onAction,
  feedbackByMessageId,
  showTimestamp,
  ListEmptyComponent,
}) {
  const { colors } = useTheme();
  const flatListRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  const renderMessage = ({ item }) => (
    <AnimatedMessageBubble
      message={item}
      isThinking={isThinking}
      onAction={onAction}
      feedback={feedbackByMessageId?.[item.id]}
      showTimestamp={showTimestamp}
    />
  );

  const keyExtractor = (item) => item.id || `${item.role}-${Date.now()}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={
          isThinking ? <ThinkingIndicator visible={true} /> : null
        }
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </View>
  );
}

const AnimatedMessageBubble = ({ message, isThinking, onAction, feedback, showTimestamp }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View style={[styles.messageItem, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.msgWrapper}>
        <MessageBubble message={message} showTimestamp={showTimestamp} />
        {!isThinking && message.role !== "user" && (
          <MessageActions
            onAction={(actionKey) => onAction?.(message, actionKey)}
            liked={feedback?.liked}
            disliked={feedback?.disliked}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  messageItem: {
    width: "100%",
  },
  msgWrapper: {
    width: "100%",
    marginBottom: 4,
  },
});

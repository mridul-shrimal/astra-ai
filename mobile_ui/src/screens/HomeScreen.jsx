import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";
import { getConversationSessionId } from "@astra/shared";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const diffMs = now - d;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    if (hours < 1) return "Just now";
    return `${hours}h ago`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  if (diffHours < 24 * 7) {
    const days = Math.floor(diffHours / 24);
    return `${days}d ago`;
  }

  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const truncateTitle = (title, maxLength = 32) => {
  if (!title || !title.trim()) return "New Chat";
  const trimmed = title.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + "…";
};

const ConversationItem = ({ item, isSelected, onPress, onDelete }) => {
  const { colors, typography, spacing, radius } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.conversationCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          marginHorizontal: spacing.md,
          padding: spacing.md,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.conversationMain}>
        <View style={styles.conversationText}>
          <Text
            style={[
              typography.body,
              {
                color: isSelected ? colors.primary : colors.text,
                fontWeight: isSelected ? "600" : "500",
                fontSize: 16,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {truncateTitle(item.title)}
          </Text>
          <Text
            style={[
              typography.caption,
              { color: colors.textMuted, marginTop: 2 },
            ]}
          >
            {formatDate(item.updated_at) || "No date"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.deleteBtn, { padding: 8 }]}
          onPress={onDelete}
          activeOpacity={0.6}
          hitSlop={16}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const { conversations: convState } = useAppContext();

  const {
    conversations,
    selectedConversation,
    loadingConversations,
    error,
    loadConversations,
    openConversation,
    createConversation,
    confirmDeleteConversation,
  } = convState;

  const [refreshing, setRefreshing] = useState(false);

  const handleNewChat = () => {
    createConversation();
  };

  const handleSelectConversation = (conversation) => {
    openConversation(conversation);
  };

  const handleDeleteConversation = (conversation) => {
    confirmDeleteConversation(conversation);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  }, [loadConversations]);

  const sortedConversations = [...conversations].sort((a, b) => {
    const aDate = new Date(a.updated_at || a.created_at || 0);
    const bDate = new Date(b.updated_at || b.created_at || 0);
    return bDate - aDate;
  });

  const renderConversation = ({ item }) => {
    const isActive =
      selectedConversation &&
      getConversationSessionId(selectedConversation) ===
        getConversationSessionId(item);

    return (
      <ConversationItem
        item={item}
        isSelected={isActive}
        onPress={() => handleSelectConversation(item)}
        onDelete={() => handleDeleteConversation(item)}
      />
    );
  };

  const ListHeader = () => (
    <View
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <TouchableOpacity
        onPress={handleNewChat}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          height: 48,
          gap: 8,
        }}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={20} color={colors.background} />
        <Text
          style={{
            color: colors.background,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          New Chat
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-outline" size={48} color={colors.textDim} />
      <Text
        style={[
          typography.title,
          { color: colors.text, marginTop: 16 },
        ]}
      >
        No Conversations Yet
      </Text>
      <Text
        style={[
          typography.body,
          { color: colors.textMuted, textAlign: "center", marginTop: 8 },
        ]}
      >
        Start a new conversation to begin using Astra AI
      </Text>
      <TouchableOpacity
        onPress={handleNewChat}
        style={{
          marginTop: 24,
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        activeOpacity={0.85}
      >
        <Text
          style={{
            color: colors.background,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          New Chat
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
      <Text
        style={[
          typography.body,
          { color: colors.textMuted, textAlign: "center", marginTop: 12 },
        ]}
      >
        {error || "Something went wrong"}
      </Text>
      <TouchableOpacity
        onPress={loadConversations}
        style={{
          marginTop: 20,
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        activeOpacity={0.85}
      >
        <Text
          style={{
            color: colors.background,
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loadingConversations && conversations.length === 0 && !refreshing) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ListHeader />
        <View style={styles.loadingContainer}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Loading conversations...
          </Text>
        </View>
      </View>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ListHeader />
        <ErrorState />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={sortedConversations}
        keyExtractor={(item) => getConversationSessionId(item)}
        renderItem={renderConversation}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textMuted}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  conversationCard: {
    borderWidth: 1,
    marginBottom: 8,
  },
  conversationMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  conversationText: {
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
});

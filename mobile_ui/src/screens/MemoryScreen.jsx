import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAppContext } from "../context/AppContext";
import useMemory from "../hooks/useMemory";
import { useTheme } from "../theme/ThemeProvider";

const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
};

const MemoryCard = ({ item, onPress, onDelete }) => {
  const { colors, typography, spacing, radius } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.memoryCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.memoryContent}>
        <View style={styles.memoryText}>
          {item.user_message ? (
            <Text
              style={[
                typography.caption,
                { color: colors.textMuted, marginBottom: 4 },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {truncateText(item.user_message, 80)}
            </Text>
          ) : null}
          <Text
            style={[
              typography.body,
              { color: colors.text },
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {truncateText(item.ai_response, 100)}
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

export default function MemoryScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const { auth } = useAppContext();
  const { session } = auth;

  const {
    memories,
    loading,
    error,
    count,
    loadMemories,
    deleteMemory,
    clearAllMemories,
  } = useMemory(session);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMemories();
    setRefreshing(false);
  };

  const handleDeleteMemory = (memory) => {
    const messagePreview =
      memory.user_message || memory.ai_response || "";
    const preview = truncateText(messagePreview, 50);

    Alert.alert(
      "Delete Memory?",
      preview
        ? `Are you sure you want to delete this memory?\n\n"${preview}"`
        : "Are you sure you want to delete this memory?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMemory(memory) },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Memories?",
      "Are you sure you want to delete all memories? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearAllMemories },
      ]
    );
  };

  const renderMemory = ({ item }) => (
    <MemoryCard
      item={item}
      onPress={() => {}}
      onDelete={() => handleDeleteMemory(item)}
    />
  );

  const ListHeader = () => (
    <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.md }}>
      <Text
        style={[
          typography.title,
          { color: colors.text },
        ]}
      >
        Memory
      </Text>
      {count !== null && (
        <Text
          style={[
            typography.caption,
            { color: colors.textMuted, marginTop: 4 },
          ]}
        >
          {count} {count === 1 ? "memory" : "memories"} saved
        </Text>
      )}
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={48} color={colors.textDim} />
      <Text
        style={[
          typography.title,
          { color: colors.text, marginTop: 16 },
        ]}
      >
        No Memories Yet
      </Text>
      <Text
        style={[
          typography.body,
          { color: colors.textMuted, textAlign: "center", marginTop: 8 },
        ]}
      >
        Memories will appear here as the AI remembers important details
      </Text>
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
        onPress={loadMemories}
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

  if (loading && memories.length === 0 && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ListHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error && memories.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ListHeader />
        <ErrorState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id || `memory-${Date.now()}`}
        renderItem={renderMemory}
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

      {memories.length > 0 && (
        <View
          style={{
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <TouchableOpacity
            onPress={handleClearAll}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.7}
            hitSlop={16}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text
              style={{
                color: colors.danger,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Clear All Memories
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  memoryCard: {
    borderWidth: 1,
    marginBottom: 8,
  },
  memoryContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  memoryText: {
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
});

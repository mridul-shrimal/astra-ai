import React from "react";

import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function ConversationManagement({
  conversations,
  selectedConversation,
  loadingConversations,
  actionLoading,
  onOpenConversation,
  onDeleteConversation,
  onPinConversation,
  onRefresh,
  onNewChat,
  onRenameConversation,
}) {
const renderConversation = ({ item }) => {
  const title =
    item.title?.trim() ||
    "New Conversation";

  const date =
    item.updated_at ||
    item.created_at ||
    "";

  const itemId =
    item.id || item.session_id;

  const selectedId =
    selectedConversation?.id ||
    selectedConversation?.session_id;

  const isSelected =
    selectedId === itemId;

  return (
    <View
      style={[
        styles.conversation,
        isSelected &&
          styles.conversationSelected,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() =>
          onOpenConversation(item)
        }
        style={styles.conversationMain}
      >
        <View style={styles.conversationContent}>
          <Text
            style={[
              styles.conversationTitle,
              isSelected &&
                styles.conversationTitleSelected,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>

          {!!date && (
            <Text
              style={styles.conversationDate}
              numberOfLines={1}
            >
              {date}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* =================================================
          CONVERSATION ACTIONS
      ================================================= */}

      <View style={styles.conversationActions}>
        
        <TouchableOpacity
  activeOpacity={0.7}
  style={styles.actionButton}
  onPress={() =>
    onPinConversation(item)
  }
  disabled={actionLoading}
  accessibilityRole="button"
  accessibilityLabel={`${item.pinned ? "Unpin" : "Pin"} ${title}`}
>
  <Text style={styles.actionText}>
    {item.pinned ? "📌" : "📍"}
  </Text>
</TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.actionButton}
          onPress={() =>
            onRenameConversation(item)
          }
          disabled={actionLoading}
          accessibilityRole="button"
          accessibilityLabel={`Rename ${title}`}
        >
          <Text style={styles.actionText}>
            ✎
          </Text>
        </TouchableOpacity>

       <TouchableOpacity
  activeOpacity={0.7}
  style={styles.actionButton}
  onPress={() =>
    onDeleteConversation(item)
  }
  disabled={actionLoading}
  accessibilityRole="button"
  accessibilityLabel={`Delete ${title}`}
>
  <Text style={styles.actionText}>
    🗑
  </Text>
</TouchableOpacity>
      </View>
    </View>
  );
};

  return (
    <View style={styles.container}>
      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Your Conversations
          </Text>

          <Text style={styles.sectionSubtitle}>
            Continue where you left off
          </Text>
        </View>

        {!loadingConversations &&
          conversations.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {conversations.length}
              </Text>
            </View>
          )}
      </View>

      {/* =================================================
          CONVERSATION LIST
      ================================================= */}

      {loadingConversations ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#22d3ee"
          />

          <Text style={styles.loadingText}>
            Loading conversations...
          </Text>
        </View>
      ) : (
        <FlatList
         data={[...conversations].sort(
  (a, b) =>
    Number(b.pinned) -
    Number(a.pinned)
)}
          keyExtractor={(item, index) =>
            String(
              item.id ||
                item.session_id ||
                index
            )
          }
          renderItem={renderConversation}
          refreshing={loadingConversations}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            conversations.length === 0 &&
              styles.emptyList,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>
                💬
              </Text>

              <Text style={styles.emptyTitle}>
                No conversations yet
              </Text>

              <Text style={styles.emptyText}>
                Start a new chat with Astra AI.
              </Text>
            </View>
          }
        />
      )}

      {/* =================================================
          NEW CHAT
      ================================================= */}

      <View style={styles.newChat}>
        <TouchableOpacity
  activeOpacity={0.8}
  style={[
    styles.newChatButton,
    actionLoading &&
      styles.newChatButtonDisabled,
  ]}
  onPress={onNewChat}
  disabled={actionLoading}
>
          {actionLoading ? (
  <ActivityIndicator
    size="small"
    color="#ffffff"
  />
) : (
  <>
    <Text style={styles.newChatIcon}>
      +
    </Text>

    <Text style={styles.newChatText}>
      New Chat
    </Text>
  </>
)}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#164e63",
  },
conversationMain: {
  flex: 1,
},

conversationActions: {
  flexDirection: "row",
  alignItems: "center",
  marginLeft: 8,
},

actionButton: {
  width: 38,
  height: 38,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

actionText: {
  fontSize: 20,
  color: "#94a3b8",
},

deleteActionText: {
  fontSize: 22,
  color: "#94a3b8",
},

  countText: {
    color: "#67e8f9",
    fontSize: 13,
    fontWeight: "700",
  },

  list: {
    paddingBottom: 20,
  },

  emptyList: {
    flexGrow: 1,
  },

  conversation: {
  padding: 12,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#1e293b",
  borderRadius: 14,
  backgroundColor: "#0f172a",
  flexDirection: "row",
  alignItems: "center",
},

  conversationSelected: {
    borderColor: "#06b6d4",
    backgroundColor: "#083344",
  },

  conversationContent: {
    flex: 1,
  },

  conversationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e2e8f0",
  },

  conversationTitleSelected: {
    color: "#67e8f9",
  },

  conversationDate: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748b",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#94a3b8",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 50,
  },

  emptyIcon: {
    fontSize: 38,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#e2e8f0",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b",
    textAlign: "center",
  },

  newChat: {
    paddingTop: 10,
    paddingBottom: 4,
  },

newChatButton: {
  minHeight: 52,
  borderRadius: 14,
  backgroundColor: "#06b6d4",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},

newChatButtonDisabled: {
  opacity: 0.6,
},


  newChatIcon: {
    marginRight: 8,
    color: "#ffffff",
    fontSize: 24,
    lineHeight: 24,
  },

  newChatText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
};

export default ConversationManagement;
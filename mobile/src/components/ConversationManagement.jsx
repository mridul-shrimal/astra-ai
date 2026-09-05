import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getConversationSessionId } from "@astra/shared";

export default function ConversationManagement({
  conversations,
  selectedConversation,
  loadingConversations,
  actionLoading,
  onOpenConversation,
  onDeleteConversation,
  onArchiveConversation,
  onToggleLockConversation,
  onPinConversation,
  onDuplicateConversation,
  onRefresh,
  onNewChat,
  onRenameConversation,
  onRequestUnlock,
}) {
  const [menuConversation, setMenuConversation] = useState(null);

  const active = useMemo(
    () =>
      conversations
        .filter((item) => !item.archived)
        .sort(
          (a, b) => Number(b.pinned) - Number(a.pinned)
        ),
    [conversations]
  );

  const archived = useMemo(
    () => conversations.filter((item) => item.archived),
    [conversations]
  );

  const run = (action) => {
    const item = menuConversation;

    setMenuConversation(null);

    if (item) {
      action(item);
    }
  };

  const renderItem = ({ item }) => {
    const selected =
      getConversationSessionId(item) ===
      getConversationSessionId(selectedConversation);

    return (
      <View
        style={[
          styles.conversation,
          selected && styles.selected,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() =>
            item.locked
              ? onRequestUnlock(item)
              : onOpenConversation(item)
          }
        >
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {item.pinned ? "📌 " : ""}
            {item.locked ? "🔒 " : ""}
            {item.title?.trim() || "New Conversation"}
          </Text>

          <Text style={styles.date}>
            {item.updated_at ||
              item.created_at ||
              ""}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.more}
          onPress={() => setMenuConversation(item)}
          disabled={actionLoading}
        >
          <Text style={styles.moreText}>•••</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            Your Conversations
          </Text>

          <Text style={styles.subtitle}>
            Continue where you left off
          </Text>
        </View>

        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.refresh}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loadingConversations ? (
        <View style={styles.center}>
          <ActivityIndicator color="#22d3ee" />

          <Text style={styles.subtitle}>
            Loading conversations...
          </Text>
        </View>
      ) : (
        <FlatList
          data={active}
          keyExtractor={(item, index) =>
            String(
              getConversationSessionId(item) || index
            )
          }
          renderItem={renderItem}
          refreshing={loadingConversations}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.heading}>
                No conversations yet
              </Text>

              <Text style={styles.subtitle}>
                Start a new chat with Astra AI.
              </Text>
            </View>
          }
          ListFooterComponent={
            archived.length ? (
              <View style={styles.archived}>
                <Text style={styles.archivedTitle}>
                  Archived ({archived.length})
                </Text>

                {archived.map((item) => (
                  <View
                    key={getConversationSessionId(item)}
                    style={styles.archivedItem}
                  >
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() =>
                        item.locked
                          ? onRequestUnlock(item)
                          : onOpenConversation(item)
                      }
                    >
                      <Text
                        style={styles.title}
                        numberOfLines={1}
                      >
                        {item.title ||
                          "New Conversation"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        onArchiveConversation(item)
                      }
                    >
                      <Text style={styles.restore}>
                        Restore
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setMenuConversation(item)
                      }
                    >
                      <Text style={styles.moreText}>
                        •••
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null
          }
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={[
          styles.newButton,
          actionLoading && { opacity: 0.5 },
        ]}
        onPress={onNewChat}
        disabled={actionLoading}
      >
        <Text style={styles.newText}>
          + New Chat
        </Text>
      </TouchableOpacity>

      <Modal
        visible={!!menuConversation}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setMenuConversation(null)
        }
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuConversation(null)}
        >
          <View style={styles.menu}>
            <Text
              style={styles.menuTitle}
              numberOfLines={1}
            >
              {menuConversation?.title ||
                "Conversation"}
            </Text>

            <Menu
              text="Rename"
              onPress={() =>
                run(onRenameConversation)
              }
            />

            <Menu
              text="Duplicate"
              onPress={() =>
                run(onDuplicateConversation)
              }
            />

            <Menu
              text={
                menuConversation?.pinned
                  ? "Unpin"
                  : "Pin"
              }
              onPress={() => run(onPinConversation)}
            />

            <Menu
              text={
                menuConversation?.archived
                  ? "Restore"
                  : "Archive"
              }
              onPress={() =>
                run(onArchiveConversation)
              }
            />

            <Menu
              text={
                menuConversation?.locked
                  ? "Unlock"
                  : "Lock"
              }
              onPress={() =>
                run(onToggleLockConversation)
              }
            />

            <Menu
              text="Delete"
              destructive
              onPress={() =>
                run(onDeleteConversation)
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function Menu({ text, destructive, onPress }) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
    >
      <Text
        style={
          destructive
            ? styles.delete
            : styles.menuText
        }
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  heading: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 13,
  },

  refresh: {
    color: "#22d3ee",
    fontWeight: "700",
    padding: 8,
  },

  center: {
    alignItems: "center",
    padding: 40,
  },

  list: {
    paddingBottom: 12,
  },

  conversation: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    marginBottom: 9,
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderWidth: 1,
    borderRadius: 14,
  },

  selected: {
    borderColor: "#06b6d4",
    backgroundColor: "#083344",
  },

  title: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "600",
  },

  date: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 5,
  },

  more: {
    width: 45,
    alignItems: "center",
    paddingVertical: 8,
  },

  moreText: {
    color: "#94a3b8",
    fontSize: 18,
  },

  archived: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },

  archivedTitle: {
    color: "#fbbf24",
    fontWeight: "700",
    marginBottom: 8,
  },

  archivedItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 11,
    backgroundColor: "#0f172a",
    marginBottom: 7,
    borderRadius: 10,
  },

  restore: {
    color: "#22d3ee",
    fontWeight: "700",
    marginRight: 15,
  },

  newButton: {
    backgroundColor: "#06b6d4",
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  newText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,.55)",
  },

  menu: {
    padding: 17,
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderColor: "#1e293b",
    borderWidth: 1,
  },

  menuTitle: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 16,
    paddingBottom: 8,
  },

  menuItem: {
    paddingVertical: 14,
  },

  menuText: {
    color: "#e2e8f0",
    fontSize: 16,
  },

  delete: {
    color: "#f87171",
    fontSize: 16,
    fontWeight: "700",
  },
};


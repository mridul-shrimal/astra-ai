import {
  Animated,
  Alert,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useSidebar, navigate } from "../context/SidebarContext";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";
import { getConversationSessionId } from "@astra/shared";

const SIDEBAR_WIDTH = 280;

const NAV_ITEMS = [
  { name: "Home", label: "Home", icon: "home-outline" },
  { name: "Chat", label: "Chat", icon: "chatbubble-outline" },
  { name: "Memory", label: "Memory", icon: "bookmark-outline" },
  { name: "Settings", label: "Settings", icon: "settings-outline" },
];

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
  if (!title) return "New Chat";
  const trimmed = title.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + "…";
};

function ConversationItem({
  conv,
  selectedConversation,
  onSelectConversation,
}) {
  const { colors, spacing, radius, typography } = useTheme();
  const isActive =
    selectedConversation &&
    getConversationSessionId(selectedConversation) ===
      getConversationSessionId(conv);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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
    <Animated.View key={getConversationSessionId(conv)} style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.conversationItem,
          {
            backgroundColor: isActive ? colors.primaryDim : "transparent",
            borderRadius: radius.md,
            marginHorizontal: spacing.md,
            padding: spacing.md,
          },
        ]}
        onPress={() => onSelectConversation(conv)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        hitSlop={4}
      >
        <View style={styles.conversationContent}>
          <Text
            style={[
              typography.body,
              {
                color: isActive ? colors.primary : colors.text,
                fontWeight: isActive ? "600" : "400",
                fontSize: 15,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {truncateTitle(conv.title) || "New Chat"}
          </Text>
          {conv.updated_at ? (
            <Text
              style={[
                typography.caption,
                {
                  color: isActive ? colors.primaryDim : colors.textMuted,
                },
              ]}
            >
              {formatDate(conv.updated_at)}
            </Text>
          ) : null}
        </View>
        {isActive && (
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Sidebar({ currentRoute }) {
  const { isOpen, closeSidebar } = useSidebar();
  const { colors, spacing, radius, typography } = useTheme();
  const { conversations: convState, auth } = useAppContext();

  const {
    conversations,
    selectedConversation,
    loadingConversations,
    openConversation,
    startNewChat,
  } = convState;

  const handleNavigate = (name) => {
    if (name === "Chat" && !selectedConversation) {
      navigate("Home");
      closeSidebar();
      return;
    }
    navigate(name);
    closeSidebar();
  };

  const handleNewChat = async () => {
    startNewChat();
    navigate("Home");
    closeSidebar();
  };

  const handleSelectConversation = (conversation) => {
    if (conversation.locked) {
      Alert.alert(
        "Conversation Locked",
        "Unlock this conversation from the conversation actions before opening it."
      );
      return;
    }
    openConversation(conversation);
    navigate("Chat");
    closeSidebar();
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      Alert.alert("Sign Out Failed", error.message || "Could not sign out.");
      return;
    }
    closeSidebar();
  };

  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isOpen, translateX]);

  const conversationsToRender = [...conversations].sort((a, b) => {
    const aDate = new Date(a.updated_at || a.created_at || 0);
    const bDate = new Date(b.updated_at || b.created_at || 0);
    return bDate - aDate;
  });

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={[styles.overlay, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={closeSidebar}
        />
      )}

      <Animated.View
        style={[
          styles.sidebar,
          {
            width: SIDEBAR_WIDTH,
            backgroundColor: colors.surface,
            transform: [{ translateX }],
          },
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={styles.safeArea}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text
                style={[
                  typography.title,
                  { color: colors.text, fontWeight: "700" },
                ]}
              >
                Astra AI
              </Text>
              <TouchableOpacity
                onPress={closeSidebar}
                activeOpacity={0.7}
                style={[styles.closeBtn, { padding: 8 }]}
              >
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                typography.caption,
                { color: colors.textMuted, marginTop: 4 },
              ]}
            >
              Premium Mobile UI
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleNewChat}
            style={[
              styles.newChatBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.md,
                marginHorizontal: spacing.lg,
                marginTop: spacing.xl,
              },
            ]}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color={colors.background} />
            <Text
              style={[
                typography.body,
                {
                  color: colors.background,
                  fontWeight: "600",
                  marginLeft: 8,
                },
              ]}
            >
              New Chat
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              typography.caption,
              {
                color: colors.textMuted,
                marginHorizontal: spacing.lg,
                marginTop: spacing.md,
                marginBottom: spacing.sm,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              },
            ]}
          >
            Conversations
          </Text>

          <ScrollView
            style={{ marginTop: spacing.sm }}
            showsVerticalScrollIndicator={false}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.name;

              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => handleNavigate(item.name)}
                  style={[
                    styles.navItem,
                    {
                      backgroundColor: isActive
                        ? colors.primaryDim
                        : "transparent",
                      marginHorizontal: spacing.lg,
                      borderRadius: radius.md,
                      padding: spacing.md,
                    },
                  ]}
                  activeOpacity={0.7}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={isActive ? colors.primary : colors.icon}
                    style={styles.navIcon}
                  />
                  <Text
                    style={[
                      typography.body,
                      {
                        color: isActive ? colors.primary : colors.text,
                        fontWeight: isActive ? "600" : "400",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            
            {loadingConversations ? (
              <View
                style={{
                  padding: spacing.lg,
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    typography.caption,
                    { color: colors.textMuted },
                  ]}
                >
                  Loading conversations...
                </Text>
              </View>
            ) : conversationsToRender.length === 0 ? (
              <View
                style={{
                  padding: spacing.lg,
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={24}
                  color={colors.textDim}
                />
                <Text
                  style={[
                    typography.caption,
                    {
                      color: colors.textMuted,
                      textAlign: "center",
                    },
                  ]}
                >
                  No conversations yet. Start a new chat!
                </Text>
              </View>
            ) : (
              conversationsToRender.map((conv) => (
                <ConversationItem
                  key={getConversationSessionId(conv)}
                  conv={conv}
                  selectedConversation={selectedConversation}
                  onSelectConversation={handleSelectConversation}
                />
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => handleNavigate("Settings")}
              style={[
                styles.navItem,
                {
                  backgroundColor: "transparent",
                  marginHorizontal: spacing.lg,
                  borderRadius: radius.md,
                  padding: spacing.md,
                },
              ]}
              activeOpacity={0.7}
              accessibilityLabel="Profile"
              accessibilityRole="button"
            >
              <Ionicons
                name="person-circle-outline"
                size={22}
                color={colors.icon}
                style={styles.navIcon}
              />
              <Text style={[typography.body, { color: colors.text }]}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignOut}
              style={[
                styles.navItem,
                {
                  backgroundColor: "transparent",
                  marginHorizontal: spacing.lg,
                  borderRadius: radius.md,
                  padding: spacing.md,
                },
              ]}
              activeOpacity={0.7}
              accessibilityLabel="Sign out"
              accessibilityRole="button"
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={colors.danger}
                style={styles.navIcon}
              />
              <Text style={[typography.body, { color: colors.danger }]}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sidebar: {
    ...StyleSheet.absoluteFillObject,
    elevation: 16,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  closeBtn: {
    marginRight: 4,
  },
  newChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginTop: 4,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  navIcon: {
    marginRight: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  conversationContent: {
    flex: 1,
    marginRight: 8,
  },
});

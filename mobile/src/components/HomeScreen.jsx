import {
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ConversationManagement from "./ConversationManagement";

function HomeScreen({
  styles,
  userEmail,
  authLoading,
  onLogout,
  onOpenSettings,
  onOpenMemory,
  isLight,
  conversations,
  selectedConversation,
  loadingConversations,
  actionLoading,
  onOpenConversation,
  onRefresh,
  onNewChat,
  onRenameConversation,
  onPinConversation,
  onArchiveConversation,
  onToggleLockConversation,
  onRequestUnlock,
  onDeleteConversation,
  onDuplicateConversation,
  renameConversationTarget,
  renameText,
  onRenameTextChange,
  onCloseRename,
  onSaveRename,
  lockConversationTarget,
  lockPinText,
  onLockPinTextChange,
  onCloseLock,
  onSaveLock,
}) {
  return (
    <SafeAreaView style={[styles.container, isLight && { backgroundColor: "#f8fafc" }]}>
      <View style={[styles.header, isLight && { backgroundColor: "#ffffff", borderBottomColor: "#cbd5e1" }]}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>
              ✦
            </Text>
          </View>

          <View style={styles.headerBrandText}>
            <Text style={styles.appTitle}>
              Astra AI
            </Text>

            <Text
              style={styles.userEmail}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userEmail}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.logoutButton}
          onPress={onOpenMemory}
          accessibilityRole="button"
          accessibilityLabel="Open memory"
        >
          <Text style={styles.logoutButtonText}>Memory</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.logoutButton}
          onPress={onOpenSettings}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Text style={styles.logoutButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.logoutButton}
          onPress={onLogout}
          disabled={authLoading}
          accessibilityRole="button"
          accessibilityLabel="Log out of Astra AI"
        >
          <Text style={styles.logoutButtonText}>
            Logout
          </Text>
        </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.content, isLight && { backgroundColor: "#f8fafc" }]}>
        <ConversationManagement
          conversations={conversations}
          selectedConversation={selectedConversation}
          loadingConversations={loadingConversations}
          actionLoading={actionLoading}
          onOpenConversation={onOpenConversation}
          onRefresh={onRefresh}
          onNewChat={onNewChat}
          onRenameConversation={onRenameConversation}
          onPinConversation={onPinConversation}
          onArchiveConversation={onArchiveConversation}
          onToggleLockConversation={onToggleLockConversation}
          onRequestUnlock={onRequestUnlock}
          onDeleteConversation={onDeleteConversation}
          onDuplicateConversation={onDuplicateConversation}
        />

        <Modal
          visible={!!renameConversationTarget}
          transparent
          animationType="fade"
          onRequestClose={onCloseRename}
        >
          <View style={styles.renameModalOverlay}>
            <View style={styles.renameModal}>
              <Text style={styles.renameModalTitle}>
                Rename Chat
              </Text>

              <Text style={styles.renameModalDescription}>
                Enter a new name for this conversation.
              </Text>

              <TextInput
                style={styles.renameInput}
                value={renameText}
                onChangeText={onRenameTextChange}
                placeholder="Conversation name"
                placeholderTextColor="#64748b"
                autoFocus
                maxLength={100}
              />

              <View style={styles.renameModalActions}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onCloseRename}
                >
                  <Text style={styles.renameCancelText}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onSaveRename}
                >
                  <Text style={styles.renameSaveText}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={!!lockConversationTarget}
          transparent
          animationType="fade"
          onRequestClose={onCloseLock}
        >
          <View style={styles.renameModalOverlay}>
            <View style={styles.renameModal}>
              <Text style={styles.renameModalTitle}>
                {lockConversationTarget?.locked
                  ? "🔓 Unlock Chat"
                  : "🔒 Lock Chat"}
              </Text>

              <Text style={styles.renameModalDescription}>
                {lockConversationTarget?.locked
                  ? "Enter the 4-digit PIN to unlock this conversation."
                  : "Create a 4-digit PIN to lock this conversation."}
              </Text>

              <TextInput
                style={styles.renameInput}
                value={lockPinText}
                onChangeText={onLockPinTextChange}
                placeholder="4-digit PIN"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                autoFocus
              />

              <View style={styles.renameModalActions}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onCloseLock}
                >
                  <Text style={styles.renameCancelText}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onSaveLock}
                >
                  <Text style={styles.renameSaveText}>
                    {lockConversationTarget?.locked
                      ? "Unlock"
                      : "Lock"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

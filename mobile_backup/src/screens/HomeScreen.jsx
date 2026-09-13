import { useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { getConversationSessionId } from "@astra/shared";

import { ActionSheet, Button, Card, EmptyState, Header, LoadingState, Screen } from "../components/ui";
import { useTheme } from "../theme/ThemeProvider";

function ConversationCard({ conversation, selected, onOpen, onMenu }) {
  const { colors, spacing, typography } = useTheme();
  const timestamp = conversation.updated_at || conversation.created_at;
  return <Card style={[styles.card, selected && { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}><TouchableOpacity style={styles.cardPress} onPress={onOpen}><View style={styles.cardText}><Text style={[typography.label, { color: colors.text }]} numberOfLines={1}>{conversation.pinned ? "Pinned · " : ""}{conversation.locked ? "Locked · " : ""}{conversation.title || "New Chat"}</Text>{timestamp ? <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xxs }]} numberOfLines={1}>{String(timestamp)}</Text> : null}</View></TouchableOpacity><TouchableOpacity style={[styles.more, { backgroundColor: colors.surfaceMuted }]} onPress={onMenu} accessibilityLabel="Conversation actions"><Text style={[styles.moreText, { color: colors.text }]}>•••</Text></TouchableOpacity></Card>;
}

export default function HomeScreen({ userEmail, conversations, selectedConversation, loading, actionLoading, onRefresh, onNewChat, onOpen, onRename, onDuplicate, onPin, onArchive, onLock, onDelete, onUnlock, onSettings, onMemory, onLogout }) {
  const { colors, spacing, typography } = useTheme();
  const [menuConversation, setMenuConversation] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameText, setRenameText] = useState("");
  const active = useMemo(() => conversations.filter((item) => !item.archived).sort((a, b) => Number(b.pinned) - Number(a.pinned)), [conversations]);
  const archived = useMemo(() => conversations.filter((item) => item.archived), [conversations]);
  const run = (handler) => { const item = menuConversation; setMenuConversation(null); if (item) handler(item); };
  const requestRename = (item) => { setMenuConversation(null); setRenameTarget(item); setRenameText(item.title || "New Chat"); };
  const saveRename = () => { const title = renameText.trim(); if (!title) return; onRename(renameTarget, title); setRenameTarget(null); };
  const open = (item) => item.locked ? onUnlock(item) : onOpen(item);
  const actions = menuConversation ? [
    { label: "Rename", onPress: () => requestRename(menuConversation) },
    { label: "Duplicate", onPress: () => run(onDuplicate) },
    { label: menuConversation.pinned ? "Unpin" : "Pin", onPress: () => run(onPin) },
    { label: menuConversation.archived ? "Restore" : "Archive", onPress: () => run(onArchive) },
    { label: menuConversation.locked ? "Unlock" : "Lock", onPress: () => run(onLock) },
    { label: "Delete", destructive: true, onPress: () => run(onDelete) },
  ] : [];
  return <Screen><Header title="Astra AI" subtitle={userEmail} right={<View style={styles.headerActions}><TouchableOpacity onPress={onMemory}><Text style={[styles.headerLink, { color: colors.primary }]}>Memory</Text></TouchableOpacity><TouchableOpacity onPress={onSettings}><Text style={[styles.headerLink, { color: colors.primary }]}>Settings</Text></TouchableOpacity></View>} /><View style={[styles.content, { padding: spacing.md }]}><View style={styles.titleRow}><View><Text style={[typography.display, { color: colors.text }]}>Your conversations</Text><Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xxs }]}>Continue where you left off</Text></View><TouchableOpacity style={[styles.refresh, { backgroundColor: colors.surfaceMuted }]} onPress={onRefresh}><Text style={[typography.label, { color: colors.primary }]}>Refresh</Text></TouchableOpacity></View>{loading ? <LoadingState label="Loading conversations…" /> : <FlatList data={active} keyExtractor={(item, index) => String(getConversationSessionId(item) || index)} renderItem={({ item }) => <ConversationCard conversation={item} selected={getConversationSessionId(item) === getConversationSessionId(selectedConversation)} onOpen={() => open(item)} onMenu={() => setMenuConversation(item)} />} ListEmptyComponent={<EmptyState title="No conversations yet" description="Start a new chat with Astra AI." />} ListFooterComponent={archived.length ? <View style={{ marginTop: spacing.md }}><Text style={[typography.section, { color: colors.text, marginBottom: spacing.sm }]}>Archived ({archived.length})</Text>{archived.map((item) => <ConversationCard key={getConversationSessionId(item)} conversation={item} onOpen={() => open(item)} onMenu={() => setMenuConversation(item)} />)}</View> : null} contentContainerStyle={styles.list} />}</View><View style={[styles.bottom, { borderTopColor: colors.border, backgroundColor: colors.background, padding: spacing.md }]}><Button label={actionLoading ? "Working…" : "+ New Chat"} disabled={actionLoading} onPress={onNewChat} /></View><ActionSheet visible={!!menuConversation} title={menuConversation?.title || "Conversation"} actions={actions} onClose={() => setMenuConversation(null)} />{renameTarget ? <AlertPrompt title="Rename conversation" value={renameText} onChange={setRenameText} onCancel={() => setRenameTarget(null)} onSave={saveRename} /> : null}</Screen>;
}

function AlertPrompt({ title, value, onChange, onCancel, onSave }) {
  const { colors, spacing, radius, typography } = useTheme();
  return <Modal transparent visible onRequestClose={onCancel}><View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}><Card style={styles.renameModal}><Text style={[typography.title, { color: colors.text }]}>{title}</Text><TextInput value={value} onChangeText={onChange} autoFocus maxLength={100} placeholder="Conversation name" placeholderTextColor={colors.textMuted} style={[styles.renameInput, typography.body, { color: colors.text, borderColor: colors.border, borderRadius: radius.sm, marginTop: spacing.md }]} /><View style={styles.renameActions}><Button label="Cancel" variant="secondary" onPress={onCancel} style={{ flex: 1 }} /><Button label="Save" onPress={onSave} style={{ flex: 1 }} /></View></Card></View></Modal>;
}

const styles = StyleSheet.create({ content: { flex: 1 }, headerActions: { flexDirection: "row", gap: 12 }, headerLink: { fontSize: 12, fontWeight: "700" }, titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, refresh: { minHeight: 40, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", borderRadius: 12 }, list: { paddingBottom: 80 }, card: { flexDirection: "row", alignItems: "center", marginBottom: 8, padding: 0, overflow: "hidden" }, cardPress: { flex: 1, minHeight: 60, justifyContent: "center", paddingHorizontal: 12 }, cardText: { flex: 1 }, more: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12, marginRight: 8 }, moreText: { fontSize: 14, fontWeight: "800" }, bottom: { borderTopWidth: StyleSheet.hairlineWidth }, modalOverlay: { flex: 1, justifyContent: "center", padding: 20 }, renameModal: { width: "100%" }, renameInput: { minHeight: 48, borderWidth: 1, paddingHorizontal: 12 }, renameActions: { flexDirection: "row", gap: 10, marginTop: 16 }, });

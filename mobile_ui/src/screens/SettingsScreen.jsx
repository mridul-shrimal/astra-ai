import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";
import usePreferences from "../hooks/usePreferences";
import useMemory from "../hooks/useMemory";

const SettingSection = ({ title, children, colors, typography, spacing }) => (
  <View
    style={{
      backgroundColor: colors.surface,
      borderRadius: spacing.sm,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      overflow: "hidden",
    }}
  >
    <Text
      style={[
        typography.caption,
        {
          color: colors.textMuted,
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xs,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontSize: 11,
        },
      ]}
    >
      {title}
    </Text>
    {children}
  </View>
);

function ToggleRow({ label, detail, value, onChange }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border, paddingVertical: spacing.sm }]}>
      <View style={styles.rowText}>
        <Text style={[typography.label, { color: colors.text }]}>{label}</Text>
        {detail ? <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>{detail}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.primary }} />
    </View>
  );
}

function Choices({ values, selected, onSelect }) {
  const { colors, radius, spacing, typography } = useTheme();
  return (
    <View style={[styles.choices, { marginTop: spacing.sm }]}>
      {values.map(([value, label]) => (
        <TouchableOpacity
          key={value}
          onPress={() => onSelect(value)}
          style={[
            styles.choice,
            {
              borderColor: selected === value ? colors.primary : colors.border,
              backgroundColor: selected === value ? colors.primarySoft : colors.surfaceMuted,
              borderRadius: radius.sm,
            },
          ]}
        >
          <Text style={[typography.caption, { color: selected === value ? colors.primary : colors.text }]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const SettingRow = ({ icon, label, value, onPress, colors, typography, isLast }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      styles.settingRow,
      {
        borderBottomColor: colors.border,
        borderBottomWidth: isLast ? 0 : 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
      },
    ]}
  >
    {icon ? (
      <Ionicons name={icon} size={20} color={colors.icon} style={styles.settingIcon} />
    ) : null}
    <Text
      style={[typography.body, { color: colors.text, flex: 1, fontSize: 16 }]}
      numberOfLines={0}
    >
      {label}
    </Text>
    {value !== undefined && (
      <Text
        style={[
          typography.caption,
          { color: colors.textMuted, fontSize: 14, flexShrink: 1, textAlign: "right" },
        ]}
      >
        {value}
      </Text>
    )}
  </TouchableOpacity>
);

const ThemeOption = ({ label, value, selected, onSelect, colors, typography }) => (
  <TouchableOpacity
    onPress={() => onSelect(value)}
    activeOpacity={0.7}
    style={[
      styles.themeOption,
      {
        backgroundColor: selected ? colors.primaryDim : colors.surface,
        borderColor: selected ? colors.primary : colors.border,
      },
    ]}
  >
    <Text
      style={[
        typography.body,
        {
          color: selected ? colors.primary : colors.text,
          fontWeight: selected ? "600" : "400",
        },
      ]}
    >
      {label}
    </Text>
    {selected && (
      <Ionicons name="checkmark" size={18} color={colors.primary} />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { colors, typography, spacing, radius, preferences, updateTheme } = useTheme();
  const { setPreference } = usePreferences();
  const { auth } = useAppContext();
  const { session } = auth;
  const { clearAllMemories } = useMemory(session);

  const [signingOut, setSigningOut] = useState(false);

  const currentTheme = preferences.theme || "system";
  const userEmail = session?.user?.email || "Not signed in";
  const appVersion = "1.0.0";

  const handleThemeSelect = useCallback((theme) => {
    updateTheme(theme);
  }, [updateTheme]);

  const handleSetPreference = useCallback((key, value) => {
    setPreference(key, value);
  }, [setPreference]);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setSigningOut(true);
            try {
              await auth.signOut();
            } catch (err) {
              Alert.alert("Sign Out Failed", err.message || "Could not sign out.");
            } finally {
              setSigningOut(false);
            }
          },
        },
      ]
    );
  };

  const handleOpenPrivacy = () => {
    Linking.openURL("https://example.com/privacy");
  };

  const handleOpenTerms = () => {
    Linking.openURL("https://example.com/terms");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[typography.title, { color: colors.text }]}>
          Settings
        </Text>
      </View>

      <View style={{ marginTop: spacing.sm }}>
        <SettingSection
          title="Appearance"
          colors={colors}
          typography={typography}
          spacing={spacing}
        >
          <View style={{ padding: spacing.md, gap: 10 }}>
            <ThemeOption
              label="System"
              value="system"
              selected={currentTheme === "system"}
              onSelect={handleThemeSelect}
              colors={colors}
              typography={typography}
            />
            <ThemeOption
              label="Light"
              value="light"
              selected={currentTheme === "light"}
              onSelect={handleThemeSelect}
              colors={colors}
              typography={typography}
            />
            <ThemeOption
              label="Dark"
              value="dark"
              selected={currentTheme === "dark"}
              onSelect={handleThemeSelect}
              colors={colors}
              typography={typography}
            />
          </View>
        </SettingSection>

        <SettingSection
          title="AI Preferences"
          colors={colors}
          typography={typography}
          spacing={spacing}
        >
          <Text style={[typography.label, { color: colors.text, marginBottom: spacing.sm }]}>
            Model
          </Text>
          <Choices
            values={[
              ["mistralai/mistral-small-3.2-24b-instruct", "Mistral Small 3.2"],
              ["google/gemma-3-27b-it", "Gemma 3 27B"],
              ["deepseek/deepseek-chat-v3", "DeepSeek Chat V3"],
              ["openai/gpt-oss-20b", "GPT OSS 20B"],
            ]}
            selected={preferences.model}
            onSelect={(value) => handleSetPreference("model", value)}
            colors={colors}
            typography={typography}
          />
          <Text style={[typography.label, { color: colors.text, marginTop: spacing.md }]}>
            Temperature: {Number(preferences.temperature).toFixed(1)}
          </Text>
          <Choices
            values={[[0, "0"], [0.3, "0.3"], [0.5, "0.5"], [0.7, "0.7"], [1, "1"]]}
            selected={preferences.temperature}
            onSelect={(value) => handleSetPreference("temperature", value)}
            colors={colors}
            typography={typography}
          />
          <ToggleRow
            label="Auto read aloud"
            detail="Saved preference for supported voice output."
            value={preferences.autoRead}
            onChange={(value) => handleSetPreference("autoRead", value)}
          />
        </SettingSection>

        <SettingSection
          title="Chat"
          colors={colors}
          typography={typography}
          spacing={spacing}
        >
          <ToggleRow
            label="Enter to send"
            value={preferences.enterToSend}
            onChange={(value) => handleSetPreference("enterToSend", value)}
          />
          <ToggleRow
            label="Show timestamps"
            value={preferences.showTimestamp}
            onChange={(value) => handleSetPreference("showTimestamp", value)}
          />
          <Text style={[typography.label, { color: colors.text, marginTop: spacing.sm }]}>
            Font size
          </Text>
          <Choices
            values={[["small", "Small"], ["medium", "Medium"], ["large", "Large"]]}
            selected={preferences.fontSize}
            onSelect={(value) => handleSetPreference("fontSize", value)}
            colors={colors}
            typography={typography}
          />
        </SettingSection>

        <SettingSection
          title="Account"
          colors={colors}
          typography={typography}
          spacing={spacing}
        >
          <SettingRow
            icon="mail-outline"
            label="Email"
            value={userEmail}
            onPress={() => {}}
            colors={colors}
            typography={typography}
            isLast={false}
          />
          <SettingRow
            icon={signingOut ? null : "log-out-outline"}
            label="Sign Out"
            onPress={handleSignOut}
            colors={colors}
            typography={typography}
            isLast={true}
          />
          {signingOut && (
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </SettingSection>

        <SettingSection
          title="Notifications"
          colors={colors}
          typography={typography}
          spacing={spacing}
        >
          <ToggleRow
            label="Push notifications"
            value={preferences.notificationEnabled}
            onChange={(value) => handleSetPreference("notificationEnabled", value)}
          />
          <ToggleRow
            label="Notification sound"
            value={preferences.notificationSound}
            onChange={(value) => handleSetPreference("notificationSound", value)}
          />
        </SettingSection>

        <SettingSection
          title="Memory"
          colors={colors}
          typography={typography}
          spacing={spacing}
        >
          <ToggleRow
            label="Enable memory"
            value={preferences.memoryEnabled}
            onChange={(value) => handleSetPreference("memoryEnabled", value)}
          />
          <ToggleRow
            label="Auto save memory"
            value={preferences.memoryAutoSave}
            onChange={(value) => handleSetPreference("memoryAutoSave", value)}
          />
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Clear all memories?", "This cannot be undone.", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await clearAllMemories();
                    } catch {
                      Alert.alert("Couldn't clear memories", "Please try again.");
                    }
                  },
                },
              ]);
            }}
            style={[styles.settingRow, { borderBottomWidth: 0 }]}
          >
            <Text style={[typography.label, { color: colors.danger }]}>
              Clear all memories
            </Text>
          </TouchableOpacity>
        </SettingSection>

        <SettingSection
          title="Security"
          colors={colors}
          typography={typography}
          spacing={spacing}
        >
          <SettingRow
            icon="key-outline"
            label="Biometric Lock"
            value={preferences.biometricEnabled ? "On" : "Off"}
            onPress={() => handleSetPreference("biometricEnabled", !preferences.biometricEnabled)}
            colors={colors}
            typography={typography}
            isLast={false}
          />
          <SettingRow
            icon="shield-checkmark-outline"
            label="Auto-Lock"
            value={preferences.autoLock || "never"}
            onPress={() => handleSetPreference("autoLock", preferences.autoLock === "never" ? "5m" : "never")}
            colors={colors}
            typography={typography}
            isLast={true}
          />
        </SettingSection>

        <SettingSection
          title="About"
          colors={colors}
          typography={typography}
          spacing={spacing}
        >
          <SettingRow
            icon="information-circle-outline"
            label="App Version"
            value={appVersion}
            onPress={() => {}}
            colors={colors}
            typography={typography}
            isLast={false}
          />
          <SettingRow
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={handleOpenPrivacy}
            colors={colors}
            typography={typography}
            isLast={false}
          />
          <SettingRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={handleOpenTerms}
            colors={colors}
            typography={typography}
            isLast={true}
          />
        </SettingSection>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
    paddingRight: 16,
  },
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  choice: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
  },
});

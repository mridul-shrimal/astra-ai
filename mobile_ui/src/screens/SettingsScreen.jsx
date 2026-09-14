import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";
import { defaultPreferences } from "../storage/preferences";

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
    >
      {label}
    </Text>
    {value !== undefined && (
      <Text
        style={[
          typography.caption,
          { color: colors.textMuted, fontSize: 14 },
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
  const { auth } = useAppContext();
  const { session } = auth;

  const [signingOut, setSigningOut] = useState(false);

  const currentTheme = preferences.theme || "system";
  const userEmail = session?.user?.email || "Not signed in";
  const appVersion = "1.0.0";

  const handleThemeSelect = useCallback((theme) => {
    updateTheme(theme);
  }, [updateTheme]);

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
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
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
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            value={defaultPreferences.notificationEnabled ? "On" : "Off"}
            onPress={() => {}}
            colors={colors}
            typography={typography}
            isLast={false}
          />
          <SettingRow
            icon="volume-high-outline"
            label="Notification Sound"
            value={defaultPreferences.notificationSound ? "On" : "Off"}
            onPress={() => {}}
            colors={colors}
            typography={typography}
            isLast={true}
          />
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
            value={defaultPreferences.biometricEnabled ? "On" : "Off"}
            onPress={() => {}}
            colors={colors}
            typography={typography}
            isLast={false}
          />
          <SettingRow
            icon="shield-checkmark-outline"
            label="Auto-Lock"
            value={defaultPreferences.autoLock || "never"}
            onPress={() => {}}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

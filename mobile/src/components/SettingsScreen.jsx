import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createMemoryService } from "@astra/shared";
import api from "../../api";
import { canUseBiometrics } from "../../security/biometrics";
import { requestNotificationPermission } from "../../notifications/notifications";

const memoryService = createMemoryService(api);

const models = [
  [
    "mistralai/mistral-small-3.2-24b-instruct",
    "Mistral Small 3.2",
  ],
  ["google/gemma-3-27b-it", "Gemma 3 27B"],
  ["deepseek/deepseek-chat-v3", "DeepSeek Chat V3"],
  ["openai/gpt-oss-20b", "GPT OSS 20B"],
];

function Toggle({ label, value, onChange, description }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>

        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: "#06b6d4" }}
      />
    </View>
  );
}

export default function SettingsScreen({
  preferences,
  setPreference,
  userEmail,
  onBack,
  onAccount,
  onLogout,
  onMemory,
}) {
  const [memoryCount, setMemoryCount] = useState(0);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    memoryService
      .getMemoryCount()
      .then(setMemoryCount)
      .catch(() => setMemoryCount(0));

    canUseBiometrics()
      .then(setBiometricAvailable)
      .catch(() => setBiometricAvailable(false));
  }, []);

  const clearMemory = () =>
    Alert.alert(
      "Clear all memories?",
      "This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await memoryService.clearMemories();
              setMemoryCount(0);
            } catch {
              Alert.alert(
                "Couldn't clear memories",
                "Please try again."
              );
            }
          },
        },
      ]
    );

  const toggleNotifications = async (value) => {
    if (!value) {
      return setPreference("notificationEnabled", false);
    }

    if (await requestNotificationPermission()) {
      setPreference("notificationEnabled", true);
    } else {
      Alert.alert(
        "Notifications unavailable",
        "Permission was not granted."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Settings</Text>

        <View style={{ width: 55 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.account}
          onPress={onAccount}
        >
          <Text style={styles.label}>Account</Text>
          <Text style={styles.description}>{userEmail}</Text>
        </TouchableOpacity>

        <Text style={styles.section}>Appearance</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Theme</Text>

          <View style={styles.choices}>
            {["dark", "light", "system"].map((theme) => (
              <TouchableOpacity
                key={theme}
                style={[
                  styles.choice,
                  preferences.theme === theme &&
                    styles.choiceActive,
                ]}
                onPress={() => setPreference("theme", theme)}
              >
                <Text style={styles.choiceText}>{theme}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.section}>AI preferences</Text>

        <View style={styles.card}>
          {models.map(([id, label]) => (
            <TouchableOpacity
              key={id}
              style={styles.selectRow}
              onPress={() => setPreference("model", id)}
            >
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.check}>
                {preferences.model === id ? "✓" : ""}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.label, { marginTop: 12 }]}>
            Temperature:{" "}
            {Number(preferences.temperature).toFixed(1)}
          </Text>

          <View style={styles.choices}>
            {[0, 0.3, 0.5, 0.7, 1].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.choice,
                  preferences.temperature === value &&
                    styles.choiceActive,
                ]}
                onPress={() =>
                  setPreference("temperature", value)
                }
              >
                <Text style={styles.choiceText}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Toggle
            label="Auto read aloud"
            value={preferences.autoRead}
            onChange={(v) => setPreference("autoRead", v)}
            description="Saved preference; speech requires a native TTS integration."
          />
        </View>

        <Text style={styles.section}>Chat</Text>

        <View style={styles.card}>
          <Toggle
            label="Enter to send"
            value={preferences.enterToSend}
            onChange={(v) => setPreference("enterToSend", v)}
          />

          <Toggle
            label="Show timestamps"
            value={preferences.showTimestamp}
            onChange={(v) =>
              setPreference("showTimestamp", v)
            }
          />

          <Text style={styles.label}>Font size</Text>

          <View style={styles.choices}>
            {["small", "medium", "large"].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.choice,
                  preferences.fontSize === value &&
                    styles.choiceActive,
                ]}
                onPress={() =>
                  setPreference("fontSize", value)
                }
              >
                <Text style={styles.choiceText}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.section}>Memory</Text>

        <View style={styles.card}>
          <Toggle
            label="Enable memory"
            value={preferences.memoryEnabled}
            onChange={(v) =>
              setPreference("memoryEnabled", v)
            }
          />

          <Toggle
            label="Auto save memory"
            value={preferences.memoryAutoSave}
            onChange={(v) =>
              setPreference("memoryAutoSave", v)
            }
          />

          <Text style={styles.description}>
            {memoryCount} stored memories
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onMemory}
          >
            <Text style={styles.buttonText}>
              Manage memory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={clearMemory}
          >
            <Text style={styles.buttonText}>
              Clear all memory
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.section}>Privacy & security</Text>

        <View style={styles.card}>
          <Toggle
            label="Require delete confirmation"
            value={preferences.deleteConfirmation}
            onChange={(v) =>
              setPreference("deleteConfirmation", v)
            }
          />

          <Toggle
            label="Biometric unlock"
            value={preferences.biometricEnabled}
            onChange={(v) =>
              biometricAvailable
                ? setPreference("biometricEnabled", v)
                : Alert.alert(
                    "Biometrics unavailable",
                    "Set up device biometrics first."
                  )
            }
            description={
              biometricAvailable
                ? "Use biometrics before the PIN fallback."
                : "No enrolled biometrics detected."
            }
          />

          <Text style={styles.description}>
            Conversation PIN locks remain local because the
            backend has no lock persistence.
          </Text>
        </View>

        <Text style={styles.section}>Notifications</Text>

        <View style={styles.card}>
          <Toggle
            label="Notifications"
            value={preferences.notificationEnabled}
            onChange={toggleNotifications}
            description="Requests local notification permission. Remote push needs backend infrastructure."
          />

          <Toggle
            label="Notification sound"
            value={preferences.notificationSound}
            onChange={(v) =>
              setPreference("notificationSound", v)
            }
          />
        </View>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={onLogout}
        >
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },

  header: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },

  back: {
    color: "#22d3ee",
    fontSize: 16,
  },

  title: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  section: {
    marginTop: 20,
    marginBottom: 8,
    color: "#67e8f9",
    fontSize: 14,
    fontWeight: "700",
  },

  card: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  account: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#083344",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  rowText: {
    flex: 1,
    paddingRight: 12,
  },

  label: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "600",
  },

  description: {
    marginTop: 3,
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 17,
  },

  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 9,
  },

  choice: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#1e293b",
  },

  choiceActive: {
    backgroundColor: "#0e7490",
  },

  choiceText: {
    color: "#e2e8f0",
    textTransform: "capitalize",
    fontSize: 12,
  },

  selectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },

  check: {
    color: "#22d3ee",
    fontWeight: "700",
  },

  button: {
    marginTop: 10,
    padding: 11,
    borderRadius: 10,
    backgroundColor: "#0891b2",
    alignItems: "center",
  },

  dangerButton: {
    marginTop: 10,
    padding: 11,
    borderRadius: 10,
    backgroundColor: "#dc2626",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
};


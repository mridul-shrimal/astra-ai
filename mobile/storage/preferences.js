import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFERENCES_KEY = "astra-mobile-preferences";

export const defaultPreferences = {
  theme: "dark",
  model: "mistralai/mistral-small-3.2-24b-instruct",
  temperature: 0.7,
  autoRead: false,
  fontSize: "medium",
  enterToSend: true,
  showTimestamp: true,
  memoryEnabled: true,
  memoryAutoSave: true,
  deleteConfirmation: true,
  autoLock: "never",
  biometricEnabled: false,
  notificationEnabled: false,
  notificationSound: true,
};

export async function loadPreferences() {
  const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
  return { ...defaultPreferences, ...(stored ? JSON.parse(stored) : {}) };
}

export async function savePreferences(preferences) {
  await AsyncStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify(preferences)
  );
}

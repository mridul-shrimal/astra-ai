import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFERENCES_KEY = "astra-mobile-ui-v2-preferences";

export const defaultPreferences = {
  theme: "system",
  model: "mistralai/mistral-small-3.2-24b-instruct",
  temperature: 0.7,
  memoryEnabled: true,
  memoryAutoSave: true,
  enterToSend: true,
  showTimestamp: false,
  fontSize: "medium",
  notificationEnabled: true,
  notificationSound: false,
  biometricEnabled: false,
  autoLock: "never",
  deleteConfirmation: true,
  autoRead: false,
};

export async function loadPreferences() {
  const stored = await AsyncStorage.getItem(PREFERENCES_KEY);

  return {
    ...defaultPreferences,
    ...(stored ? JSON.parse(stored) : {}),
  };
}

export function savePreferences(preferences) {
  return AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

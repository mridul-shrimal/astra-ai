const defaultSettings = {
  // Privacy
  saveHistory: true,
  deleteConfirmation: true,
  autoLock: "never",
  appPin: "",

  // Notifications
desktopNotification: true,
emailNotification: false,
notificationSound: true,

  // Appearance
  theme: "system",

 // Chat Preferences
fontSize: "medium",
exportFormat: "pdf",
enterToSend: true,
showTimestamp: true,

  // AI Preferences
temperature: 0.7,
autoRead: false,
model: "mistralai/mistral-small-3.2-24b-instruct",

// Memory
memoryEnabled: true,
memoryAutoSave: true,

};

export default defaultSettings;
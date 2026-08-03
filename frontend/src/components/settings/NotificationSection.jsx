import { useSettings } from "../../context/SettingsContext";
import { Bell } from "lucide-react";

import SettingsSection from "./SettingsSection";
import SettingToggle from "./SettingToggle";

function NotificationSection() {
const {
  desktopNotification,
  setDesktopNotification,

  emailNotification,
  setEmailNotification,

  notificationSound,
  setNotificationSound,
} = useSettings();


  return (
    <SettingsSection
      icon={Bell}
      title="Notifications"
      description="Choose how Astra AI keeps you informed."
    >
      <SettingToggle
  title="Desktop Notifications"
  description="Show browser notifications."
  checked={desktopNotification}
  onChange={(value) => {
    setDesktopNotification(value);

    if (
      value &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }}
/>

      <SettingToggle
        title="Email Notifications"
        description="Receive important updates by email."
        checked={emailNotification}
        onChange={setEmailNotification}
      />

      <SettingToggle
        title="Notification Sound"
        description="Play a sound for new messages."
        checked={notificationSound}
        onChange={setNotificationSound}
      />
    </SettingsSection>
  );
}

export default NotificationSection;
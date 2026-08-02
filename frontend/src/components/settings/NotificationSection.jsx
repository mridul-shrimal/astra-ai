import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import SettingsSection from "./SettingsSection";
import SettingToggle from "./SettingToggle";

function NotificationSection() {
  const [desktop, setDesktop] = useState(true);
  const [email, setEmail] = useState(false);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    setDesktop(saved.desktopNotification ?? true);
    setEmail(saved.emailNotification ?? false);
    setSound(saved.notificationSound ?? true);
  }, []);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    localStorage.setItem(
      "astra-settings",
      JSON.stringify({
        ...saved,
        desktopNotification: desktop,
        emailNotification: email,
        notificationSound: sound,
      })
    );
  }, [desktop, email, sound]);

  return (
    <SettingsSection
      icon={Bell}
      title="Notifications"
      description="Choose how Astra AI keeps you informed."
    >
      <SettingToggle
        title="Desktop Notifications"
        description="Show browser notifications."
        checked={desktop}
        onChange={(value) => {
  setDesktop(value);

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
        checked={email}
        onChange={setEmail}
      />

      <SettingToggle
        title="Notification Sound"
        description="Play a sound for new messages."
        checked={sound}
        onChange={setSound}
      />
    </SettingsSection>
  );
}

export default NotificationSection;
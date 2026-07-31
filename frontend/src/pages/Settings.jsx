import SettingsHeader from "../components/settings/SettingsHeader";

import AppearanceSection from "../components/settings/AppearanceSection";
import AISection from "../components/settings/AISection";
import ChatSection from "../components/settings/ChatSection";
import MemorySection from "../components/settings/MemorySection";
import NotificationSection from "../components/settings/NotificationSection";
import PrivacySection from "../components/settings/PrivacySection";
import AboutSection from "../components/settings/AboutSection";

function Settings() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">

      <SettingsHeader />

      <AppearanceSection />

      <AISection />

      <ChatSection />

      <MemorySection />

      <NotificationSection />

      <PrivacySection />

      <AboutSection />

    </div>
  );
}

export default Settings;
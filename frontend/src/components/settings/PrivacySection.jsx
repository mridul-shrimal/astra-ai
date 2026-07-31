import { useEffect, useState } from "react";
import {
  Shield,
  Download,
  Trash2,
} from "lucide-react";

import SettingsSection from "./SettingsSection";
import SettingToggle from "./SettingToggle";

function PrivacySection() {
  const [saveHistory, setSaveHistory] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    setSaveHistory(saved.saveHistory ?? true);
    setAnalytics(saved.analytics ?? false);
  }, []);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    localStorage.setItem(
      "astra-settings",
      JSON.stringify({
        ...saved,
        saveHistory,
        analytics,
      })
    );
  }, [saveHistory, analytics]);

  return (
    <SettingsSection
      icon={Shield}
      title="Privacy & Security"
      description="Manage your privacy and account data."
    >
      <SettingToggle
        title="Save Chat History"
        description="Keep conversations for future access."
        checked={saveHistory}
        onChange={setSaveHistory}
      />

      <SettingToggle
        title="Share Anonymous Analytics"
        description="Help improve Astra AI."
        checked={analytics}
        onChange={setAnalytics}
      />

      <div className="flex flex-wrap gap-4">
        <button
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600"
        >
          <Download size={18} />
          Export My Data
        </button>

        <button
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          <Trash2 size={18} />
          Delete Account
        </button>
      </div>
    </SettingsSection>
  );
}

export default PrivacySection;
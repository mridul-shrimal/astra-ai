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

  const [deleteConfirmation, setDeleteConfirmation] =
    useState(true);

  const [autoLock, setAutoLock] =
    useState("never");

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    setSaveHistory(saved.saveHistory ?? true);

    setDeleteConfirmation(
      saved.deleteConfirmation ?? true
    );

    setAutoLock(saved.autoLock ?? "never");
  }, []);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    localStorage.setItem(
      "astra-settings",
      JSON.stringify({
        ...saved,
        saveHistory,
        deleteConfirmation,
        autoLock,
      })
    );
  }, [
    saveHistory,
    deleteConfirmation,
    autoLock,
  ]);

  return (
    <SettingsSection
      icon={Shield}
      title="Privacy & Security"
      description="Manage your privacy and account data."
    >
      {/* Save Chat History */}

      <SettingToggle
        title="Save Chat History"
        description="Keep conversations for future access."
        checked={saveHistory}
        onChange={setSaveHistory}
      />

      {/* Delete Confirmation */}

      <SettingToggle
        title="Require Delete Confirmation"
        description="Ask before permanently deleting a chat."
        checked={deleteConfirmation}
        onChange={setDeleteConfirmation}
      />

      {/* Auto Lock */}

      <div>
        <label className="mb-2 block font-medium">
          Auto Lock Astra
        </label>

        <select
          value={autoLock}
          onChange={(e) =>
            setAutoLock(e.target.value)
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
        >
          <option value="never">
            Never
          </option>

          <option value="5">
            5 Minutes
          </option>

          <option value="10">
            10 Minutes
          </option>

          <option value="30">
            30 Minutes
          </option>
        </select>
      </div>

      {/* Action Buttons */}

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
          Clear All Local Data
        </button>
      </div>
    </SettingsSection>
  );
}

export default PrivacySection;
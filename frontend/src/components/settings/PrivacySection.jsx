
import {
  Shield,
  Download,
  Trash2,
} from "lucide-react";

import SettingsSection from "./SettingsSection";
import SettingToggle from "./SettingToggle";
import { useSettings } from "../../context/SettingsContext";
function PrivacySection() {

  const {
  saveHistory,
  setSaveHistory,

  deleteConfirmation,
  setDeleteConfirmation,

  autoLock,
  setAutoLock,

  appPin,
  setAppPin,
} = useSettings();

const hasPin = !!appPin;

  
  const handleSetPin = () => {
    const pin = prompt(
      "Enter a new 4-digit PIN"
    );

    if (pin === null) return;

    if (!/^\d{4}$/.test(pin)) {
      alert(
        "PIN must contain exactly 4 digits."
      );
      return;
    }

    setAppPin(pin);

alert("App PIN saved successfully.");
  };

  const handleChangePin = () => {
    const current = prompt(
      "Enter current PIN"
    );

    if (current !== appPin) {
      alert("Incorrect PIN");
      return;
    }

    const newPin = prompt(
      "Enter new 4-digit PIN"
    );

    if (
      !/^\d{4}$/.test(newPin || "")
    ) {
      alert(
        "PIN must contain exactly 4 digits."
      );
      return;
    }

    setAppPin(newPin);

    alert("PIN updated successfully.");
  };

const handleRemovePin = () => {
  const current = prompt("Enter current PIN");

  if (current === null) return;

  if (current !== appPin) {
    alert("Incorrect PIN");
    return;
  }

  setAppPin("");

alert("App PIN removed.");
};
const handleExportData = () => {
  const exportData = {
    exportedAt: new Date().toISOString(),

    settings: JSON.parse(
      localStorage.getItem("astra-settings") || "{}"
    ),

    chats: JSON.parse(
      localStorage.getItem("astra-chats") || "[]"
    ),

    folders: JSON.parse(
      localStorage.getItem("astra-folders") || "[]"
    ),

    tags: JSON.parse(
      localStorage.getItem("astra-tags") || "[]"
    ),
  };

  const blob = new Blob(
    [JSON.stringify(exportData, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = `astra-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;

  a.click();

  URL.revokeObjectURL(url);

  alert("Data exported successfully.");
};
const handleClearLocalData = () => {
  const confirmed = window.confirm(
    "This will permanently remove all locally stored Astra data. Continue?"
  );

  if (!confirmed) return;

  localStorage.removeItem("astra-chats");
  localStorage.removeItem("astra-current-chat");
  localStorage.removeItem("astra-settings");
  localStorage.removeItem("astra-folders");
  localStorage.removeItem("astra-tags");

  alert("Local data cleared successfully.");

  window.location.reload();
};
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

      {/* App Lock PIN */}

      {autoLock !== "never" && (
        <div className="rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium">
            App Lock PIN
          </h3>

          <p className="mb-4 text-sm text-slate-400">
            Protect Astra when Auto Lock is enabled.
          </p>

          {hasPin ? (
  <div className="flex gap-3">
    <button
      onClick={handleChangePin}
      className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white transition hover:bg-cyan-600"
    >
      Change PIN
    </button>

    <button
      onClick={handleRemovePin}
      className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
    >
      Remove PIN
    </button>
  </div>
) : (
  <button
    onClick={handleSetPin}
    className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white transition hover:bg-cyan-600"
  >
    Set PIN
  </button>
)}
        </div>
      )}

      {/* Action Buttons */}

      <div className="flex flex-wrap gap-4">
        <button
  onClick={handleExportData}
  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600"
>
  <Download size={18} />
  Export My Data
</button>

        <button
  onClick={handleClearLocalData}
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
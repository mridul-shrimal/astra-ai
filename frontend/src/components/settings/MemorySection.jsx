
import { useEffect, useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { Brain, Trash2, Database } from "lucide-react";
import SettingsSection from "./SettingsSection";
import api from "../../services/api";
import { createMemoryService } from "@astra/shared";

const memoryService = createMemoryService(api);
function MemorySection() {
const {
  memoryEnabled,
  setMemoryEnabled,

  memoryAutoSave,
  setMemoryAutoSave,
} = useSettings();
const [memoryCount, setMemoryCount] = useState(0);


const loadMemoryCount = async () => {
  try {
    setMemoryCount(await memoryService.getMemoryCount());
  } catch (error) {
    console.error(
      "Failed to load memory count:",
      error
    );
  }
};

useEffect(() => {
  loadMemoryCount();
}, []);

const clearMemory = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to clear all memories?"
  );

  if (!confirmDelete) return;

  try {
    await memoryService.clearMemories();
    await loadMemoryCount();

    alert(
      "🧠 All memories cleared successfully."
    );
  } catch (error) {
    console.error(
      "Failed to clear memory:",
      error
    );
  }
};
  return (
    <SettingsSection
      icon={Brain}
      title="Memory"
      description="Control what Astra AI remembers."
    >
      {/* Enable Memory */}

      <div className="flex items-center justify-between rounded-xl border border-slate-700 p-4">
        <div>
          <h3 className="font-medium">
            Enable Memory
          </h3>

          <p className="text-sm text-slate-400">
            Astra remembers important details.
          </p>
        </div>

        <input
          type="checkbox"
          checked={memoryEnabled}
          onChange={(e) =>
            setMemoryEnabled(e.target.checked)
          }
          className="h-5 w-5 cursor-pointer rounded accent-cyan-500"
        />
      </div>

      {/* Auto Save */}

      <div className="flex items-center justify-between rounded-xl border border-slate-700 p-4">
        <div>
          <h3 className="font-medium">
            Auto Save Conversations
          </h3>

          <p className="text-sm text-slate-400">
            Save conversations automatically.
          </p>
        </div>

        <input
          type="checkbox"
          checked={memoryAutoSave}
          onChange={(e) =>
            setMemoryAutoSave(e.target.checked)
          }
          className="h-5 w-5 cursor-pointer rounded accent-cyan-500"
        />
      </div>

      {/* Stats */}

      <div className="rounded-xl border border-slate-700 p-5">
        <div className="flex items-center gap-3">
          <Database
            className="text-cyan-400"
            size={22}
          />

          <div>
            <h3 className="font-semibold">
              Stored Memories
            </h3>

            <p className="text-sm text-slate-400">
  {memoryCount} memories stored
</p>
          </div>
        </div>
      </div>

      {/* Button */}

      <button
        onClick={clearMemory}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
      >
        <Trash2 size={18} />
        Clear Memory
      </button>
    </SettingsSection>
  );
}

export default MemorySection;

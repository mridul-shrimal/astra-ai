import { useEffect, useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { Brain, Trash2, Database } from "lucide-react";
import SettingsSection from "./SettingsSection";

function MemorySection() {
const {
  memoryEnabled,
  setMemoryEnabled,

  memoryAutoSave,
  setMemoryAutoSave,
} = useSettings();
const [memoryCount, setMemoryCount] = useState(0);


useEffect(() => {
  const loadMemoryCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/memory/count/all"
      );

      const data = await response.json();

      if (data.success) {
        setMemoryCount(data.count);
      }
    } catch (error) {
      console.error("Failed to load memory count:", error);
    }
  };

  loadMemoryCount();
}, []);
  const clearMemory = () => {
    alert("Memory system will be connected later.");
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
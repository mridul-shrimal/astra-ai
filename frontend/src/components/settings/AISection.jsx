import { useEffect, useState } from "react";
import { Bot, Volume2 } from "lucide-react";

import SettingsSection from "./SettingsSection";

function AISection() {
  const [temperature, setTemperature] = useState(0.7);
  const [autoRead, setAutoRead] = useState(false);
  const [model, setModel] = useState("Gemini");

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("astra-settings")
    );

    if (!saved) return;

    setTemperature(saved.temperature ?? 0.7);
    setAutoRead(saved.autoRead ?? false);
    setModel(saved.model ?? "Gemini");
  }, []);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) ||
      {};

    localStorage.setItem(
      "astra-settings",
      JSON.stringify({
        ...saved,
        temperature,
        autoRead,
        model,
      })
    );
  }, [temperature, autoRead, model]);

  return (
    <SettingsSection
      icon={Bot}
      title="AI Preferences"
      description="Control how Astra AI behaves."
    >
      {/* AI Model */}

      <div>
        <label className="mb-2 block font-medium">
          Default AI Model
        </label>

        <select
          value={model}
          onChange={(e) =>
            setModel(e.target.value)
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3"
        >
          <option>Gemini</option>
          <option>GPT-4o</option>
        </select>
      </div>

      {/* Temperature */}

      <div>
        <div className="mb-2 flex justify-between">
          <span className="font-medium">
            Temperature
          </span>

          <span className="text-cyan-400">
            {temperature.toFixed(1)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) =>
            setTemperature(Number(e.target.value))
          }
          className="w-full"
        />
      </div>

      {/* Auto Read */}

      <div className="flex items-center justify-between rounded-xl border border-slate-700 p-4">

        <div className="flex items-center gap-3">

          <Volume2
            size={22}
            className="text-cyan-400"
          />

          <div>

            <h3 className="font-medium">
              Auto Read Aloud
            </h3>

            <p className="text-sm text-slate-400">
              Read AI responses automatically.
            </p>

          </div>

        </div>

        <input
          type="checkbox"
          checked={autoRead}
          onChange={(e) =>
            setAutoRead(e.target.checked)
          }
          className="h-5 w-5"
        />

      </div>

    </SettingsSection>
  );
}

export default AISection;
import { useEffect, useState } from "react";
import { Bot, Volume2 } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { useTheme } from "../../context/ThemeContext";

function AISection() {
  const [temperature, setTemperature] = useState(0.7);
  const [autoRead, setAutoRead] = useState(false);
  const [model, setModel] = useState(
    "mistralai/mistral-small-3.2-24b-instruct"
  );

 const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("astra-settings")
    );

    console.log("Loaded settings:", saved);

    if (!saved) return;

    setTemperature(saved.temperature ?? 0.7);
    setAutoRead(saved.autoRead ?? false);
    setModel(
      saved.model ??
        "mistralai/mistral-small-3.2-24b-instruct"
    );
  }, []);

  useEffect(() => {
    console.log("Saving model:", model);

    const saved =
      JSON.parse(localStorage.getItem("astra-settings")) ||
      {};

    const newSettings = {
      ...saved,
      temperature,
      autoRead,
      model,
    };

    console.log("Saving settings:", newSettings);

    localStorage.setItem(
      "astra-settings",
      JSON.stringify(newSettings)
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
          onChange={(e) => {
            console.log(
              "Dropdown changed to:",
              e.target.value
            );
            setModel(e.target.value);
          }}
          className={`w-full rounded-xl border p-3 ${
  isLight
    ? "border-slate-300 bg-white text-slate-900"
    : "border-slate-700 bg-slate-900 text-white"
}`}
        >
          <option value="mistralai/mistral-small-3.2-24b-instruct">
            ⭐ Mistral Small 3.2 (Recommended)
          </option>

          <option value="google/gemma-3-27b-it">
            Gemma 3 27B
          </option>

          <option value="deepseek/deepseek-chat-v3">
            DeepSeek Chat V3
          </option>

          <option value="openai/gpt-oss-20b:free">
            GPT OSS 20B
          </option>
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
          className="h-2 w-full cursor-pointer appearance-none rounded-lg accent-cyan-500"
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
          className="h-5 w-5 cursor-pointer rounded accent-cyan-500"
        />
      </div>
    </SettingsSection>
  );
}

export default AISection;
import { useTheme } from "../../../context/ThemeContext";

function ModelSelector({
  selectedModel,
  setSelectedModel,
  handleModelChange,
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
        theme === "light"
          ? "border-slate-200 bg-white"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <div>
        <h2 className="text-lg font-semibold">
          Astra AI
        </h2>

        <p
          className={`text-sm ${
            theme === "light"
              ? "text-slate-500"
              : "text-slate-400"
          }`}
        >
          Active Model
        </p>
      </div>

      <select
        value={selectedModel}
        onChange={(e) => {
          const model = e.target.value;

          setSelectedModel(model);
          handleModelChange(model);
        }}
        className={`rounded-lg border px-3 py-2 text-sm ${
          theme === "light"
            ? "border-slate-300 bg-white"
            : "border-slate-700 bg-slate-800 text-white"
        }`}
      >
        <option>GPT-4o</option>
        <option>GPT-4.1</option>
        <option>Claude 4 Sonnet</option>
        <option>Gemini 2.5 Pro</option>
        <option>Llama 3.3</option>
        <option>DeepSeek V3</option>
      </select>
    </div>
  );
}

export default ModelSelector;
import { useTheme } from "../../../context/ThemeContext";

function ModelSelector({
  currentChat,
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
        value={
  currentChat?.model ||
  "⭐ Mistral Small 3.2 (Recommended)"
}
        onChange={(e) => {
  handleModelChange(e.target.value);
}}
        className={`rounded-lg border px-3 py-2 text-sm ${
          theme === "light"
            ? "border-slate-300 bg-white"
            : "border-slate-700 bg-slate-800 text-white"
        }`}
      >
        <option>⭐ Mistral Small 3.2 (Recommended)</option>
<option>Gemma 3 27B</option>
<option>DeepSeek Chat V3</option>
<option>GPT OSS 20B</option>
      </select>
    </div>
  );
}

export default ModelSelector;
import { useTheme } from "../../context/ThemeContext";

function ModelSelectorModal({
  open,
  selectedModel,
  setSelectedModel,
  onCancel,
  onCreate,
}) {
  const { theme } = useTheme();

  if (!open) return null;

  const models = [
  "⭐ Mistral Small 3.2 (Recommended)",
  "Gemma 3 27B",
  "DeepSeek Chat V3",
  "GPT OSS 20B",
];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-105' rounded-2xl p-6 shadow-2xl ${
          theme === "light"
            ? "bg-white"
            : "bg-slate-900 text-white"
        }`}
      >
        <h2 className="mb-2 text-xl font-bold">
          Create New Chat
        </h2>

        <p className="mb-5 text-sm opacity-70">
          Choose the AI model for this conversation.
        </p>

        <div className="space-y-2">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selectedModel === model
                  ? "border-cyan-500 bg-cyan-500/10"
                  : theme === "light"
                  ? "border-slate-300 hover:bg-slate-100"
                  : "border-slate-700 hover:bg-slate-800"
              }`}
            >
              {model}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onCreate}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModelSelectorModal;
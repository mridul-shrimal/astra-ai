import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

function EditMemoryModal({
  open,
  memory,
  onClose,
  onSave,
}) {
  const { theme } = useTheme();

  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    if (memory) {
      setUserMessage(memory.user_message);
      setAiResponse(memory.ai_response);
    }
  }, [memory]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-full max-w-2xl rounded-2xl p-6 shadow-2xl ${
          theme === "light"
            ? "bg-white"
            : "bg-slate-900 text-white"
        }`}
      >
        <h2 className="mb-5 text-2xl font-bold">
          ✏ Edit Memory
        </h2>

        <label className="mb-2 block font-medium">
          User Message
        </label>

        <textarea
          rows={4}
          value={userMessage}
          onChange={(e) =>
            setUserMessage(e.target.value)
          }
          className="mb-5 w-full rounded-xl border p-3"
        />

        <label className="mb-2 block font-medium">
          Astra Response
        </label>

        <textarea
          rows={8}
          value={aiResponse}
          onChange={(e) =>
            setAiResponse(e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave({
                ...memory,
                user_message: userMessage,
                ai_response: aiResponse,
              })
            }
            className="rounded-lg bg-cyan-600 px-5 py-2 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMemoryModal;
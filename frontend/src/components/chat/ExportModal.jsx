  import { useEffect } from "react";

  function ExportModal({
    open,
    selectedFormat,
    setSelectedFormat,
    onClose,
    onExport,
  }) {
    // Close modal with Escape key
    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, onClose]);

    if (!open) return null;

    const formats = [
      { id: "pdf", label: "📄 PDF" },
      { id: "txt", label: "📋 TXT" },
      { id: "md", label: "📝 Markdown (.md)" },
      { id: "html", label: "🌐 HTML" },
      { id: "json", label: "📦 JSON" },
    ];

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl sm:p-6"
        >
          <h2 className="mb-5 text-xl font-bold text-white sm:mb-6 sm:text-2xl">
            Export Chat
          </h2>

          <div className="space-y-3">
            {formats.map((format) => (
              <label
                key={format.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition sm:p-4 ${
                  selectedFormat === format.id
                    ? "border-cyan-500 bg-slate-800"
                    : "border-slate-700 hover:bg-slate-800"
                }`}
              >
                <input
                  type="radio"
                  name="export"
                  value={format.id}
                  checked={selectedFormat === format.id}
                  onChange={() => setSelectedFormat(format.id)}
                />

                <span className="text-sm text-white sm:text-base">
                  {format.label}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="w-full rounded-lg border border-slate-700 px-5 py-2 text-slate-300 transition hover:bg-slate-800 sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={onExport}
              className="w-full rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-white transition hover:bg-cyan-600 sm:w-auto"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default ExportModal;
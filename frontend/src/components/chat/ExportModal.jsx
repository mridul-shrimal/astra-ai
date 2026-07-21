function ExportModal({
  open,
  selectedFormat,
  setSelectedFormat,
  onClose,
  onExport,
}) {
  if (!open) return null;

  const formats = [
    { id: "pdf", label: "📄 PDF" },
    { id: "txt", label: "📋 TXT" },
    { id: "md", label: "📝 Markdown (.md)" },
    { id: "html", label: "🌐 HTML" },
    { id: "json", label: "📦 JSON" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-105 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold text-white">
          Export Chat
        </h2>

        <div className="space-y-3">

          {formats.map((format) => (
            <label
              key={format.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
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

              <span className="text-white">
                {format.label}
              </span>
            </label>
          ))}

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-5 py-2 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={onExport}
            className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-white hover:bg-cyan-600"
          >
            Export
          </button>

        </div>

      </div>

    </div>
  );
}

export default ExportModal;
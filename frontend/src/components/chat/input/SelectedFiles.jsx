import {
  X,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";

function SelectedFiles({
  selectedFiles,
  removeFile,
  isLight,
}) {
  const getFileIcon = (file) => {
    const ext = file.name
      .split(".")
      .pop()
      .toLowerCase();

    if (
      ["png", "jpg", "jpeg", "gif", "webp"].includes(
        ext
      )
    ) {
      return (
        <FileImage
          size={22}
          className="text-green-400"
        />
      );
    }

    if (
      ["csv", "xlsx", "xls"].includes(ext)
    ) {
      return (
        <FileSpreadsheet
          size={22}
          className="text-emerald-400"
        />
      );
    }

    return (
      <FileText
        size={22}
        className="text-red-400"
      />
    );
  };

  if (selectedFiles.length === 0) return null;

  return (
    <div className="mb-3 space-y-2">
      {selectedFiles.map((file, index) => (
        <div
          key={index}
          className={`flex items-start justify-between gap-3 rounded-xl px-3 py-3 transition sm:items-center sm:px-4 ${
            isLight
              ? "bg-slate-100"
              : "bg-slate-800"
          }`}
        >
          <div>
            <div
              className={`font-medium ${
                isLight
                  ? "text-slate-900"
                  : "text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {getFileIcon(file)}

                <span className="truncate break-all">
                  {file.name}
                </span>
              </div>
            </div>

            <div
              className={`text-xs ${
                isLight
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              {(file.size / 1024).toFixed(1)} KB
            </div>
          </div>

          <button
            onClick={() => removeFile(index)}
            className="text-red-400 hover:text-red-300"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default SelectedFiles;
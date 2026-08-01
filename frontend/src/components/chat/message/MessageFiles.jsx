import {
  FileText,
  ExternalLink,
  Download,
} from "lucide-react";

function MessageFiles({
  files,
  isLight,
}) {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 space-y-3">
      {files.map((file, index) => {
        const fileUrl =
          file.preview ||
          (file.filename
            ? `http://localhost:5000/uploads/${file.filename}`
            : null);

        return (
          <div
            key={index}
            className={`rounded-2xl border p-4 ${
              isLight
                ? "border-slate-200 bg-slate-50"
                : "border-slate-700 bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* File Icon */}

              <div
                className={`rounded-xl p-3 ${
                  isLight
                    ? "bg-slate-200 text-cyan-600"
                    : "bg-slate-700 text-cyan-400"
                }`}
              >
                <FileText size={22} />
              </div>

              {/* File Details */}

              <div className="flex-1">
                <p className="font-semibold">
                  {file.name}
                </p>

                <p className="text-xs opacity-70">
                  {file.type}
                </p>

                <p className="text-xs opacity-70">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              {/* File Actions */}

              {fileUrl && (
                <div className="flex gap-2">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-lg p-2 transition ${
                      isLight
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    }`}
                  >
                    <ExternalLink size={16} />
                  </a>

                  <a
                    href={fileUrl}
                    download
                    className={`rounded-lg p-2 transition ${
                      isLight
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    }`}
                  >
                    <Download size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageFiles;
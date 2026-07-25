import { memo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Bot,
  UserCircle2,
  Copy,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ExternalLink,
  Download,
  FileText,
} from "lucide-react";

function ChatMessage({
  id,
  sender,
  message,
  timestamp,
  files,
  liked,
  disliked,
  onRegenerate,
  onFeedback,
}) {
  const isUser = sender === "user";
const { theme } = useTheme();
const isLight = theme === "light";
const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const [copiedMessage, setCopiedMessage] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);

    toast.success("Code copied!");

    setCopiedCode(code);

    setTimeout(() => {
      setCopiedCode("");
    }, 2000);
  } catch (err) {
    console.error("Copy failed:", err);
  }
};

const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(message);

    toast.success("Copied to clipboard!");

    setCopiedMessage(true);

    setTimeout(() => {
      setCopiedMessage(false);
    }, 2000);
  } catch (err) {
    console.error("Copy failed:", err);
  }
};
  const speakMessage = () => {
    
  // Stop if this message is already speaking
  if (isSpeaking) {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }

  // Stop any previous speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);

  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onstart = () => {
    setIsSpeaking(true);
  };

  utterance.onend = () => {
    setIsSpeaking(false);
  };

  utterance.onerror = () => {
    setIsSpeaking(false);
  };

  speechSynthesis.speak(utterance);
};
const downloadResponse = (format = "txt") => {

  // TXT
  if (format === "txt") {
    const blob = new Blob([message], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Astra_Response_${Date.now()}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return;
  }

  // PDF
  if (format === "pdf") {

    const pdf = new jsPDF();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    const lines = pdf.splitTextToSize(message, 180);

    pdf.text(lines, 15, 20);

    pdf.save(`Astra_Response_${Date.now()}.pdf`);

    return;
  }

  // HTML
  if (format === "html") {

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Astra AI Response</title>
<style>
body{
  font-family: Arial, sans-serif;
  padding: 30px;
  line-height: 1.6;
}
pre{
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
</head>
<body>
<pre>${message}</pre>
</body>
</html>`;

    const blob = new Blob([html], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Astra_Response_${Date.now()}.html`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return;
  }

  // Markdown
  if (format === "md") {

    const blob = new Blob([message], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Astra_Response_${Date.now()}.md`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return;
  }

  // JSON
  if (format === "json") {

    const data = {
      sender: "Astra AI",
      message,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Astra_Response_${Date.now()}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return;
  }

};

return (
    <div
      className={`group mb-8 flex items-start gap-4 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg ring-2 transition-all duration-200 ${
  isUser
    ? isLight
      ? "ring-cyan-200"
      : "ring-cyan-700/40"
    : isLight
      ? "ring-slate-200"
      : "ring-slate-700"
} ${
          isUser
            ? "bg-linear-to-br from-violet-500 to-fuchsia-600"
            : "bg-linear-to-br from-cyan-500 to-blue-600"
        }`}
      >
        {isUser ? (
          <UserCircle2 size={24} className="text-white" />
        ) : (
          <Bot size={24} className="text-white" />
        )}
      </div>

      {/* Message */}

      <div className="flex min-w-0 flex-1 flex-col">
        <div
         className={`mb-2 text-sm font-semibold ${
  isUser
    ? isLight
      ? "text-right text-cyan-700"
      : "text-right text-cyan-300"
    : isLight
      ? "text-slate-600"
      : "text-slate-400"
}`}
        >
          {isUser ? "You" : "Astra"}
        </div>

        <div
          className={`rounded-2xl px-6 py-5 shadow-lg transition-all duration-200 ${
  isUser
    ? isLight
      ? "ml-auto max-w-[85%] border border-cyan-200 bg-cyan-50 text-slate-900"
      : "ml-auto max-w-[85%] bg-cyan-500 text-white"
    : isLight
      ? "max-w-[85%] border border-slate-200 bg-white text-slate-900"
      : "max-w-[85%] border border-slate-700 bg-slate-800 text-gray-100"
}`}
        >
         {isUser ? (
  <>
{files && files.length > 0 && (
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
    ? "border-cyan-200 bg-cyan-50"
    : "border-cyan-300/20 bg-cyan-600/10"
}`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-3">
              <FileText size={22} />
            </div>

            <div className="flex-1">
              <p className="font-semibold">{file.name}</p>

              <p className="text-xs opacity-70">
                {file.type}
              </p>

              <p className="text-xs opacity-70">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            {fileUrl && (
              <div className="flex gap-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-cyan-500 p-2 hover:bg-cyan-600"
                >
                  <ExternalLink size={16} />
                </a>

                <a
                  href={fileUrl}
                  download
                  className="rounded-lg bg-slate-700 p-2 hover:bg-slate-600"
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
)}
    <p className="whitespace-pre-wrap leading-7">
      {message}
    </p>
  </>
) : (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-5 mt-6 text-3xl font-bold">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mb-4 mt-6 text-2xl font-bold">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mb-3 mt-5 text-xl font-semibold">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="mb-4 whitespace-pre-wrap leading-7">
                      {children}
                    </p>
                  ),

                  ul: ({ children }) => (
                    <ul className="mb-4 list-disc space-y-2 pl-6">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="mb-4 list-decimal space-y-2 pl-6">
                      {children}
                    </ol>
                  ),

                  strong: ({ children }) => (
                    <strong
  className={`font-bold ${
    isLight ? "text-slate-900" : "text-white"
  }`}
>
                      {children}
                    </strong>
                  ),

                  table: ({ children }) => (
                    <div
  className={`my-6 overflow-x-auto rounded-lg border ${
    isLight
      ? "border-slate-200"
      : "border-slate-700"
  }`}
>
                      <table className="min-w-full border-collapse">
                        {children}
                      </table>
                    </div>
                  ),

                  thead: ({ children }) => (
                   <thead
  className={
    isLight
      ? "bg-slate-100"
      : "bg-slate-900"
  }
> 
                      {children}
                    </thead>
                  ),

                  tbody: ({ children }) => (
                    <tbody>{children}</tbody>
                  ),

                  tr: ({ children }) => (
                    <tr
  className={
    isLight
      ? "border-b border-slate-200"
      : "border-b border-slate-700"
  }
>
                      {children}
                    </tr>
                  ),

                  th: ({ children }) => (
                    <th
  className={`border px-4 py-3 text-left font-semibold ${
    isLight
      ? "border-slate-200 text-cyan-700"
      : "border-slate-700 text-cyan-300"
  }`}
>
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td
  className={`border px-4 py-3 align-top ${
    isLight
      ? "border-slate-200"
      : "border-slate-700"
  }`}
>
                      {children}
                    </td>
                  ),

                  blockquote: ({ children }) => (
                    <blockquote
  className={`my-5 border-l-4 pl-4 italic ${
    isLight
      ? "border-cyan-500 text-slate-700"
      : "border-cyan-500 text-slate-300"
  }`}
>
                      {children}
                    </blockquote>
                  ),

                  hr: () => (
                    <hr
  className={`my-6 ${
    isLight
      ? "border-slate-200"
      : "border-slate-700"
  }`}
/>
                  ),
                                    code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");

                    if (!inline && match) {
                      const code = String(children).replace(/\n$/, "");

                      return (
                        <div
  className={`mb-6 overflow-hidden rounded-xl border shadow-lg ${
    isLight
      ? "border-slate-200"
      : "border-slate-700"
  }`}
>
                          <div
  className={`flex items-center justify-between border-b px-4 py-2 ${
    isLight
      ? "border-slate-200 bg-slate-100"
      : "border-slate-700 bg-slate-900"
  }`}
>
                            <span
  className={`text-xs font-semibold uppercase tracking-wider ${
    isLight ? "text-slate-600" : "text-slate-400"
  }`}
>
  {match[1]}
</span>

                            <button
                              onClick={() => copyCode(code)}
                              className={`rounded-md px-3 py-1 text-sm font-medium transition ${
  isLight
    ? "text-slate-700 hover:bg-slate-200"
    : "text-slate-300 hover:bg-slate-700 hover:text-white"
}`}
                            >
                              {copiedCode === code
                                ? "✅ Copied!"
                                : "📋 Copy"}
                            </button>
                          </div>

                          <SyntaxHighlighter
                            language={match[1]}
                            style={isLight ? oneLight : oneDark}
                            customStyle={{
  margin: 0,
  borderRadius: 0,
  padding: "20px",
  fontSize: "14px",
  background: "transparent",
}}
                          >
                            {code}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }

                    return (
                      <code className={`rounded px-2 py-1 font-mono text-sm ${
  isLight
    ? "bg-slate-100 text-cyan-700"
    : "bg-slate-900 text-cyan-300"
}`}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message}
              </ReactMarkdown>

{/* Timestamp */}
{timestamp && (
  <div
    className={`mt-3 text-xs ${
      isLight ? "text-slate-500" : "text-slate-400"
    }`}
  >
    {new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </div>
)}

{/* Message Actions */}

 <div
  className={`relative mt-5 flex flex-wrap items-center gap-2 border-t pt-4 ${
    isLight
      ? "border-slate-200"
      : "border-slate-700"
  }`}
>
                <button
                  onClick={copyMessage}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
  isLight
    ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
    : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
}`}
                  title="Copy"
                >
                  {copiedMessage ? (
                    <span className="text-sm text-green-400">
                      ✅ Copied
                    </span>
                  ) : (
                    <Copy size={18} />
                  )}
                </button>

                <button
  onClick={speakMessage}
  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
  isLight
    ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
    : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
}`}
>
  {isSpeaking ? (
    <span className="text-sm">⏹</span>
  ) : (
    <Volume2 size={18} />
  )}
</button>

                <button
  onClick={() => onFeedback(id, "like")}
 className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
  liked
    ? "bg-cyan-600 text-white"
    : isLight
      ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
      : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
}`}
  title="Like"
>
  <ThumbsUp size={18} />
</button>

                <button
  onClick={() => onFeedback(id, "dislike")}
 className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
  disliked
    ? "bg-red-600 text-white"
    : isLight
      ? "bg-slate-100 text-slate-700 hover:bg-red-500 hover:text-white"
      : "bg-slate-900 text-slate-300 hover:bg-red-600 hover:text-white"
}`}
  title="Dislike"
>
  <ThumbsDown size={18} />
</button>

                {sender === "ai" && (
                  <button
                    onClick={() => onRegenerate(id)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
  isLight
    ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
    : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
}`}
                    title="Regenerate"
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
   {sender === "ai" && (
  <div className="relative">

    <button
      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
        isLight
          ? "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
          : "bg-slate-900 text-slate-300 hover:bg-cyan-600 hover:text-white"
      }`}
      title="Download Response"
    >
      <Download size={18} />
    </button>

    {showDownloadMenu && (
      <div
        className={`absolute bottom-12 right-0 z-50 w-44 rounded-xl border shadow-xl ${
          isLight
            ? "border-slate-200 bg-white"
            : "border-slate-700 bg-slate-900"
        }`}
      >
        <button
          onClick={() => {
            downloadResponse("pdf");
            setShowDownloadMenu(false);
          }}
          className={`block w-full px-4 py-3 text-left ${
            isLight
              ? "hover:bg-slate-100"
              : "hover:bg-slate-800"
          }`}
        >
          📄 PDF
        </button>

          <button
          onClick={() => {
            downloadResponse("txt");
            setShowDownloadMenu(false);
          }}
          className={`block w-full px-4 py-3 text-left ${
            isLight
              ? "hover:bg-slate-100"
              : "hover:bg-slate-800"
          }`}
        >
          📃 TXT
        </button>

        <button
          onClick={() => {
            downloadResponse("html");
            setShowDownloadMenu(false);
          }}
          className={`block w-full px-4 py-3 text-left ${
            isLight
              ? "hover:bg-slate-100"
              : "hover:bg-slate-800"
          }`}
        >
          🌐 HTML
        </button>

        <button
          onClick={() => {
            downloadResponse("md");
            setShowDownloadMenu(false);
          }}
          className={`block w-full px-4 py-3 text-left ${
            isLight
              ? "hover:bg-slate-100"
              : "hover:bg-slate-800"
          }`}
        >
          📝 Markdown
        </button>

        <button
          onClick={() => {
            downloadResponse("json");
            setShowDownloadMenu(false);
          }}
          className={`block w-full rounded-b-xl px-4 py-3 text-left ${
            isLight
              ? "hover:bg-slate-100"
              : "hover:bg-slate-800"
          }`}
        >
          📦 JSON
        </button>

      </div>
    )}

  </div>
)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ChatMessage);
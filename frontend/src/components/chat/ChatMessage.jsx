import { useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  Image as ImageIcon,
} from "lucide-react";

function ChatMessage({
  sender,
  message,
  file,
  isLastAI,
  onRegenerate,
}) {
  const isUser = sender === "user";
  console.log("FILE DATA:", file);
const getFileIcon = () => {
  if (!file) return <FileText size={22} />;

  if (file.type?.includes("image")) {
    return <ImageIcon size={22} />;
  }

  return <FileText size={22} />;
};

const fileUrl = file?.filename
  ? `http://localhost:5000/uploads/${file.filename}`
  : null;
  console.log("FILE OBJECT:", file);
console.log("FILE URL:", fileUrl);
  const [copiedCode, setCopiedCode] = useState("");
  const [copiedMessage, setCopiedMessage] = useState(false);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);

      setCopiedMessage(true);

      setTimeout(() => {
        setCopiedMessage(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const speakMessage = () => {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);

    utterance.rate = 1;
    utterance.pitch = 1;

    speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`group mb-8 flex items-start gap-4 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-lg ${
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

      <div className="flex flex-1 flex-col">
        <div
          className={`mb-2 text-sm font-semibold ${
            isUser
              ? "text-right text-cyan-300"
              : "text-slate-400"
          }`}
        >
          {isUser ? "You" : "Astra"}
        </div>

        <div
          className={`rounded-2xl px-6 py-5 shadow-lg transition-all duration-200 ${
            isUser
              ? "ml-auto max-w-[85%] bg-cyan-500 text-white"
              : "max-w-[85%] border border-slate-700 bg-slate-800 text-gray-100"
          }`}
        >
         {isUser ? (
  <>
    {file && (
  <div className="mb-3 rounded-2xl border border-cyan-300/20 bg-cyan-600/10 p-4">

    <div className="flex items-center gap-3">

      <div className="rounded-xl bg-cyan-500/20 p-3">
        {getFileIcon()}
      </div>

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
                    <strong className="font-bold text-white">
                      {children}
                    </strong>
                  ),

                  table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-lg border border-slate-700">
                      <table className="min-w-full border-collapse">
                        {children}
                      </table>
                    </div>
                  ),

                  thead: ({ children }) => (
                    <thead className="bg-slate-900">
                      {children}
                    </thead>
                  ),

                  tbody: ({ children }) => (
                    <tbody>{children}</tbody>
                  ),

                  tr: ({ children }) => (
                    <tr className="border-b border-slate-700">
                      {children}
                    </tr>
                  ),

                  th: ({ children }) => (
                    <th className="border border-slate-700 px-4 py-3 text-left font-semibold text-cyan-300">
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td className="border border-slate-700 px-4 py-3 align-top">
                      {children}
                    </td>
                  ),

                  blockquote: ({ children }) => (
                    <blockquote className="my-5 border-l-4 border-cyan-500 pl-4 italic text-slate-300">
                      {children}
                    </blockquote>
                  ),

                  hr: () => (
                    <hr className="my-6 border-slate-700" />
                  ),
                                    code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");

                    if (!inline && match) {
                      const code = String(children).replace(/\n$/, "");

                      return (
                        <div className="mb-6 overflow-hidden rounded-xl border border-slate-700 shadow-lg">
                          <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              {match[1]}
                            </span>

                            <button
                              onClick={() => copyCode(code)}
                              className="rounded-md px-3 py-1 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
                            >
                              {copiedCode === code
                                ? "✅ Copied!"
                                : "📋 Copy"}
                            </button>
                          </div>

                          <SyntaxHighlighter
                            language={match[1]}
                            style={oneDark}
                            customStyle={{
                              margin: 0,
                              borderRadius: 0,
                              padding: "20px",
                              fontSize: "14px",
                            }}
                          >
                            {code}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }

                    return (
                      <code className="rounded bg-slate-900 px-2 py-1 font-mono text-cyan-300">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message}
              </ReactMarkdown>

              {/* Message Actions */}

             <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-700 pt-3">

                <button
                  onClick={copyMessage}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-300 transition hover:bg-cyan-600 hover:text-white"
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-300 transition hover:bg-cyan-600 hover:text-white"
                  title="Read Aloud"
                >
                  <Volume2 size={18} />
                </button>

                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-300 transition hover:bg-cyan-600 hover:text-white"
                  title="Like"
                >
                  <ThumbsUp size={18} />
                </button>

                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-300 transition hover:bg-cyan-600 hover:text-white"
                  title="Dislike"
                >
                  <ThumbsDown size={18} />
                </button>

                {isLastAI && (
                  <button
                    onClick={onRegenerate}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-300 transition hover:bg-cyan-600 hover:text-white"
                    title="Regenerate"
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
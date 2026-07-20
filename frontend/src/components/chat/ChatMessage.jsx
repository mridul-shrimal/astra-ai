import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Copy,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";

function ChatMessage({ sender, message }) {
  const isUser = sender === "user";

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
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
      className={`group flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-md ${
          isUser
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-gray-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message}</p>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-6 mb-4">
                    {children}
                  </h1>
                ),

                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mt-5 mb-3">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="mb-4 leading-7 whitespace-pre-wrap">
                    {children}
                  </p>
                ),

                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-1">
                    {children}
                  </ol>
                ),

                code({ inline, className, children }) {
                  const match = /language-(\w+)/.exec(className || "");

                  if (!inline && match) {
                    const code = String(children).replace(/\n$/, "");

                    return (
                      <div className="overflow-hidden rounded-xl border border-slate-700 mb-5">
                        <div className="flex items-center justify-between bg-slate-900 px-4 py-2">
                          <span className="text-sm uppercase text-slate-400">
                            {match[1]}
                          </span>

                          <button
                            onClick={() => copyCode(code)}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            Copy
                          </button>
                        </div>

                        <SyntaxHighlighter
                          language={match[1]}
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                          }}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code className="rounded bg-slate-900 px-2 py-1 text-cyan-300">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message}
            </ReactMarkdown>

            {/* Message Actions */}
            <div className="mt-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={copyMessage}
                className="rounded-lg p-2 hover:bg-slate-700"
                title="Copy"
              >
                <Copy size={18} />
              </button>

              <button
                onClick={speakMessage}
                className="rounded-lg p-2 hover:bg-slate-700"
                title="Read Aloud"
              >
                <Volume2 size={18} />
              </button>

              <button
                className="rounded-lg p-2 hover:bg-slate-700"
                title="Like"
              >
                <ThumbsUp size={18} />
              </button>

              <button
                className="rounded-lg p-2 hover:bg-slate-700"
                title="Dislike"
              >
                <ThumbsDown size={18} />
              </button>

              <button
                className="rounded-lg p-2 hover:bg-slate-700"
                title="Regenerate"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({
  inline,
  className,
  children,
  isLight,
  copyCode,
  copiedCode,
}) {
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
              isLight
                ? "text-slate-600"
                : "text-slate-400"
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
    <code
      className={`rounded px-2 py-1 font-mono text-sm ${
        isLight
          ? "bg-slate-100 text-cyan-700"
          : "bg-slate-900 text-cyan-300"
      }`}
    >
      {children}
    </code>
  );
}

export default CodeBlock;
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownRenderer({
  message,
  isLight,
  copyCode,
  copiedCode,
  CodeBlock,
}) {
  return (
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

        strong: ({ children }) => (
          <strong
            className={`font-bold ${
              isLight
                ? "text-slate-900"
                : "text-white"
            }`}
          >
            {children}
          </strong>
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

        code(props) {
          return (
            <CodeBlock
              {...props}
              isLight={isLight}
              copyCode={copyCode}
              copiedCode={copiedCode}
            />
          );
        },
      }}
    >
      {message}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
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
  <p
    className={`mb-5 whitespace-pre-wrap ${
      isLight ? "text-slate-800" : "text-slate-200"
    } leading-8`}
  >
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
a: ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-cyan-400 underline decoration-cyan-500 transition hover:text-cyan-300"
  >
    {children}
  </a>
),
img: ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="my-5 max-w-full rounded-xl border border-slate-300 shadow-lg dark:border-slate-700"
    loading="lazy"
  />
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
input: ({ checked }) => (
  <input
    type="checkbox"
    checked={checked}
    readOnly
    className="mr-2 h-4 w-4 accent-cyan-500"
  />
),
        table: ({ children }) => (
          <div
            className={`my-6 overflow-x-auto rounded-lg border ${
              isLight
                ? "border-slate-200"
                : "border-slate-700"
            }`}
          >
            <table className="min-w-full border-collapse text-sm">
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
            className={`border px-5 py-3 text-left font-semibold ${
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
            className={`border px-5 py-3 align-top leading-7 ${
              isLight
                ? "border-slate-200"
                : "border-slate-700"
            }`}
          >
            {children}
          </td>
        ),
inlineCode: ({ children }) => (
  <code
    className={`rounded-md px-1.5 py-0.5 font-mono text-sm ${
      isLight
        ? "bg-slate-200 text-pink-700"
        : "bg-slate-700 text-cyan-300"
    }`}
  >
    {children}
  </code>
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessage({ sender, message }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-md ${
          isUser
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-gray-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-6 mb-4 text-white">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-5 mb-3 text-white">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-4 mb-2 text-white">
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

              li: ({ children }) => (
                <li>{children}</li>
              ),

              strong: ({ children }) => (
                <strong className="font-bold text-white">
                  {children}
                </strong>
              ),

              em: ({ children }) => (
                <em className="italic">
                  {children}
                </em>
              ),

              code: ({ children }) => (
                <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">
                  {children}
                </code>
              ),

              pre: ({ children }) => (
                <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto mb-4">
                  {children}
                </pre>
              ),

              hr: () => (
                <hr className="my-6 border-slate-600" />
              ),
            }}
          >
            {message}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
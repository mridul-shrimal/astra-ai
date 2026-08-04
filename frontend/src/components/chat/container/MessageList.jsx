import ChatMessage from "../ChatMessage";

function MessageList({
  messages,
  onRegenerate,
  onFeedback,
  onFavorite,
}) {
return (
  <>
    {messages.length === 0 ? (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10">
    <span className="text-5xl">🤖</span>
  </div>

  <h1 className="mb-2 text-3xl font-bold">
    Welcome to Astra AI
  </h1>

  <p className="mb-8 max-w-xl text-slate-400">
    Ask anything, analyze files, write code, brainstorm ideas,
    or start a conversation with your AI assistant.
  </p>

  <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
    <button className="rounded-xl border border-slate-700 p-4 text-left transition hover:border-cyan-500 hover:bg-cyan-500/10">
      <div className="mb-2 text-2xl">💻</div>
      <h3 className="font-semibold">Explain Code</h3>
      <p className="mt-1 text-sm text-slate-400">
        Understand code step by step.
      </p>
    </button>

    <button className="rounded-xl border border-slate-700 p-4 text-left transition hover:border-cyan-500 hover:bg-cyan-500/10">
      <div className="mb-2 text-2xl">✍️</div>
      <h3 className="font-semibold">Write Content</h3>
      <p className="mt-1 text-sm text-slate-400">
        Blogs, emails, reports and more.
      </p>
    </button>

    <button className="rounded-xl border border-slate-700 p-4 text-left transition hover:border-cyan-500 hover:bg-cyan-500/10">
      <div className="mb-2 text-2xl">📄</div>
      <h3 className="font-semibold">Summarize</h3>
      <p className="mt-1 text-sm text-slate-400">
        Summarize documents or articles.
      </p>
    </button>

    <button className="rounded-xl border border-slate-700 p-4 text-left transition hover:border-cyan-500 hover:bg-cyan-500/10">
      <div className="mb-2 text-2xl">💡</div>
      <h3 className="font-semibold">Brainstorm Ideas</h3>
      <p className="mt-1 text-sm text-slate-400">
        Generate creative ideas instantly.
      </p>
    </button>
  </div>

  <p className="mt-8 text-sm text-slate-500">
    Start typing below to begin your conversation.
  </p>
</div>
    ) : (
      messages.map((message, index) => (
        <div
          key={message.id}
          id={`message-${message.id}`}
        >
          <ChatMessage
            id={message.id}
            sender={message.sender}
            message={message.message}
            timestamp={message.timestamp}
            files={message.files}
            liked={message.liked}
            disliked={message.disliked}
            favorite={message.favorite}
            isLastAI={
              message.sender === "ai" &&
              index === messages.length - 1
            }
            onRegenerate={onRegenerate}
            onFeedback={onFeedback}
            onFavorite={onFavorite}
          />
        </div>
      ))
    )}
  </>
);
}

export default MessageList;
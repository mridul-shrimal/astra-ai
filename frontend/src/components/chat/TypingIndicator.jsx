function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="rounded-2xl bg-slate-800 px-4 py-3 text-gray-300 shadow-md">
        <p className="mb-2">🤖 Astra is thinking...</p>

        <div className="flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]"></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
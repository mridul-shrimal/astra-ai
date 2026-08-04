function TypingIndicator() {
  return (
    <div className="mb-4 flex justify-start">
      <div className="max-w-xs rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-lg">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20">
            🤖
          </div>

          <div>
            <p className="font-medium text-white">
              Astra
            </p>

            <p className="text-xs text-slate-400">
              Thinking...
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-400"></span>
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]"></span>
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
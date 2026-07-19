import ChatMessage from "./ChatMessage";

function ChatContainer() {
  return (
    <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <ChatMessage
        sender="ai"
        message="Hello Mridul 👋 I'm Astra. How can I help you today?"
      />

      <ChatMessage
        sender="user"
        message="Let's build Astra AI."
      />

    </div>
  );
}

export default ChatContainer;
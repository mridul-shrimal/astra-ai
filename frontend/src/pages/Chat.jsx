import ChatContainer from "../components/chat/ChatContainer";
import ChatInput from "../components/chat/ChatInput";
import TypingIndicator from "../components/chat/TypingIndicator";

function Chat() {
  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-4">

      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Astra Chat
        </h1>

        <p className="mt-2 text-slate-400">
          Talk with your AI assistant.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col gap-4">

        <ChatContainer />

        {/* Temporary Typing Indicator */}
        <TypingIndicator />

        <ChatInput />

      </div>

    </div>
  );
}

export default Chat;
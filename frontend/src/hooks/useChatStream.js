import supabase from "../config/supabase";
function useChatStream({
  updateCurrentMessages,
  stopGenerationRef,
  setIsTyping,
  setIsGenerating,
}) {
  

  // =========================
  // Stream Message
  // =========================

const streamMessage = async (
  sessionId,
  messageId,
  existingMessages,
  requestData
) => {
  try {
    setIsTyping(true);
    setIsGenerating(true);

    stopGenerationRef.current = false;

    const {
  data: { session },
} = await supabase.auth.getSession();

const response = await fetch(
  "http://localhost:5000/api/chat/stream",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: requestData,
  }
);

    if (!response.ok) {
      throw new Error(
        `Streaming request failed: ${response.status}`
      );
    }

    if (!response.body) {
      throw new Error(
        "Streaming is not supported by this browser."
      );
    }

    const reader =
      response.body.getReader();

    const decoder = new TextDecoder();

    let buffer = "";
    let current = "";

    while (true) {
      if (stopGenerationRef.current) {
        await reader.cancel();
        break;
      }

      const { value, done } =
        await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events = buffer.split("\n\n");

      buffer = events.pop() || "";

      for (const event of events) {
        const line = event
          .split("\n")
          .find((line) =>
            line.startsWith("data:")
          );

        if (!line) {
          continue;
        }

        const data = line
          .replace(/^data:\s*/, "")
          .trim();

        if (!data) {
          continue;
        }

        if (data === "[DONE]") {
          continue;
        }

        try {
          const parsed = JSON.parse(data);

          if (
            parsed.type === "chunk" &&
            parsed.content
          ) {
            current += parsed.content;

            updateCurrentMessages(
              existingMessages.map((msg) =>
                msg.id === messageId
                  ? {
                      ...msg,
                      message: current,
                    }
                  : msg
              )
            );
          }

          if (parsed.type === "done") {
            console.log(
              "✅ Streaming complete:",
              parsed.modelUsed
            );
          }

          if (parsed.type === "error") {
            throw new Error(
              parsed.message ||
                "Streaming failed."
            );
          }
        } catch (parseError) {
          console.warn(
            "⚠️ Stream parse error:",
            parseError
          );
        }
      }
    }

    setIsTyping(false);
    setIsGenerating(false);

    return current;
  } catch (error) {
    console.error(
      "❌ Streaming Error:",
      error
    );

    setIsTyping(false);
    setIsGenerating(false);

    throw error;
  }
};

  return {
  streamMessage,
};
}

export default useChatStream;
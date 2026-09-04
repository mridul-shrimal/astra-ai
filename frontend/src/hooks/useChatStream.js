import { createChatService } from "@astra/shared";
import api from "../services/api";
import supabase from "../config/supabase";

const chatService = createChatService();

function useChatStream({
  updateCurrentMessages,
  stopGenerationRef,
  setIsTyping,
  setIsGenerating,
}) {
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
        `${api.defaults.baseURL}/chat/stream`,
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

      const accumulator =
        chatService.createAssistantResponseAccumulator({
          onChunk: (content) => {
            updateCurrentMessages(
              chatService.updateMessageContent(
                existingMessages,
                messageId,
                content,
                "message"
              )
            );
          },
          onDone: (event) => {
            console.log("Streaming complete:", event.modelUsed);
          },
        });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (stopGenerationRef.current) {
          await reader.cancel();
          break;
        }

        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");

        buffer = events.pop() || "";

        chatService.processChatSseEvents(events, {
          accumulator,
          onParseError: (parseError) => {
            console.warn("Stream parse error:", parseError);
          },
        });
      }

      return accumulator.getResponse();
    } catch (error) {
      console.error("Streaming Error:", error);
      throw error;
    } finally {
      setIsTyping(false);
      setIsGenerating(false);
    }
  };

  return { streamMessage };
}

export default useChatStream;

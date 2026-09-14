import { useCallback, useRef, useState } from "react";

import {
  createChatService,
  createChatRequest,
  processChatSseEvents,
  createAssistantResponseAccumulator,
  getConversationSessionId,
} from "@astra/shared";
import api from "../services/api";

const chatService = createChatService();

const useChat = (session, selectedConversation) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingError, setStreamingError] = useState(null);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(
    async ({ message, files, onMessageUpdate }) => {
      const sessionId = getConversationSessionId(selectedConversation);

      if (!session?.access_token) {
        throw new Error("No authenticated session");
      }

      if (!message || !message.trim()) {
        return { content: "", modelUsed: null };
      }

      setStreamingError(null);
      setIsStreaming(true);

      const chatRequest = createChatRequest({
        message,
        sessionId,
        model: "mistralai/mistral-small-3.2-24b-instruct",
        temperature: 0.7,
        useMemory: true,
      });

      const accumulator = createAssistantResponseAccumulator({
        onChunk: (content) => {
          onMessageUpdate?.(content);
        },
        onDone: (event) => {
          onMessageUpdate?.(event);
        },
      });

      const formData = new FormData();

      formData.append("message", chatRequest.message);
      formData.append("sessionId", chatRequest.sessionId || "");
      formData.append("model", chatRequest.model);
      formData.append("temperature", String(chatRequest.temperature));
      formData.append("useMemory", String(chatRequest.useMemory));

      if (files && files.length > 0) {
        files.forEach((file, index) => {
          const fileName = file.name || `file_${index}`;
          const fileObj = {
            uri: file.uri,
            name: fileName,
            type: file.type || "application/octet-stream",
          };

          formData.append("files", fileObj);
        });
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/chat/stream`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: formData,
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Session expired. Please sign in again."
              : "Failed to send message"
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          const completeEvents = lines.filter(
            (line) => line.startsWith("data:") && line.trim() !== "data: [DONE]"
          );

          if (completeEvents.length > 0) {
            processChatSseEvents(completeEvents, {
              accumulator: accumulator,
            });
          }
        }

        const remainingLines = buffer
          .split("\n")
          .filter((line) => line.startsWith("data:") && line.trim() !== "data: [DONE]");

        if (remainingLines.length > 0) {
          processChatSseEvents(remainingLines, {
            accumulator,
          });
        }

        const finalContent = accumulator.getResponse();
        const doneEvent = accumulator.getDoneEvent();

        return {
          content: finalContent,
          modelUsed: doneEvent?.modelUsed || null,
          files: doneEvent?.files || [],
        };
      } catch (error) {
        if (error.name === "AbortError") {
          throw error;
        }

        setStreamingError(
          error.message || "Failed to send message. Please try again."
        );

        throw error;
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [session?.access_token, selectedConversation]
  );

  const abortChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    sendMessage,
    isStreaming,
    streamingError,
    abortChat,
  };
};

export default useChat;

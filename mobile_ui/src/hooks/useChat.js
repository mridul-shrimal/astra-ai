import { useCallback, useEffect, useRef, useState } from "react";

import {
  createChatService,
  createChatRequest,
  createAssistantResponseAccumulator,
  getConversationSessionId,
  generateChatTitle,
  processChatSseEvents,
} from "@astra/shared";
const chatService = createChatService();

const useChat = (
  session,
  selectedConversation,
  preferences,
  updateConversationTitle
) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingError, setStreamingError] = useState(null);
  const abortControllerRef = useRef(null);
  const stoppedRef = useRef(false);

  useEffect(() => () => {
    stoppedRef.current = true;
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async ({ message, files = [], conversation, onMessageUpdate }) => {
      const activeConversation = conversation || selectedConversation;
      const sessionId = getConversationSessionId(activeConversation);

      if (!session?.access_token) {
        throw new Error("No authenticated session");
      }

      if (!sessionId) {
        throw new Error("No active conversation");
      }

      if (!message || !message.trim()) {
        if (!files || files.length === 0) {
          return { content: "", modelUsed: null };
        }
      }

      setStreamingError(null);
      setIsStreaming(true);

      const model = preferences?.model || "mistralai/mistral-small-3.2-24b-instruct";
      const temperature = Number(preferences?.temperature) || 0.7;
      const useMemory = !!preferences?.memoryEnabled;
      const autoSaveMemory = !!preferences?.memoryAutoSave;

      const chatRequest = createChatRequest({
        message: message || "",
        sessionId,
        model,
        temperature,
        useMemory,
        autoSaveMemory,
        allowEmptyMessage: !!(files && files.length > 0),
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
      formData.append("autoSaveMemory", String(chatRequest.autoSaveMemory));

      if (files && files.length > 0) {
        files.forEach((file, index) => {
          const fileName = file.name || `file_${index}`;
          const fileObj = {
            uri: file.uri || file.localUri,
            name: fileName,
            type: file.type || file.mimetype || "application/octet-stream",
          };

          formData.append("files", fileObj);
        });
      }

      try {
        if ((!activeConversation?.title || activeConversation.title === "New Chat") && message?.trim()) {
          const title = generateChatTitle(message.trim());
          await updateConversationTitle?.(activeConversation, title);
        }

        return await streamWithXhr({
          formData,
          accessToken: session.access_token,
          accumulator,
          onMessageUpdate,
          stoppedRef,
          sourceRef: abortControllerRef,
        });
      } catch (error) {
        if (error.name === "AbortError") {
          throw error;
        }

        setStreamingError(
          error.message || "Failed to send message. Please try again."
        );

        throw error;
      } finally {
        stoppedRef.current = false;
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [session?.access_token, selectedConversation, preferences, updateConversationTitle]
  );

  const abortChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const stopGeneration = useCallback(() => {
    stoppedRef.current = true;
    abortChat();
  }, [abortChat]);

  return {
    sendMessage,
    isStreaming,
    streamingError,
    abortChat,
    stopGeneration,
  };
};

function streamWithXhr({
  formData,
  accessToken,
  accumulator,
  onMessageUpdate,
  stoppedRef,
  sourceRef,
}) {
  return new Promise((resolve, reject) => {
    const source = new XMLHttpRequest();
    let processedLength = 0;
    let finished = false;

    const finish = (error) => {
      if (finished) return;
      finished = true;
      if (sourceRef.current === source) sourceRef.current = null;
      if (error && !stoppedRef.current) {
        reject(error);
      } else {
        resolve({
          content: accumulator.getResponse(),
          modelUsed: accumulator.getDoneEvent()?.modelUsed || null,
          files: accumulator.getDoneEvent()?.files || [],
        });
      }
    };

    const processFrames = () => {
      const responseText = source.responseText || "";
      const boundary = responseText.lastIndexOf("\n\n");
      if (boundary < processedLength) return;

      const frames = responseText.slice(processedLength, boundary).split("\n\n");
      processedLength = boundary + 2;
      frames.forEach((frame) => {
        if (!frame || stoppedRef.current) return;
        processChatSseEvents([frame], { accumulator });
        onMessageUpdate?.(accumulator.getResponse());
      });
    };

    source.open("POST", `${process.env.EXPO_PUBLIC_API_URL}/chat/stream`);
    source.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    source.setRequestHeader("Accept", "text/event-stream");
    source.onprogress = () => {
      try {
        processFrames();
      } catch (error) {
        finish(error);
      }
    };
    source.onload = () => {
      try {
        processFrames();
        if (source.status < 200 || source.status >= 300) {
          finish(new Error(source.status === 401 ? "Session expired. Please sign in again." : "Streaming request failed."));
          return;
        }
        finish();
      } catch (error) {
        finish(error);
      }
    };
    source.onerror = () => finish(new Error("Streaming response failed."));
    source.onabort = () => finish();
    sourceRef.current = source;
    source.send(formData);
  });
}

export default useChat;

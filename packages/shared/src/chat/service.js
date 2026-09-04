import { parseSseEvents } from "./sse.js";

export const DEFAULT_CHAT_MODEL =
  "mistralai/mistral-small-3.2-24b-instruct";

export function createChatRequest({
  message,
  sessionId,
  model = DEFAULT_CHAT_MODEL,
  temperature = 0.7,
  useMemory = false,
  autoSaveMemory = false,
  allowEmptyMessage = false,
} = {}) {
  const normalizedMessage = message?.trim() || "";

  if (!sessionId) {
    throw new Error("A conversation session ID is required.");
  }

  if (!allowEmptyMessage && !normalizedMessage) {
    throw new Error("A message is required.");
  }

  return {
    message: normalizedMessage,
    sessionId,
    model,
    temperature,
    useMemory,
    autoSaveMemory,
  };
}

export function getMessageContent(message) {
  return message?.content ?? message?.message ?? message?.text ?? "";
}

export function updateMessageContent(
  messages,
  messageId,
  content,
  contentKey = "content"
) {
  return messages.map((message) =>
    message.id === messageId
      ? { ...message, [contentKey]: content }
      : message
  );
}

export function createAssistantResponseAccumulator({
  onChunk,
  onDone,
} = {}) {
  let response = "";
  let doneEvent = null;
  let streamError = null;

  return {
    processEvent(event) {
      if (event?.type === "chunk" && event.content) {
        response += event.content;
        onChunk?.(response, event);
      }

      if (event?.type === "done") {
        doneEvent = event;
        onDone?.(event, response);
      }

      if (event?.type === "error") {
        streamError = new Error(
          event.message || "Streaming failed."
        );
      }
    },

    getResponse: () => response,
    getDoneEvent: () => doneEvent,
    getError: () => streamError,
  };
}

export function processChatSseEvents(
  events,
  { accumulator, onParseError } = {}
) {
  const activeAccumulator =
    accumulator || createAssistantResponseAccumulator();

  parseSseEvents(events, {
    onEvent: (event) => activeAccumulator.processEvent(event),
    onParseError,
  });

  const streamError = activeAccumulator.getError();

  if (streamError) {
    throw streamError;
  }

  return activeAccumulator;
}

export function createChatService() {
  return {
    createChatRequest,
    getMessageContent,
    updateMessageContent,
    createAssistantResponseAccumulator,
    processChatSseEvents,
  };
}

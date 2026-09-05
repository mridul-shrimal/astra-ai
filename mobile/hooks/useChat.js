import { useRef, useState } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  createChatRequest,
  createChatService,
  generateChatTitle,
  getConversationSessionId,
} from "@astra/shared";

import api from "../api";
import { supabase } from "../supabase";

const chatService = createChatService();

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_ATTACHMENTS = 10;

function isAcceptedFile(file) {
  const isWithinSizeLimit = !file.size || file.size <= MAX_FILE_SIZE;
  const hasAcceptedType =
    !file.mimeType || ACCEPTED_FILE_TYPES.includes(file.mimeType);

  return isWithinSizeLimit && hasAcceptedType;
}

function validateSelectedFiles(files) {
  return files.every(isAcceptedFile);
}

function buildChatFormData(request, files) {
  const formData = new FormData();

  Object.entries(request).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  files.forEach((file) => {
    formData.append("files", {
      uri: file.uri,
      name: file.name || "upload",
      type: file.mimeType || "application/octet-stream",
    });
  });

  return formData;
}

export default function useChat({
  selectedConversation,
  setMessages,
  renameConversation,
  preferences,
}) {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const sourceRef = useRef(null);
  const stoppedRef = useRef(false);

  const pickAttachments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ACCEPTED_FILE_TYPES,
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const selectedFiles = result.assets || [];

      if (!validateSelectedFiles(selectedFiles)) {
        Alert.alert(
          "Unsupported file",
          "Use a supported file type smaller than 20 MB."
        );
        return;
      }

      setAttachments((currentAttachments) =>
        [...currentAttachments, ...selectedFiles].slice(
          0,
          MAX_ATTACHMENTS
        )
      );
    } catch {
      Alert.alert("Couldn't select files", "Please try again.");
    }
  };

  const removeAttachment = (uri) => {
    setAttachments((currentAttachments) =>
      currentAttachments.filter((file) => file.uri !== uri)
    );
  };

  const stopGeneration = () => {
    stoppedRef.current = true;
    sourceRef.current?.abort?.();
    sourceRef.current = null;
    setIsSending(false);
  };

  const streamChatMessage = ({
    assistantId,
    accessToken,
    request,
    files,
  }) =>
    new Promise((resolve, reject) => {
      const accumulator =
        chatService.createAssistantResponseAccumulator({
          onChunk: (content) => {
            if (stoppedRef.current) {
              return;
            }

            setMessages((currentMessages) =>
              chatService.updateMessageContent(
                currentMessages,
                assistantId,
                content,
                "content"
              )
            );
          },
        });

      const source = new XMLHttpRequest();
      let processedLength = 0;
      let finished = false;

      const finishStream = () => {
        if (finished) {
          return;
        }

        finished = true;

        if (sourceRef.current === source) {
          sourceRef.current = null;
        }

        if (!stoppedRef.current) {
          setMessages((currentMessages) =>
            chatService.updateMessageContent(
              currentMessages,
              assistantId,
              accumulator.getResponse() ||
                "Astra returned an empty response.",
              "content"
            )
          );
        }

        resolve(accumulator.getResponse());
      };

      const processAvailableFrames = () => {
        const responseText = source.responseText || "";
        const lastBoundary = responseText.lastIndexOf("\n\n");

        if (lastBoundary < processedLength) {
          return;
        }

        const frames = responseText
          .slice(processedLength, lastBoundary)
          .split("\n\n");

        processedLength = lastBoundary + 2;

        frames.forEach((frame) => {
          if (!frame || stoppedRef.current) {
            return;
          }

          chatService.processChatSseEvents([frame], {
            accumulator,
          });

          const data = frame
            .split("\n")
            .find((line) => line.startsWith("data:"))
            ?.replace(/^data:\s*/, "")
            .trim();

          if (
            data &&
            data !== "[DONE]" &&
            JSON.parse(data).type === "done"
          ) {
            finishStream();
          }
        });
      };

      source.open("POST", `${api.defaults.baseURL}/chat/stream`);
      source.setRequestHeader(
        "Authorization",
        `Bearer ${accessToken}`
      );
      source.setRequestHeader("Accept", "text/event-stream");

      source.onprogress = () => {
        try {
          processAvailableFrames();
        } catch (error) {
          reject(error);
        }
      };

      source.onload = () => {
  console.log("[STREAM] XHR LOAD", {
    status: source.status,
    responseLength: source.responseText?.length ?? 0,
    responsePreview: source.responseText?.slice(0, 500),
  });
        try {
          processAvailableFrames();

          if (source.status < 200 || source.status >= 300) {
            reject(
              new Error(`Streaming request failed: ${source.status}`)
            );
            return;
          }

          finishStream();
        } catch (error) {
          reject(error);
        }
      };

      source.onerror = () => {
        if (!stoppedRef.current) {
          reject(new Error("Streaming response failed."));
        }
      };

      source.onabort = finishStream;
      sourceRef.current = source;
      console.log("[STREAM] XHR SEND");
source.send(buildChatFormData(request, files));
    });

  const sendMessage = async (overrideText) => {
  console.log("[SEND] sendMessage CALLED", {
    overrideText,
    messageText,
    isSending,
  });
    const rawText =
      typeof overrideText === "string" ? overrideText : messageText;
    const text = rawText.trim();
    const sessionId = getConversationSessionId(selectedConversation);
    const currentAttachments = attachments;
console.log("[SEND] prepared", {
  text,
  sessionId,
  attachmentCount: currentAttachments.length,
  isSending,
});
    if (
      (!text && !currentAttachments.length) ||
      !sessionId ||
      isSending
    ) {
      return;
    }
console.log("[SEND] validation PASSED");
    const assistantId = `assistant-${Date.now()}`;
    stoppedRef.current = false;

    try {
      setIsSending(true);
      setMessageText("");
      setAttachments([]);

      if (selectedConversation.title === "New Chat") {
        await renameConversation?.(
          sessionId,
          text
            ? generateChatTitle(text)
            : currentAttachments[0]?.name || "New Chat"
        );
      }

      const userMessage = {
        id: `user-${Date.now()}`,
        content: text || "Uploaded document(s)",
        role: "user",
        files: currentAttachments.map((file) => ({
          name: file.name,
          type: file.mimeType,
          size: file.size,
        })),
      };

      const assistantMessage = {
        id: assistantId,
        content: "",
        role: "assistant",
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        userMessage,
        assistantMessage,
      ]);

    console.log("[SEND] getting Supabase session");

const {
  data: { session },
} = await supabase.auth.getSession();

console.log("[SEND] session result", {
  hasSession: Boolean(session),
  hasToken: Boolean(session?.access_token),
});

      if (!session?.access_token) {
        throw new Error("No active Supabase session.");
      }

      const request = createChatRequest({
        message: text,
        sessionId,
        model: preferences.model,
        temperature: preferences.temperature,
        useMemory: preferences.memoryEnabled,
        autoSaveMemory: preferences.memoryAutoSave,
        allowEmptyMessage: currentAttachments.length > 0,
      });

      console.log("[STREAM] STARTING", {
  sessionId,
  baseURL: api.defaults.baseURL,
  hasToken: Boolean(session.access_token),
});

await streamChatMessage({
  assistantId,
  accessToken: session.access_token,
  request,
  files: currentAttachments,
});
    } catch (error) {
      if (!stoppedRef.current) {
        Alert.alert(
          "Message failed",
          error.message || "Could not send message."
        );

        setMessages((currentMessages) =>
          currentMessages.filter(
            (message) => message.id !== assistantId
          )
        );
      }
    } finally {
      if (!stoppedRef.current) {
        setIsSending(false);
      }
    }
  };

  const regenerate = (messages, assistantId) => {
    const messageIndex = messages.findIndex(
      (message) => message.id === assistantId
    );

    const previousUserMessage = messages
      .slice(0, messageIndex)
      .reverse()
      .find(
        (message) =>
          message.role === "user" || message.sender === "user"
      );

    if (!previousUserMessage) {
      return;
    }

    setMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== assistantId)
    );

    sendMessage(
      previousUserMessage.content ||
        previousUserMessage.message ||
        ""
    );
  };

  return {
    messageText,
    setMessageText,
    sendMessage,
    isSending,
    attachments,
    pickAttachments,
    removeAttachment,
    stopGeneration,
    regenerate,
  };
}

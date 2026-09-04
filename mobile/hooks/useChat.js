import { useState } from "react";
import { Alert } from "react-native";
import {
  createChatRequest,
  createChatService,
  generateChatTitle,
  getConversationSessionId,
} from "@astra/shared";
import api from "../api";
import { supabase } from "../supabase";

const chatService = createChatService();

const useChat = ({
  session,
  selectedConversation,
  setMessages,
  renameConversation,
}) => {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    const text = messageText.trim();
    const sessionId = getConversationSessionId(selectedConversation);

    if (!text || !sessionId) {
      return;
    }

    const assistantId = `assistant-${Date.now()}`;

    try {
      setIsSending(true);
      setMessageText("");

      if (selectedConversation.title === "New Chat") {
        await renameConversation?.(
          sessionId,
          generateChatTitle(text)
        );
      }

      const userMessage = {
        id: `user-${Date.now()}`,
        content: text,
        role: "user",
      };
      const assistantMessage = {
        id: assistantId,
        content: "",
        role: "assistant",
      };

      setMessages((current) => [
        ...current,
        userMessage,
        assistantMessage,
      ]);

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession?.access_token) {
        throw new Error("No active Supabase session.");
      }

      const request = createChatRequest({
        message: text,
        sessionId,
        useMemory: false,
        autoSaveMemory: false,
      });
      const formData = new FormData();

      Object.entries(request).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const response = await fetch(
        `${api.defaults.baseURL}/chat/stream`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentSession.access_token}`,
            Accept: "text/event-stream",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Streaming request failed: ${response.status}`
        );
      }

      const accumulator =
        chatService.createAssistantResponseAccumulator({
          onChunk: (content) => {
            setMessages((current) =>
              chatService.updateMessageContent(
                current,
                assistantId,
                content,
                "content"
              )
            );
          },
        });

      chatService.processChatSseEvents(
        (await response.text()).split("\n\n"),
        {
          accumulator,
          onParseError: (parseError) => {
            console.log("SSE parse warning:", parseError.message);
          },
        }
      );

      const currentResponse = accumulator.getResponse();

      setMessages((current) =>
        chatService.updateMessageContent(
          current,
          assistantId,
          currentResponse || "Astra returned an empty response.",
          "content"
        )
      );

      return currentResponse;
    } catch (error) {
      console.log("SEND MESSAGE ERROR:", error.message);

      Alert.alert(
        "Message failed",
        error.message || "Could not send message."
      );

      setMessages((current) =>
        current.filter((message) => message.id !== assistantId)
      );

      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return {
    messageText,
    setMessageText,
    sendMessage,
    isSending,
  };
};

export default useChat;

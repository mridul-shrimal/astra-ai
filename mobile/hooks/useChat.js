import { useState } from "react";
import { Alert } from "react-native";
import { parseSseEvents } from "@astra/shared";
import { supabase } from "../supabase";

const useChat = ({
  session,
  selectedConversation,
  setMessages,
}) => {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    const text = messageText.trim();

    if (!text || !selectedConversation) {
      return;
    }

    const assistantId = `assistant-${Date.now()}`;

    try {
      setIsSending(true);
      setMessageText("");

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

      const formData = new FormData();

      formData.append("message", text);
      formData.append(
        "sessionId",
        selectedConversation.session_id
      );
      formData.append(
        "model",
        "mistralai/mistral-small-3.2-24b-instruct"
      );
      formData.append("temperature", "0.7");
      formData.append("useMemory", "false");
      formData.append("autoSaveMemory", "false");

      console.log("🚀 Sending message to Astra...");

      const response = await fetch(
       "http://10.138.130.152:5000/api/chat/stream",
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
        const errorText = await response.text();

        console.log(
          "❌ STREAM ERROR:",
          response.status,
          errorText
        );

        throw new Error(
          `Streaming request failed: ${response.status}`
        );
      }

      const responseText = await response.text();

      let currentResponse = "";

      const events = responseText.split("\n\n");

      parseSseEvents(events, {
        onEvent: (parsed) => {

          if (
            parsed.type === "chunk" &&
            parsed.content
          ) {
            currentResponse += parsed.content;

            setMessages((current) =>
              current.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content: currentResponse,
                    }
                  : msg
              )
            );
          }

          if (parsed.type === "done") {
            console.log(
              "✅ AI STREAM COMPLETE:",
              parsed.modelUsed
            );
          }

          if (parsed.type === "error") {
            throw new Error(
              parsed.message ||
                "AI streaming failed."
            );
          }
        },
        onParseError: (parseError) => {
          console.log(
            "⚠️ SSE parse warning:",
            parseError.message
          );
        },
      });

      console.log(
        "✅ Final AI response:",
        currentResponse
      );

      setMessages((current) =>
        current.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  currentResponse ||
                  "Astra returned an empty response.",
              }
            : msg
        )
      );

      return currentResponse;
    } catch (error) {
      console.log(
        "❌ SEND MESSAGE ERROR:",
        error.message
      );

      Alert.alert(
        "Message failed",
        error.message ||
          "Could not send message."
      );

      setMessages((current) =>
        current.filter(
          (msg) => msg.id !== assistantId
        )
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

import { useEffect, useState } from "react";
import api from "../api";
import {
  createConversationService,
  getConversationSessionId,
} from "@astra/shared";

const conversationService = createConversationService(api);
const useMessages = (session, selectedConversation) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadMessages = async () => {
    if (!session?.access_token) {
      setMessages([]);
      return;
    }

    const conversationId = getConversationSessionId(
      selectedConversation
    );

    if (!conversationId) {

      setMessages([]);
      return;
    }

    try {
      setLoadingMessages(true);

      console.log(
        "📨 Loading messages:",
        conversationId
      );

      const loadedMessages =
        await conversationService.getConversationMessages(
          selectedConversation
        );

      setMessages(loadedMessages);
    } catch (error) {
      console.log(
        "❌ FAILED TO LOAD MESSAGES:",
        error
      );

      console.log(
        "❌ STATUS:",
        error.response?.status
      );

      console.log(
        "❌ RESPONSE:",
        error.response?.data
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [
    session,
    getConversationSessionId(selectedConversation),
  ]);

  return {
    messages,
    setMessages,
    loadingMessages,
    loadMessages,
  };
};

export default useMessages;

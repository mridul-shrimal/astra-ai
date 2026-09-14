import { useCallback, useEffect, useState } from "react";

import { createConversationService, getConversationSessionId } from "@astra/shared";
import api from "../services/api";

const conversationService = createConversationService(api);

const normalizeMessage = (msg) => {
  const role = msg.sender === "ai" ? "assistant" : msg.sender === "user" ? "user" : "assistant";
  return {
    id: msg.id ? `msg-${msg.id}` : `${msg.sender}-${Date.now()}`,
    role,
    content: msg.content || "",
    createdAt: msg.created_at,
  };
};

const useMessages = (session, selectedConversation) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const loadMessages = useCallback(async () => {
    if (!session?.access_token) {
      setMessages([]);
      setError(null);
      return;
    }

    const conversationId = getConversationSessionId(selectedConversation);

    if (!conversationId) {
      setMessages([]);
      setError(null);
      return;
    }

    try {
      setLoadingMessages(true);
      setError(null);

      const loadedMessages = await conversationService.getConversationMessages(
        selectedConversation
      );

      const normalized = (loadedMessages || []).map(normalizeMessage);
      setMessages(normalized);
    } catch (err) {
      setError(err.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [session?.access_token, selectedConversation]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    setMessages,
    loadingMessages,
    error,
    loadMessages,
  };
};

export default useMessages;

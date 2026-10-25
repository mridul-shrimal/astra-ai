import { useCallback, useEffect, useRef, useState } from "react";

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
  const previousConversationIdRef = useRef(null);
  const updateMessages = (nextMessages) => {
    setMessages(nextMessages);
  };

  const loadMessages = useCallback(async () => {
    if (!session?.access_token) {
      updateMessages([]);
      setError(null);
      return;
    }

    const conversationId = getConversationSessionId(selectedConversation);

    if (!conversationId) {
      updateMessages([]);
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
      setMessages((currentMessages) =>
        normalized.length > 0 ? normalized : currentMessages
      );
    } catch (err) {
      setError(err.message || "Failed to load messages");
      updateMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [session?.access_token, selectedConversation]);

  useEffect(() => {
    const conversationId = getConversationSessionId(selectedConversation);
    const conversationChanged = conversationId !== previousConversationIdRef.current;

    if (conversationChanged && conversationId && selectedConversation?.title !== "New Chat") {
      setMessages([]);
    }

    previousConversationIdRef.current = conversationId;
    loadMessages();
  }, [loadMessages, selectedConversation]);

  return {
    messages,
    setMessages,
    loadingMessages,
    error,
    loadMessages,
  };
};

export default useMessages;

import { useEffect, useState } from "react";
import api from "../api";

const useMessages = (session, selectedConversation) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadMessages = async () => {
    if (!session?.access_token) {
      setMessages([]);
      return;
    }

    if (!selectedConversation?.session_id) {

      setMessages([]);
      return;
    }

    try {
      setLoadingMessages(true);

      console.log(
        "📨 Loading messages:",
        selectedConversation.session_id
      );

      const response = await api.get(
        `/conversations/${selectedConversation.session_id}/messages`
      );

      console.log(
        "📨 MESSAGE RESPONSE:",
        response.data
      );

      const loadedMessages =
        response.data?.messages || [];

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
    selectedConversation?.session_id,
  ]);

  return {
    messages,
    setMessages,
    loadingMessages,
    loadMessages,
  };
};

export default useMessages;
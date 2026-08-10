import { useEffect, useState } from "react";
import api from "../api";

const useConversations = (session) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState(null);
  const [loadingConversations, setLoadingConversations] =
    useState(false);

  const loadConversations = async () => {
    if (!session?.access_token) {
      setConversations([]);
      return;
    }

    try {
      setLoadingConversations(true);

      const response = await api.get("/conversations");

      console.log(
        "CONVERSATIONS RESPONSE:",
        response.data
      );

      const list = response.data?.conversations || [];

      setConversations(list);

      if (list.length > 0 && !selectedConversation) {
        setSelectedConversation(list[0]);
      }
    } catch (error) {
      console.log(
        "❌ Failed to load conversations:",
        error.message
      );

      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadConversations();
    } else {
      setConversations([]);
      setSelectedConversation(null);
    }
  }, [session]);

  return {
  conversations,
  setConversations,
  selectedConversation,
  setSelectedConversation,
  loadingConversations,
  loadConversations,
};
};

export default useConversations;
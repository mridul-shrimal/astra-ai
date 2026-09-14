import { useCallback, useEffect, useState } from "react";

import { Alert } from "react-native";

import {
  createConversationService,
  getConversationSessionId,
} from "@astra/shared";
import api from "../services/api";

const conversationService = createConversationService(api);

const useConversations = (session) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadConversations = useCallback(async () => {
    if (!session?.access_token) {
      setConversations([]);
      setSelectedConversation(null);
      setError(null);
      return;
    }

    try {
      setLoadingConversations(true);
      setError(null);

      const list = await conversationService.getConversations();

      setConversations(list.map(normalizeConversationWithPin));
    } catch (err) {
      setError(err.message || "Failed to load conversations");
      setConversations([]);
      setSelectedConversation(null);
    } finally {
      setLoadingConversations(false);
    }
  }, [session?.access_token]);

  function normalizeConversationWithPin(conversation) {
    return {
      ...conversation,
      pinned: false,
      archived: false,
      locked: false,
      lockPin: "",
    };
  }

  useEffect(() => {
    if (session?.access_token) {
      loadConversations();
    } else {
      setConversations([]);
      setSelectedConversation(null);
    }
  }, [session?.access_token, loadConversations]);

  const createConversation = useCallback(async () => {
    if (!session?.access_token) {
      return null;
    }

    try {
      setActionLoading(true);

      const newConversation = await conversationService.createConversation();

      setConversations((current) => {
        const updated = [...current, normalizeConversationWithPin(newConversation)];
        return updated;
      });

      const conversationToSelect = normalizeConversationWithPin(newConversation);
      setSelectedConversation(conversationToSelect);

      return conversationToSelect;
    } catch (err) {
      Alert.alert(
        "Couldn't Create Chat",
        err.message || "Could not create a new conversation. Please try again."
      );
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [session?.access_token]);

  const openConversation = useCallback((conversation) => {
    if (!conversation) return;
    const conversationId = getConversationSessionId(conversation);
    if (conversationId) {
      setSelectedConversation(conversation);
    }
  }, []);

  const renameConversation = useCallback(
    async (conversationOrId, title) => {
      const conversationId = getConversationSessionId(conversationOrId);
      const trimmedTitle = title?.trim();

      if (!conversationId || !trimmedTitle) {
        return false;
      }

      try {
        setActionLoading(true);

        await conversationService.renameConversation(conversationOrId, trimmedTitle);

        setConversations((current) =>
          current.map((conversation) => {
            if (getConversationSessionId(conversation) !== conversationId) {
              return conversation;
            }
            return { ...conversation, title: trimmedTitle };
          })
        );

        setSelectedConversation((current) => {
          if (!current || getConversationSessionId(current) !== conversationId) {
            return current;
          }
          return { ...current, title: trimmedTitle };
        });

        return true;
      } catch (err) {
        Alert.alert(
          "Couldn't Rename Chat",
          err.message || "Could not rename this conversation."
        );
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const deleteConversation = useCallback(
    async (conversationOrId) => {
      const conversationId = getConversationSessionId(conversationOrId);

      if (!conversationId) return false;

      try {
        setActionLoading(true);

        await conversationService.deleteConversation(conversationOrId);

        setConversations((current) =>
          current.filter(
            (conversation) => getConversationSessionId(conversation) !== conversationId
          )
        );

        setSelectedConversation((currentSelected) => {
          if (!currentSelected) return currentSelected;
          if (getConversationSessionId(currentSelected) !== conversationId) {
            return currentSelected;
          }
          return null;
        });

        return true;
      } catch (err) {
        Alert.alert(
          "Couldn't Delete Chat",
          err.message || "Could not delete this conversation."
        );
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const confirmDeleteConversation = useCallback(
    (conversation) => {
      if (!conversation) return;

      const conversationId = getConversationSessionId(conversation);
      const title = conversation.title?.trim() || "this conversation";

      Alert.alert(
        "Delete Conversation?",
        `Are you sure you want to delete "${title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteConversation(conversationId),
          },
        ]
      );
    },
    [deleteConversation]
  );

  return {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    loadingConversations,
    actionLoading,
    error,
    loadConversations,
    createConversation,
    openConversation,
    renameConversation,
    deleteConversation,
    confirmDeleteConversation,
  };
};

export default useConversations;

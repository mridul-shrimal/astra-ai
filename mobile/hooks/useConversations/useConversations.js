import { useCallback, useEffect, useState } from "react";

import { Alert } from "react-native";

import {
  createConversationService,
  getConversationSessionId,
} from "@astra/shared";
import api from "../../api";

const conversationService = createConversationService(api);

const useConversations = (session) => {
  const [conversations, setConversations] =
    useState([]);

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [loadingConversations, setLoadingConversations] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

// =========================================================
// LOAD CONVERSATIONS
// =========================================================

const loadConversations = useCallback(
  async () => {
    if (!session?.access_token) {
      setConversations([]);
      setSelectedConversation(null);
      return;
    }

    try {
      setLoadingConversations(true);

      const list =
        await conversationService.getConversations();

      setConversations((currentConversations) =>
  list.map((conversation) => {
    const conversationId =
      getConversationSessionId(conversation);

    const existingConversation =
      currentConversations.find(
        (item) =>
          getConversationSessionId(item) ===
          conversationId
      );

    return {
      ...conversation,
      pinned: existingConversation?.pinned ?? false,
      archived: existingConversation?.archived ?? false,
      locked: existingConversation?.locked ?? false,
      lockPin: existingConversation?.lockPin ?? "",
    };
  })
);

      setSelectedConversation(
        (currentSelected) => {
          if (!list.length) {
            return null;
          }

          if (!currentSelected) {
            return list[0];
          }

          const currentId = getConversationSessionId(
            currentSelected
          );
          const selectedConversation = list.find(
            (conversation) =>
              getConversationSessionId(conversation) === currentId
          );

          return selectedConversation || list[0];
        }
      );
    } catch (error) {
      console.log(
        "❌ Failed to load conversations:",
        error.response?.status,
        error.response?.data ||
          error.message
      );

      setConversations([]);
      setSelectedConversation(null);
    } finally {
      setLoadingConversations(false);
    }
  },
  [session?.access_token]
);
  // =========================================================
  // CREATE CONVERSATION
  // =========================================================

  const createConversation = useCallback(
    async () => {
      if (!session?.access_token) {
        return;
      }

      try {
        setActionLoading(true);

        const newConversation =
          await conversationService.createConversation();

        setConversations((current) => {
  const updated = [
    ...current,
    {
      ...newConversation,
      pinned: false,
    },
  ];

  return updated.sort(
    (a, b) =>
      Number(b.pinned) -
      Number(a.pinned)
  );
});

        setSelectedConversation({
          ...newConversation,
          pinned: false,
          archived: false,
          locked: false,
          lockPin: "",
        });

        return newConversation;
      } catch (error) {
        console.log(
          "❌ CREATE CONVERSATION ERROR:",
          error.response?.status,
          error.response?.data ||
            error.message
        );

        Alert.alert(
          "Couldn't Create Chat",
          error.response?.data?.message ||
            "Could not create a new conversation. Please try again."
        );

        return null;
      } finally {
        setActionLoading(false);
      }
    },
    [session?.access_token]
  );

  // =========================================================
  // OPEN CONVERSATION
  // =========================================================

  const openConversation = useCallback(
    (conversation) => {
      if (!conversation) {
        return;
      }

      const conversationId = getConversationSessionId(conversation);

      if (!conversationId) {
        return;
      }

      setSelectedConversation(conversation);
    },
    []
  );

  // =========================================================
// RENAME CONVERSATION
// =========================================================

const renameConversation = useCallback(
  async (conversationId, title) => {
    const trimmedTitle = title?.trim();

    if (!conversationId || !trimmedTitle) {
      return false;
    }

    try {
      setActionLoading(true);

      await conversationService.renameConversation(
        conversationId,
        trimmedTitle
      );

      setConversations((current) =>
        current.map((conversation) => {
          if (
            getConversationSessionId(conversation) !==
            conversationId
          ) {
            return conversation;
          }

          return {
            ...conversation,
            title: trimmedTitle,
          };
        })
      );

      setSelectedConversation(
        (currentSelected) => {
          if (!currentSelected) {
            return currentSelected;
          }

          if (
            getConversationSessionId(currentSelected) !==
            conversationId
          ) {
            return currentSelected;
          }

          return {
            ...currentSelected,
            title: trimmedTitle,
          };
        }
      );

      return true;
    } catch (error) {
      console.log(
        "❌ RENAME CONVERSATION ERROR:",
        error.response?.status,
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Couldn't Rename Chat",
        error.response?.data?.message ||
          "Could not rename this conversation."
      );

      return false;
    } finally {
      setActionLoading(false);
    }
  },
  []
);

  // =========================================================
  // DELETE CONVERSATION
  // =========================================================

  const deleteConversation = useCallback(
    async (conversationId) => {
      if (!conversationId) {
        return false;
      }

      try {
        setActionLoading(true);

        await conversationService.deleteConversation(
          conversationId
        );

        const remainingConversations = conversations.filter(
          (conversation) =>
            getConversationSessionId(conversation) !== conversationId
        );

        setConversations(remainingConversations);

        setSelectedConversation((currentSelected) => {
          if (
            getConversationSessionId(currentSelected) !==
            conversationId
          ) {
            return currentSelected;
          }

          return (
            remainingConversations.find(
              (conversation) => !conversation.archived
            ) ||
            remainingConversations[0] ||
            null
          );
        });

        return true;
      } catch (error) {
        console.log(
          "❌ DELETE CONVERSATION ERROR:",
          error.response?.status,
          error.response?.data ||
            error.message
        );

        Alert.alert(
          "Couldn't Delete Chat",
          error.response?.data?.message ||
            "Could not delete this conversation."
        );

        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [conversations]
  );

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const confirmDeleteConversation =
    useCallback(
      (conversation) => {
        if (!conversation) {
          return;
        }

      const conversationId = getConversationSessionId(
        conversation
      );

        const title =
          conversation.title?.trim() ||
          "this conversation";

        Alert.alert(
          "Delete Conversation?",
          `Are you sure you want to delete "${title}"?`,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () =>
                deleteConversation(
                  conversationId
                ),
            },
          ]
        );
      },
      [deleteConversation]
    );

  // =========================================================
  // SESSION CHANGE
  // =========================================================

  useEffect(() => {
    if (session?.access_token) {
      loadConversations();
    } else {
      setConversations([]);
      setSelectedConversation(null);
    }
  }, [
    session?.access_token,
    loadConversations,
  ]);

return {
  conversations,
  setConversations,

  selectedConversation,
  setSelectedConversation,

  loadingConversations,
  actionLoading,
  setActionLoading,

  loadConversations,
  createConversation,
  openConversation,

  renameConversation,
  deleteConversation,
  confirmDeleteConversation,
};
};

export default useConversations;

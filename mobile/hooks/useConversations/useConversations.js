import { useCallback, useEffect, useState } from "react";

import { Alert } from "react-native";

import api from "../../api";

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

      const response =
        await api.get("/conversations");

      console.log(
        "CONVERSATIONS RESPONSE:",
        response.data
      );

      const list =
        response.data?.conversations || [];

      setConversations((currentConversations) =>
  list.map((conversation) => {
    const conversationId =
      conversation.id ||
      conversation.session_id;

    const existingConversation =
      currentConversations.find(
        (item) =>
          (item.id || item.session_id) ===
          conversationId
      );

    return {
      ...conversation,
      pinned:
        existingConversation?.pinned ??
        false,
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

          const currentId =
            currentSelected.id ||
            currentSelected.session_id;

          const stillExists =
            list.some(
              (conversation) =>
                (conversation.id ||
                  conversation.session_id) ===
                currentId
            );

          return stillExists
            ? currentSelected
            : list[0];
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

        const response =
          await api.post("/conversations");

        const newConversation =
          response.data?.conversation;

        if (!newConversation) {
          throw new Error(
            "Conversation was not returned by the server."
          );
        }

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

        setSelectedConversation(
          newConversation
        );

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

      const response = await api.put(
        `/conversations/${conversationId}`,
        {
          title: trimmedTitle,
        }
      );

      const updatedConversation =
        response.data?.conversation;

      setConversations((current) =>
        current.map((conversation) => {
          if (
            conversation.session_id !==
            conversationId
          ) {
            return conversation;
          }

          return (
            updatedConversation || {
              ...conversation,
              title: trimmedTitle,
            }
          );
        })
      );

      setSelectedConversation(
        (currentSelected) => {
          if (!currentSelected) {
            return currentSelected;
          }

          if (
            currentSelected.session_id !==
            conversationId
          ) {
            return currentSelected;
          }

          return (
            updatedConversation || {
              ...currentSelected,
              title: trimmedTitle,
            }
          );
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

        await api.delete(
          `/conversations/${conversationId}`
        );

        setConversations((current) =>
  current.filter(
    (conversation) =>
      conversation.session_id !== conversationId
  )
);

        setSelectedConversation(
          (currentSelected) => {
            if (!currentSelected) {
              return null;
            }

            const id =
              currentSelected.id ||
              currentSelected.session_id;

            return id === conversationId
              ? null
              : currentSelected;
          }
        );

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
    []
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

      const conversationId =
  conversation.session_id;

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

    loadConversations,

    createConversation,
    openConversation,

    renameConversation,
    deleteConversation,
    confirmDeleteConversation,
  };
};

export default useConversations;
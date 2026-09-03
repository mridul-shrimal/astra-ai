import { createConversationApi } from "../api/conversations.js";

export function getConversationSessionId(conversation) {
  if (typeof conversation === "string") {
    return conversation;
  }

  return (
    conversation?.session_id ||
    conversation?.sessionId ||
    conversation?.id ||
    null
  );
}

export function normalizeConversationTitle(title) {
  const normalizedTitle = title?.trim();

  return normalizedTitle || null;
}

export function normalizeConversation(conversation) {
  if (!conversation) {
    return null;
  }

  const sessionId = getConversationSessionId(conversation);

  if (!sessionId) {
    return { ...conversation };
  }

  const backendId =
    conversation.backendId ??
    (conversation.session_id ? conversation.id : undefined);

  return {
    ...conversation,
    ...(backendId !== undefined ? { backendId } : {}),
    id: sessionId,
    sessionId,
    session_id: sessionId,
  };
}

function getSuccessfulData(response, operation) {
  const data = response?.data;

  if (!data?.success) {
    throw new Error(
      data?.message || `Failed to ${operation} conversation.`
    );
  }

  return data;
}

export function createConversationService(api) {
  const conversationApi = createConversationApi(api);

  return {
    async getConversations() {
      const data = getSuccessfulData(
        await conversationApi.getConversations(),
        "load"
      );

      return (data.conversations || []).map(normalizeConversation);
    },

    async createConversation() {
      const data = getSuccessfulData(
        await conversationApi.createConversation(),
        "create"
      );
      const conversation = normalizeConversation(data.conversation);

      if (!conversation) {
        throw new Error("Conversation was not returned by the server.");
      }

      return conversation;
    },

    async getConversationMessages(conversation) {
      const sessionId = getConversationSessionId(conversation);

      if (!sessionId) {
        throw new Error("A conversation session ID is required.");
      }

      const data = getSuccessfulData(
        await conversationApi.getConversationMessages(sessionId),
        "load messages for"
      );

      return data.messages || [];
    },

    async renameConversation(conversation, title) {
      const sessionId = getConversationSessionId(conversation);
      const normalizedTitle = normalizeConversationTitle(title);

      if (!sessionId || !normalizedTitle) {
        throw new Error(
          "A conversation session ID and title are required."
        );
      }

      const data = getSuccessfulData(
        await conversationApi.updateConversation(sessionId, {
          title: normalizedTitle,
        }),
        "rename"
      );

      return normalizeConversation(
        data.conversation || {
          session_id: sessionId,
          title: normalizedTitle,
        }
      );
    },

    async deleteConversation(conversation) {
      const sessionId = getConversationSessionId(conversation);

      if (!sessionId) {
        throw new Error("A conversation session ID is required.");
      }

      getSuccessfulData(
        await conversationApi.deleteConversation(sessionId),
        "delete"
      );

      return sessionId;
    },

    async duplicateConversation(conversation) {
      const sessionId = getConversationSessionId(conversation);

      if (!sessionId) {
        throw new Error("A conversation session ID is required.");
      }

      const data = getSuccessfulData(
        await conversationApi.duplicateConversation(sessionId),
        "duplicate"
      );
      const duplicatedConversation = normalizeConversation(
        data.conversation
      );

      if (!duplicatedConversation) {
        throw new Error(
          "Duplicated conversation was not returned by the server."
        );
      }

      return duplicatedConversation;
    },
  };
}

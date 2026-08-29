export function createConversationApi(api) {
  return {
    getConversations: () =>
      api.get("/conversations"),

    createConversation: () =>
      api.post("/conversations"),

    updateConversation: (conversationId, data) =>
      api.put(`/conversations/${conversationId}`, data),

    deleteConversation: (conversationId) =>
      api.delete(`/conversations/${conversationId}`),

    duplicateConversation: (conversationId) =>
      api.post(`/conversations/${conversationId}/duplicate`),
  };
}

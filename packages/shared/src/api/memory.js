export function createMemoryApi(api) {
  return {
    getMemories: () => api.get("/memory"),

    getMemoryCount: () => api.get("/memory/count/all"),

    updateMemory: (memoryId, data) =>
      api.put(`/memory/item/${memoryId}`, data),

    deleteMemory: (memoryId) =>
      api.delete(`/memory/item/${memoryId}`),

    clearMemories: () => api.delete("/memory"),
  };
}

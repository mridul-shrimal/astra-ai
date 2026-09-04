import { createMemoryApi } from "../api/memory.js";

function getSuccessfulData(response, operation) {
  const data = response?.data;

  if (!data?.success) {
    throw new Error(
      data?.message || `Failed to ${operation} memories.`
    );
  }

  return data;
}

function normalizeMemory(memory) {
  if (!memory || typeof memory !== "object") {
    return memory;
  }

  return {
    ...memory,
    user_message: memory.user_message ?? "",
    ai_response: memory.ai_response ?? "",
  };
}

function getMemoryId(memory) {
  const memoryId =
    typeof memory === "object" ? memory?.id : memory;

  if (memoryId === null || memoryId === undefined || memoryId === "") {
    throw new Error("A memory ID is required.");
  }

  return memoryId;
}

function createMemoryUpdatePayload(memory) {
  if (!memory || typeof memory !== "object") {
    throw new Error("Memory data is required.");
  }

  return {
    user_message: memory.user_message,
    ai_response: memory.ai_response,
  };
}

export function createMemoryService(api) {
  const memoryApi = createMemoryApi(api);

  return {
    async getMemories() {
      const data = getSuccessfulData(
        await memoryApi.getMemories(),
        "load"
      );

      return (data.memories || []).map(normalizeMemory);
    },

    async getMemoryCount() {
      const data = getSuccessfulData(
        await memoryApi.getMemoryCount(),
        "load the count of"
      );

      return data.count;
    },

    async updateMemory(memory) {
      const memoryId = getMemoryId(memory);
      const payload = createMemoryUpdatePayload(memory);

      getSuccessfulData(
        await memoryApi.updateMemory(memoryId, payload),
        "update"
      );
    },

    async deleteMemory(memory) {
      const memoryId = getMemoryId(memory);

      getSuccessfulData(
        await memoryApi.deleteMemory(memoryId),
        "delete"
      );

      return memoryId;
    },

    async clearMemories() {
      getSuccessfulData(
        await memoryApi.clearMemories(),
        "clear"
      );
    },
  };
}

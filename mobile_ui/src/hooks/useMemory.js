import { useCallback, useEffect, useState } from "react";

import { Alert } from "react-native";

import { createMemoryService } from "@astra/shared";
import api from "../services/api";

const memoryService = createMemoryService(api);

const useMemory = (session) => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(null);

  const loadMemories = useCallback(async () => {
    if (!session?.access_token) {
      setMemories([]);
      setCount(0);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const loadedMemories = await memoryService.getMemories();
      setMemories(loadedMemories);

      try {
        const memoryCount = await memoryService.getMemoryCount();
        setCount(memoryCount);
      } catch (countError) {
        setCount(loadedMemories.length);
      }
    } catch (err) {
      setError(err.message || "Failed to load memories");
      setMemories([]);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (session?.access_token) {
      loadMemories();
    } else {
      setMemories([]);
      setCount(0);
    }
  }, [session?.access_token, loadMemories]);

  const deleteMemory = useCallback(
    async (memory) => {
      const memoryId = typeof memory === "object" ? memory?.id : memory;

      if (!memoryId) {
        return false;
      }

      try {
        await memoryService.deleteMemory(memory);
        setMemories((current) =>
          current.filter((item) => item.id !== memoryId)
        );
        setCount((prev) => (prev !== null ? prev - 1 : prev));
        return true;
      } catch (err) {
        Alert.alert(
          "Delete Failed",
          err.message || "Could not delete this memory."
        );
        return false;
      }
    },
    []
  );

  const confirmDelete = useCallback(
    (memory) => {
      if (!memory) return;

      const memoryId = typeof memory === "object" ? memory?.id : memory;
      const preview =
        typeof memory === "object"
          ? (memory?.user_message || memory?.ai_response || "").slice(0, 50)
          : "";

      Alert.alert(
        "Delete Memory?",
        preview
          ? `Are you sure you want to delete this memory?\n\n"${preview}"`
          : "Are you sure you want to delete this memory?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteMemory(memoryId),
          },
        ]
      );
    },
    [deleteMemory]
  );

  const clearAllMemories = useCallback(async () => {
    try {
      await memoryService.clearMemories();
      setMemories([]);
      setCount(0);
      return true;
    } catch (err) {
      Alert.alert(
        "Clear Failed",
        err.message || "Could not clear all memories."
      );
      return false;
    }
  }, []);

  return {
    memories,
    loading,
    error,
    count,
    loadMemories,
    deleteMemory: confirmDelete,
    clearAllMemories,
  };
};

export default useMemory;

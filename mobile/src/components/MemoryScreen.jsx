import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createMemoryService } from "@astra/shared";
import api from "../../api";

const memoryService = createMemoryService(api);

const categories = [
  "All",
  "Personal",
  "Programming",
  "Education",
  "Work",
  "Preference",
  "Goal",
];

function getCategory(text = "") {
  const value = text.toLowerCase();

  if (/react|javascript|python|java|code|program/.test(value)) {
    return "Programming";
  }

  if (/college|study|school|exam/.test(value)) {
    return "Education";
  }

  if (/project|office|meeting|client/.test(value)) {
    return "Work";
  }

  if (/like|prefer|favorite/.test(value)) {
    return "Preference";
  }

  if (/goal|plan|dream/.test(value)) {
    return "Goal";
  }

  return "Personal";
}

function getDateLabel(value) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString();
}

export default function MemoryScreen({ onBack }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editing, setEditing] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setMemories(await memoryService.getMemories());
    } catch {
      Alert.alert("Couldn't load memories", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      memories.filter((memory) => {
        const needle = search.trim().toLowerCase();

        return (
          (category === "All" ||
            getCategory(memory.user_message) === category) &&
          (!needle ||
            `${memory.user_message} ${memory.ai_response}`
              .toLowerCase()
              .includes(needle))
        );
      }),
    [memories, search, category]
  );

  const startEdit = (memory) => {
    setEditing(memory);
    setUserMessage(memory.user_message);
    setAiResponse(memory.ai_response);
  };

  const save = async () => {
    try {
      await memoryService.updateMemory({
        ...editing,
        user_message: userMessage,
        ai_response: aiResponse,
      });

      setEditing(null);
      await load();
    } catch {
      Alert.alert("Couldn't update memory", "Please try again.");
    }
  };

  const remove = (memory) =>
    Alert.alert(
      "Delete memory?",
      "This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await memoryService.deleteMemory(memory);
              await load();
            } catch {
              Alert.alert(
                "Couldn't delete memory",
                "Please try again."
              );
            }
          },
        },
      ]
    );

  const clear = () =>
    Alert.alert(
      "Clear all memories?",
      "This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await memoryService.clearMemories();
              setMemories([]);
            } catch {
              Alert.alert(
                "Couldn't clear memories",
                "Please try again."
              );
            }
          },
        },
      ]
    );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Memory</Text>

        <TouchableOpacity onPress={load}>
          <Text style={styles.back}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search memories"
          placeholderTextColor="#64748b"
          style={styles.input}
        />

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.pill,
                category === item && styles.pillActive,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text style={styles.pillText}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.clear} onPress={clear}>
          <Text style={styles.buttonText}>Clear all</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            color="#22d3ee"
            style={{ marginTop: 30 }}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
              <Text style={styles.empty}>No memories found.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.date}>
                  {getDateLabel(item.created_at)} ·{" "}
                  {getCategory(item.user_message)}
                </Text>

                <Text style={styles.user}>You</Text>

                <Text style={styles.text}>
                  {item.user_message}
                </Text>

                <Text style={styles.ai}>Astra</Text>

                <Text style={styles.text}>
                  {item.ai_response}
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => startEdit(item)}
                  >
                    <Text style={styles.action}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => remove(item)}
                  >
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>

      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Edit memory</Text>

            <TextInput
              value={userMessage}
              onChangeText={setUserMessage}
              multiline
              style={styles.input}
            />

            <TextInput
              value={aiResponse}
              onChangeText={setAiResponse}
              multiline
              style={[styles.input, { minHeight: 100 }]}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => setEditing(null)}
              >
                <Text style={styles.action}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={save}>
                <Text style={styles.action}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = {
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },

  header: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },

  back: {
    color: "#22d3ee",
    fontSize: 15,
  },

  title: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    padding: 14,
  },

  input: {
    color: "#f8fafc",
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 10,
    padding: 11,
    marginVertical: 8,
    minHeight: 45,
  },

  pill: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    marginRight: 7,
  },

  pillActive: {
    backgroundColor: "#0e7490",
  },

  pillText: {
    color: "#e2e8f0",
    fontSize: 12,
  },

  clear: {
    alignSelf: "flex-end",
    marginVertical: 10,
    padding: 8,
    backgroundColor: "#dc2626",
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  date: {
    color: "#67e8f9",
    fontSize: 12,
  },

  user: {
    color: "#22d3ee",
    fontWeight: "700",
    marginTop: 9,
  },

  ai: {
    color: "#c084fc",
    fontWeight: "700",
    marginTop: 11,
  },

  text: {
    color: "#e2e8f0",
    lineHeight: 20,
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    marginTop: 12,
  },

  action: {
    color: "#22d3ee",
    fontWeight: "700",
  },

  delete: {
    color: "#f87171",
    fontWeight: "700",
  },

  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 50,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,.65)",
  },

  modal: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
  },
};


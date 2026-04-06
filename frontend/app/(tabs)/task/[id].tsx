import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  const API_URL = "http://10.10.150.253:3000/tasks";

  const loadTask = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();

      setTitle(data.data.title);
      setCompleted(data.data.completed);
    } catch (error) {
      console.log("Error cargando tarea:", error);
    }
  };

  useEffect(() => {
    if (id) loadTask();
  }, [id]);

  const updateTask = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          completed
        })
      });

      if (res.ok) {
        router.back();
      }
    } catch (error) {
      console.log("Error actualizando tarea:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#eef2f7",
        padding: 20,
        justifyContent: "center"
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 20
        }}
      >
        Editar tarea
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 14,
          marginBottom: 20
        }}
      />

      <TouchableOpacity
        onPress={() => setCompleted(!completed)}
        style={{
          backgroundColor: completed ? "#16a34a" : "#f59e0b",
          padding: 16,
          borderRadius: 14,
          marginBottom: 20
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {completed
            ? "Marcar como pendiente"
            : "Marcar como completada"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={updateTask}
        style={{
          backgroundColor: "#2563eb",
          padding: 16,
          borderRadius: 14
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Guardar cambios
        </Text>
      </TouchableOpacity>
    </View>
  );
}
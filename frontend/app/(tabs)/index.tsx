import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://192.168.0.105:3000/tasks";

  // 🔥 CARGAR TAREAS
  const loadTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      console.log("TASKS:", data);

      setTasks(data.data || []);
    } catch (error) {
      console.log("Error cargando tareas:", error);
    }
  };

  // 🔥 CARGA INICIAL
  useEffect(() => {
    loadTasks();
  }, []);

  // 🔥 AGREGAR TAREA
  const addTasks = async () => {
    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim(),
          description: "",
          completed: false
        })
      });

      const result = await response.json();
      console.log("POST RESULT:", result);

      if (response.ok) {
        setTitle("");
        await loadTasks();
      }
    } catch (error) {
      console.log("Error agregando tarea:", error);
    }
  };

  // 🔥 ELIMINAR TAREA
  const deleteTasks = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      await loadTasks();
    } catch (error) {
      console.log("Error eliminando tarea:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#f5f7fa",
        padding: 20,
        paddingTop: 60
      }}
    >
      <Text
        style={{
          fontSize: 36,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 25,
          color: "#1e454c"
        }}
      >
        ToDo App
      </Text>

      <TextInput
        placeholder="¿Qué hay para hoy?"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "white",
          padding: 14,
          borderRadius: 15,
          marginBottom: 15,
          fontSize: 16
        }}
      />

      <TouchableOpacity
        onPress={addTasks}
        style={{
          backgroundColor: "#348CCB",
          padding: 15,
          borderRadius: 15,
          alignItems: "center",
          marginBottom: 25
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16
          }}
        >
          Agregar tarea
        </Text>
      </TouchableOpacity>

      {tasks.map((task) => (
        <View
          key={task.id}
          style={{
            backgroundColor: "white",
            padding: 18,
            borderRadius: 15,
            marginBottom: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3
          }}
        >
          <Text
            style={{
              color: "#1e454c",
              flex: 1,
              fontSize: 16
            }}
          >
            {task.completed ? "completada" : "pendiente"}
            {task.title}
          </Text>

          <TouchableOpacity
            onPress={() => deleteTasks(task.id)}
            style={{
              backgroundColor: "#ef4444",
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 10,
              marginLeft: 10
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              🗑 Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
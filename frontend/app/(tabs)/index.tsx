import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
  const router = useRouter();


  
  const API_URL = "http://10.10.150.253:3000/tasks";

  const loadTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data.data || []);
    } catch (error) {
      console.log("Error cargando tareas:", error);
    }
  };

  // Para recargar la lista de tareas cada vez que se regrese a esta pantalla
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

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
          completed: false
        })
      });

      if (response.ok) {
        setTitle("");
        await loadTasks();
      }
    } catch (error) {
      console.log("Error agregando tarea:", error);
    }
  };

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

  const toggleTaskStatus = async (task: Task) => {
    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed
        })
      });

      await loadTasks();
    } catch (error) {
      console.log("Error actualizando estado:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#eef2f7",
        padding: 20,
        paddingTop: 60
      }}
    >
      <Text
        style={{
          fontSize: 34,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 25,
          color: "#1f2937"
        }}
      >
        ToDo App
      </Text>

      <TextInput
        placeholder="Escribe una nueva tarea..."
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#dbe2ea",
          backgroundColor: "white",
          padding: 16,
          borderRadius: 14,
          marginBottom: 15
        }}
      />

      <TouchableOpacity
        onPress={addTasks}
        style={{
          backgroundColor: "#2563eb",
          padding: 16,
          borderRadius: 14,
          alignItems: "center",
          marginBottom: 25
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>
          Agregar tarea
        </Text>
      </TouchableOpacity>

      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          onPress={() =>
            router.push({
              pathname: "../task/[id]",
              params: { id: String(task.id) }
            })
          }
          style={{
            backgroundColor: "white",
            padding: 18,
            borderRadius: 16,
            marginBottom: 14
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: task.completed ? "#9ca3af" : "#111827",
              textDecorationLine: task.completed
                ? "line-through"
                : "none"
            }}
          >
            {task.title}
          </Text>

          <Text
            style={{
              color: task.completed ? "#16a34a" : "#ff5500",
              marginTop: 5
            }}
          >
            {task.completed ? "Completada" : "Pendiente"}
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 15
            }}
          >
            <TouchableOpacity
              onPress={() => toggleTaskStatus(task)}
              style={{
                backgroundColor: "#059669",
                padding: 10,
                borderRadius: 10
              }}
            >
              <Text style={{ color: "white" }}>
                Cambiar estado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteTasks(task.id)}
              style={{
                backgroundColor: "#dc2626",
                padding: 10,
                borderRadius: 10
              }}
            >
              <Text style={{ color: "white" }}>
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
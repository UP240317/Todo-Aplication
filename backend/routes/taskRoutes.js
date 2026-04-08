const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
} = require("../middlewares/validateTask");

// Obtener todas las tareas
router.get("/", taskController.getAllTasks);

// Obtener tarea por ID
router.get("/:id", validateTaskId, taskController.getTaskById);

// Crear nueva tarea
router.post("/", validateCreateTask, taskController.createTask);

// Actualizar tarea completa
router.put(
  "/:id",
  validateTaskId,
  validateUpdateTask,
  taskController.updateTask
);

// Eliminar tarea
router.delete("/:id", validateTaskId, taskController.deleteTask);

module.exports = router;
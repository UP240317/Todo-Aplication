const { pool } = require("../config/db");

const serializeTask = (task) => ({
  ...task,
  completed: Boolean(task.completed),
});

const getAllTasks = async () => {
  console.log("Consultando todas las tareas...");
  const [rows] = await pool.query(
    "SELECT id, title, description, completed, created_at FROM tasks ORDER BY id ASC"
  );

  console.log("Tareas encontradas:", rows);
  return rows.map(serializeTask);
};

const getTaskById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, title, description, completed, created_at FROM tasks WHERE id = ?",
    [id]
  );

  return rows[0] ? serializeTask(rows[0]) : null;
};

const createTask = async ({ title, description = null, completed = false }) => {
  const [result] = await pool.query(
    "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)",
    [title, description, completed ? 1 : 0]
  );

  return getTaskById(result.insertId);
};

const updateTask = async (id, { title, description = null, completed }) => {
  const [result] = await pool.query(
    "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?",
    [title, description, completed ? 1 : 0, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getTaskById(id);
};

const deleteTask = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM tasks WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
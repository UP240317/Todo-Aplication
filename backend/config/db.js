const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "todo_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado a MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Error MySQL:", error.message);
  }
};

module.exports = {
  pool,
  testConnection
};
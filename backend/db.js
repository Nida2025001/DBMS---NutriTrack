const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "nutritrack",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promiseDb = db.promise();

promiseDb
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected successfully.");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
  });

module.exports = promiseDb;

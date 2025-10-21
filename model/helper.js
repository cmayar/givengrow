import "dotenv/config";
import mysql from "mysql2/promise"; // Use promise-based API

async function db(query, params = []) {
  const DB_HOST = process.env.DB_HOST || "127.0.0.1";
  const DB_USER = process.env.DB_USER || "root";
  const DB_PASS = process.env.DB_PASS || "";
  const DB_NAME = process.env.DB_NAME || "share";

  let connection;

  try {
    // Establish a database connection
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      multipleStatements: false,
    });

    // Execute query
    const [rows, fields] = await connection.execute(query, params);

    // For INSERT queries, return insertId and affectedRows
    // For SELECT queries, return the rows
    return {
      data: rows,
      insertId: rows.insertId,
      affectedRows: rows.affectedRows
    };
  } catch (error) {
    console.error("Database error:", error);
    throw error; // This will be caught in trips.js and returned as a 500 error
  } finally {
    if (connection) await connection.end();
  }
}

export default db;

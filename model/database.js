import "dotenv/config";
import mysql from "mysql2";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const con = mysql.createConnection({
  host: DB_HOST || "127.0.0.1",
  user: DB_USER || "root",
  password: DB_PASS,
  database: DB_NAME || "users",
  multipleStatements: true,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  //NOTE: This is causing a probem
  //   let sql = fs.readFileSync(__dirname + "/init_db.sql").toString();
  //   con.query(sql, function (err) {
  //     if (err) throw err;
  //     con.end();
  //   });

  //   // con.end();
  // });

  // Check if any of your tables already exist before initializing
  con.query(
    "SHOW TABLES LIKE 'users'; SHOW TABLES LIKE 'items'; SHOW TABLES LIKE 'interactions';",
    function (err, results) {
      if (err) throw err;

      // If any of the three tables exists, assume database is initialized
      if (
        results[0].length > 0 ||
        results[1].length > 0 ||
        results[2].length > 0
      ) {
        console.log("Database already initialized, skipping...");
        con.end();
      } else {
        console.log("Initializing database...");
        let sql = fs.readFileSync(__dirname + "/init_db.sql").toString();
        con.query(sql, function (err) {
          if (err) throw err;
          console.log("Database initialized successfully!");
          con.end();
        });
      }
    }
  );
});

// Default export the connection
export default con;

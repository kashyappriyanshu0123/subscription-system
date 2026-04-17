import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "kashyap1234", 
  database: "subscription_db",
});

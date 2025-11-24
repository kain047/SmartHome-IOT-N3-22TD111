const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

const connect = async () => {
  try {
    pool = await sql.connect(config);
    console.log("SQL Connected using sa authentication!");
  } catch (err) {
    console.error("SQL Connection Error:", err);
  }
};

const getPool = () => {
  if (!pool) throw new Error("SQL pool not initialized");
  return pool;
};

module.exports = { connect, getPool, sql };

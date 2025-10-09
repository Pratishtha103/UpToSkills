const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER || process.env.ADMIN_DB_USER,
  password: process.env.DB_PASSWORD || process.env.ADMIN_DB_PASSWORD,
  // Ensure DB_PORT is an integer if required by pg
  port: parseInt(process.env.DB_PORT, 10) || 5432, 
  ssl: process.env.DB_SSLMODE === 'require' ? { 
    // Recommended for self-signed certificates or services like Neon
    rejectUnauthorized: false 
  } : false,
});

// REMOVE THE pool.connect() BLOCK ENTIRELY. 
// The pool will connect lazily when a query is executed.

// Optional: A safe, async connection test function if you want to run it on server startup:
/*
async function testDbConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database successfully!');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);
  }
}
testDbConnection(); // You could call this once in server.js instead.
*/

module.exports = pool;
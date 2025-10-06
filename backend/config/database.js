const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER || process.env.ADMIN_DB_USER,
  password: process.env.DB_PASSWORD || process.env.ADMIN_DB_PASSWORD,
  ssl: process.env.DB_SSLMODE === 'require' ? { rejectUnauthorized: false } : false,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database successfully!');
    release();
  }
});

module.exports = pool;

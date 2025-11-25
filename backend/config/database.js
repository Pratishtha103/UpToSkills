const { Pool } = require('pg');
require('dotenv').config();

const dbPort = parseInt(process.env.DB_PORT, 10) || 5432;
const useSsl = String(process.env.DB_SSLMODE || '').toLowerCase() === 'require';

const sslConfig = useSsl
  ? {
      // For managed Postgres providers (Neon, Heroku etc.) TLS is required.
      // We disable strict certificate verification here to support providers
      // that use certificates not present in the host's trust store.
      rejectUnauthorized: false,
      // Require modern TLS
      minVersion: 'TLSv1.2',
    }
  : false;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: dbPort,
  database: process.env.DB_NAME,
  user: process.env.DB_USER || process.env.ADMIN_DB_USER,
  password: String(process.env.DB_PASSWORD || process.env.ADMIN_DB_PASSWORD || ''),
  ssl: sslConfig,
  // increase timeouts to be a bit more tolerant of transient network issues
  connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT_MS, 10) || 20000,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS, 10) || 30000,
  max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
});

// REMOVE THE pool.connect() BLOCK ENTIRELY. 
// The pool will connect lazily when a query is executed.

// Optional: A safe, async connection test function if you want to run it on server startup:
async function connectWithRetry({ retries = 5, baseDelay = 1000 } = {}) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const client = await pool.connect();
      console.log('Connected to PostgreSQL database successfully!');
      client.release();
      return true;
    } catch (err) {
      attempt += 1;
      const wait = baseDelay * Math.pow(2, attempt - 1);
      console.error(`Database connection attempt ${attempt} failed:`, err && err.message ? err.message : err);
      if (attempt >= retries) {
        console.error('Exceeded maximum DB connection retries. Will keep the pool lazy and continue — subsequent queries may retry.');
        return false;
      }
      console.log(`Retrying DB connection in ${wait}ms...`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, wait));
    }
  }
  return false;
}

// Try to establish a connection at startup, but tolerate failures and let the pool retry lazily later.
connectWithRetry({ retries: parseInt(process.env.DB_CONNECT_RETRIES || '6', 10), baseDelay: parseInt(process.env.DB_CONNECT_BASE_DELAY || '1000', 10) })
  .then((ok) => {
    if (!ok) {
      console.warn('Initial DB connection attempts failed — server will continue and rely on lazy connections.');
    }
  })
  .catch((err) => console.error('Unexpected error during DB connectWithRetry:', err));

// Log unexpected errors emitted by idle clients in the pool
pool.on && pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});


module.exports = pool;
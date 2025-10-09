import pool from "./db.js";

(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(" Database connected successfully:", result.rows[0]);
  } catch (err) {
    console.error(" Database connection failed:", err);
  } finally {
    await pool.end();
  }
})();

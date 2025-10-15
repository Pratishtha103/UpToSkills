const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// ✅ Fetch all testimonials
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM testimonials ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// ✅ Add a new testimonial
router.post("/", async (req, res) => {
  try {
    const { name, role, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required" });
    }

    const result = await pool.query(
      "INSERT INTO testimonials (name, role, message) VALUES ($1, $2, $3) RETURNING *",
      [name, role, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding testimonial:", err);
    res.status(500).json({ error: "Failed to add testimonial" });
  }
});

module.exports = router;

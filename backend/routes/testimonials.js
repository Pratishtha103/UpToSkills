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

// ✅ Delete a testimonial (for admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "DELETE FROM testimonials WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    res.json({ success: true, message: "Testimonial deleted successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    res.status(500).json({ success: false, error: "Failed to delete testimonial" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// ✅ GET all interviews (sorted by date & time)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM interviews ORDER BY date, time ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ error: "Server error while fetching interviews" });
  }
});

// ✅ POST - Add new interview
router.post("/", async (req, res) => {
  try {
    const { candidateName, position, date, time } = req.body;

    if (!candidateName || !position || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO interviews (candidate_name, role, date, time, status)
       VALUES ($1, $2, $3, $4, 'Scheduled')
       RETURNING *`,
      [candidateName, position, date, time]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding interview:", error);
    res.status(500).json({ error: "Server error while adding interview" });
  }
});

// ✅ PUT - Update (Reschedule) interview
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: "Date and time are required" });
    }

    const result = await pool.query(
      "UPDATE interviews SET date = $1, time = $2 WHERE id = $3 RETURNING *",
      [date, time, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ error: "Server error while updating interview" });
  }
});

// ✅ DELETE - Remove interview
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM interviews WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ error: "Server error while deleting interview" });
  }
});

module.exports = router;

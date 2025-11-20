const router = require("express").Router();
const pool = require("../db");

// Get enrolled program count for a student
router.get("/count/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      "SELECT COUNT(*) AS count FROM enrollments WHERE student_id = $1",
      [studentId]
    );

    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

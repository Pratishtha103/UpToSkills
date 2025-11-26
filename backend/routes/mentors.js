// routes/mentors.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const verifyToken = require("../middleware/auth"); // make sure this exists

// -----------------------------------------------
// GET mentors count
// -----------------------------------------------
router.get("/count", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*)::int AS total_mentors FROM mentors"
    );
    res.json({ totalMentors: result.rows[0].total_mentors });
  } catch (err) {
    console.error("❌ Error fetching mentors count:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// -----------------------------------------------
// GET all mentors
// -----------------------------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        md.id,
        md.full_name,
        md.contact_number AS phone,
        md.linkedin_url,
        md.github_url,
        md.about_me,
        md.expertise_domains,
        md.others_domain,
        m.email
      FROM mentor_details md
      LEFT JOIN mentors m ON md.mentor_id = m.id
      ORDER BY md.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching mentors list:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// -----------------------------------------------
// DELETE mentor
// -----------------------------------------------
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM mentor_details WHERE id = $1", [id]);
    res.json({ message: "Mentor deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting mentor:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

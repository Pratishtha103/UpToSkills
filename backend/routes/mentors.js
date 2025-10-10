// routes/mentors.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// ✅ GET all mentors (with email joined from mentors table)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        md.id,
        md.full_name,
        md.username,
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

// ✅ DELETE mentor by id
router.delete("/:id", async (req, res) => {
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

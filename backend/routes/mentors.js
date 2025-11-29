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
    const totalRes = await pool.query(
      "SELECT COUNT(*)::int AS total_mentors FROM mentors"
    );
    const profilesRes = await pool.query(
      "SELECT COUNT(*)::int AS total_profiles FROM mentor_details"
    );

    res.json({
      totalMentors: totalRes.rows[0].total_mentors,
      totalProfiles: profilesRes.rows[0].total_profiles,
    });
  } catch (err) {
    console.error("❌ Error fetching mentors count:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// -----------------------------------------------
// GET all mentors (returns all registered mentors and includes optional profile fields)
// -----------------------------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    // Return mentors with legacy field names to keep frontend compatibility.
    // Prefer profile fields when present (mentor_details) but always include `id` and `full_name`.
    const result = await pool.query(`
      SELECT
        m.id AS id,
        COALESCE(md.full_name, m.full_name) AS full_name,
        m.email,
        COALESCE(md.contact_number, m.phone) AS phone,
        COALESCE(md.linkedin_url, '') AS linkedin_url,
        COALESCE(md.github_url, '') AS github_url,
        COALESCE(md.about_me, '') AS about_me,
        COALESCE(md.expertise_domains, ARRAY[]::text[]) AS expertise_domains,
        COALESCE(md.others_domain, '') AS others_domain,
        md.id AS profile_id
      FROM mentors m
      LEFT JOIN mentor_details md ON md.mentor_id = m.id
      ORDER BY m.id DESC
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

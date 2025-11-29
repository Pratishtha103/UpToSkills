// routes/mentors.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const verifyToken = require("../middleware/auth");

/*==========================================================
 🟢 TOTAL MENTORS COUNT  (NO TOKEN REQUIRED)
==========================================================*/
router.get("/count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*)::int AS total_mentors FROM mentors"
    );

    res.json({
      success: true,
      totalMentors: result.rows[0].total_mentors,
    });
  } catch (err) {
    console.error("❌ Error fetching mentors count:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/*==========================================================
 🧑‍🏫 GET ALL MENTORS  (TOKEN REQUIRED)
==========================================================*/
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

    res.json({
      success: true,
      mentors: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching mentors list:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/*==========================================================
 ❌ DELETE MENTOR (TOKEN REQUIRED)
==========================================================*/
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Delete details first
    await client.query("DELETE FROM mentor_details WHERE mentor_id = $1", [id]);

    // 2️⃣ Delete mentor record
    const result = await client.query(
      "DELETE FROM mentors WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Mentor deleted successfully",
      deleted: result.rows[0],
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error deleting mentor:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  } finally {
    client.release();
  }
});

module.exports = router;

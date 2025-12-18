// routes/mentors.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const verifyToken = require("../middleware/auth");
const { notifyAdmins } = require("../utils/notificationService");

/*==========================================================
 🟢 TOTAL MENTORS COUNT  (NO TOKEN REQUIRED)
==========================================================*/
router.get("/count", async (req, res) => {
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
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/*==========================================================
 🧑‍🏫 GET ALL MENTORS  (TOKEN REQUIRED)
==========================================================*/
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
    m.username AS username,                 
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

    // 1.5️⃣ Nullify or detach any dependent records that reference this mentor
    // Some deployments may have FK constraints that prevent deleting a mentor
    // if rows exist in `mentor_projects`. To be safe, set those mentor_id values to NULL.
    await client.query("UPDATE mentor_projects SET mentor_id = NULL WHERE mentor_id = $1", [id]);

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

    // Notify admins about deletion (best-effort; don't block on errors)
    try {
      const deletedMentor = result.rows[0] || {};
      const io = req.app.get('io');
      const mentorLabel = deletedMentor.full_name || deletedMentor.username || deletedMentor.email || `ID ${id}`;

      await notifyAdmins({
        title: 'Mentor removed',
        message: `Mentor ${mentorLabel} was deleted by an admin.`,
        type: 'mentor_deleted',
        metadata: { mentor_id: id, mentor: deletedMentor },
        io,
      });
    } catch (notifyErr) {
      console.error('Failed to notify admins about mentor deletion:', notifyErr && notifyErr.message ? notifyErr.message : notifyErr);
    }

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

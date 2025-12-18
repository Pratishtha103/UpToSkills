const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const { pushNotification, notifyAdmins } = require("../utils/notificationService");

// -----------------------------------------------
// GET all program assignments
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pa.id,
        pa.course_id,
        pa.mentor_id,
        pa.assigned_on,
        c.title AS program_name,
        COALESCE(md.full_name, m.full_name) AS mentor_name
      FROM program_assignments pa
      JOIN courses c ON pa.course_id = c.id
      LEFT JOIN mentor_details md ON md.mentor_id = pa.mentor_id
      LEFT JOIN mentors m ON m.id = pa.mentor_id
      ORDER BY pa.assigned_on DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Error fetching program assignments:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// -----------------------------------------------
// POST - Assign program to mentors
// -----------------------------------------------
router.post("/", async (req, res) => {
  // Accept `mentor_id` from frontend. Also accept legacy `mentors_id` for backward compatibility.
  const { course_id } = req.body;
  const mentor_id = req.body.mentor_id || req.body.mentors_id;

  if (!course_id || !mentor_id) {
    return res.status(400).json({ 
      success: false, 
      message: "Both course_id and mentor_id are required" 
    });
  }

  try {
    // Check if assignment already exists
    const existingAssignment = await pool.query(
      "SELECT * FROM program_assignments WHERE course_id = $1 AND mentor_id = $2",
      [course_id, mentor_id]
    );

    if (existingAssignment.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "This program is already assigned to this mentors" 
      });
    }

    // Create new assignment
    const result = await pool.query(
      `INSERT INTO program_assignments (course_id, mentor_id) 
       VALUES ($1, $2) RETURNING *`,
      [course_id, mentor_id]
    );

    // Fetch the complete data with names
    const assignmentData = await pool.query(`
      SELECT 
        pa.id,
        pa.course_id,
        pa.mentor_id,
        pa.assigned_on,
        c.title AS program_name,
        COALESCE(md.full_name, m.full_name) AS mentor_name
      FROM program_assignments pa
      JOIN courses c ON pa.course_id = c.id
      LEFT JOIN mentor_details md ON md.mentor_id = pa.mentor_id
      LEFT JOIN mentors m ON m.id = pa.mentor_id
      WHERE pa.id = $1
    `, [result.rows[0].id]);

    // Create notifications using centralized service so sockets are emitted as well
    const programData = assignmentData.rows[0];
    const io = req.app.get('io');

    // Mentor notification - dedupe: avoid creating duplicate notifications for same mentor+program
    const dedupeRes = await pool.query(
      `SELECT id FROM notifications WHERE role = $1 AND recipient_id = $2 AND notification_type = $3 AND (metadata->>'program_id') = $4 LIMIT 1`,
      ['mentor', mentor_id, 'program_assigned', String(course_id)]
    );

    if (dedupeRes.rowCount === 0) {
      await pushNotification({
        role: 'mentor',
        recipientRole: 'mentor',
        recipientId: mentor_id,
        type: 'program_assigned',
        title: 'New program assigned to you',
        message: `You have been assigned a new program: ${programData.program_name}. Start mentoring students now!`,
        link: '/mentor-dashboard/assigned-programs',
        metadata: { program_id: course_id, program_name: programData.program_name, mentor_name: programData.mentor_name },
        io,
      });
    } else {
      console.log('Skipping duplicate mentor notification for program', course_id, 'mentor', mentor_id);
    }

    // Admin notification removed to avoid duplicate/linked admin message

    res.status(201).json({ 
      success: true, 
      data: assignmentData.rows[0],
      message: "Program assigned successfully" 
    });
  } catch (err) {
    console.error("❌ Error assigning program:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// -----------------------------------------------
// DELETE - Remove program assignment
// -----------------------------------------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM program_assignments WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Assignment not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Assignment removed successfully",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("❌ Error removing assignment:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// -----------------------------------------------
// GET - Get assigned programs for a specific mentor
// -----------------------------------------------
router.get("/mentor/:mentorId", async (req, res) => {
  const { mentorId } = req.params;

  if (!mentorId || isNaN(mentorId)) {
    return res.status(400).json({ 
      success: false, 
      message: "Valid mentor_id is required" 
    });
  }

  try {
    const result = await pool.query(`
      SELECT 
        pa.id,
        pa.course_id,
        pa.mentor_id,
        pa.assigned_on,
        c.title AS program_name,
        c.description AS program_description
      FROM program_assignments pa
      JOIN courses c ON pa.course_id = c.id
      WHERE pa.mentor_id = $1
      ORDER BY pa.assigned_on DESC
    `, [mentorId]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Error fetching mentor assigned programs:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
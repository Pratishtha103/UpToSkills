const express = require("express");
const router = express.Router();
const pool = require('../config/database');

// ===============================
// SEARCH students by name (from user_details)
// ===============================
router.get("/search-students", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const query = `
      SELECT 
        u.id AS user_detail_id,
        u.student_id,
        u.full_name AS student_name
      FROM user_details u
      WHERE LOWER(u.full_name) LIKE LOWER($1)
      ORDER BY u.full_name ASC
      LIMIT 20
    `;
    const values = [`%${q}%`];

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({
      success: false,
      message: "Error searching students",
      error: error.message,
    });
  }
});

// ===============================
// GET ALL students in List (from user_details)
// ===============================
router.get("/all-students", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id AS user_detail_id,
        u.student_id,
        u.full_name AS student_name
      FROM user_details u
      ORDER BY u.full_name ASC
    `;
    
    const result = await pool.query(query);
    
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching all students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
});

// ===============================
// GET SINGLE student details (from user_details)
// ===============================
router.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        u.id AS user_detail_id,
        u.student_id,
        u.full_name,
        u.contact_number,
        u.linkedin_url,
        u.github_url,
        u.why_hire_me,
        u.ai_skill_summary,
        u.domains_of_interest AS domainsOfInterest,
        u.others_domain AS othersDomain
      FROM user_details u
      WHERE u.id = $1
    `;
    
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student details",
      error: error.message,
    });
  }
});

module.exports = router;
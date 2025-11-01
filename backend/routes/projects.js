const express = require('express');
const pool = require('../config/database');
const router = express.Router();

router.post("/", async (req, res) => {
  // CHANGED: Accept student_email instead of student_id
  const { student_email, title, description, tech_stack, contributions, is_open_source, github_pr_link } = req.body;
  let student_id = null; // Initialize the variable for the database ID

  // 1. Basic validation (Email check added)
  if (!student_email || student_email.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Student Email is required.'
    });
  }

  if (github_pr_link && github_pr_link.trim() && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(github_pr_link)) {
     return res.status(400).json({
      success: false,
      message: 'Please provide a valid GitHub URL'
     });
  }

  try {
    // 2. LOOKUP: Find the student's ID using the email
    const studentResult = await pool.query(
      `SELECT id FROM students WHERE email = $1`,
      [student_email]
    );

    if (studentResult.rowCount === 0) {
      // If no student found with that email, reject the submission
      return res.status(404).json({ 
        success: false, 
        message: 'Student email not found in the database. Please check the address.' 
      });
    }

    // Get the actual student ID from the lookup result
    student_id = studentResult.rows[0].id;
    
    // 3. INSERT: Use the retrieved student_id for the project insertion
    const result = await pool.query(
      `INSERT INTO projects (student_id, title, description, tech_stack, contributions, is_open_source, github_pr_link)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [student_id, title, description, tech_stack, contributions, is_open_source, github_pr_link]
    );
    
    console.log('Form submitted successfully!',result.rows[0])
  

    res.status(201).json({ message: "Project submitted successfully!", project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit project" });
  }
});


// Get all projects
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch projects" });
  }
});

// Delete a project by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted successfully", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
});

// The commented out route below can remain commented out as it expects studentId in params.

// Get assigned projects for a student
router.get("/assigned/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.tech_stack,
        p.contributions,
        p.is_open_source,
        p.github_pr_link,
        p.created_at,
        p.updated_at,
        pa.assigned_at
      FROM project_assignments pa
      INNER JOIN projects p ON pa.project_id = p.id
      WHERE pa.student_id = $1
      ORDER BY pa.assigned_at DESC
      `,
      [studentId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching assigned projects:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
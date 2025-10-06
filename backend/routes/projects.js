const express = require('express');
const pool = require('../config/database');
const router = express.Router();
router.post("/", async (req, res) => {
  const { student_id, title, description, tech_stack, contributions, is_open_source, github_pr_link } = req.body;
    // Basic validation
     if (github_pr_link && github_pr_link.trim() && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(github_pr_link)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid GitHub URL'
      });
    }
  try {
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



module.exports = router;

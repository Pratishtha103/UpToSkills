// backend/routes/students.js
const express = require('express');
const router = express.Router();

const pool = require('../config/database'); // used below in count/delete
const {
  getStudents,
  getStudentById,
  searchStudents,
  searchStudentsByQuery
} = require('../controllers/students.controller');

// Route: get student count (keeps your existing count route)
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS total_students FROM students');
    res.json({ totalStudents: result.rows[0].total_students });
  } catch (err) {
    console.error('❌ Error fetching student count:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete student by ID (keep as-is)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- SEARCH ROUTES ---
// Improved query-style search: /api/students/search?q=react
router.get('/search', searchStudentsByQuery);

// Legacy param search: /api/students/search/:name
router.get('/search/:name', searchStudents);

// Provide "all-students" alias for clients that expect it
router.get('/all-students', getStudents);

// Keep root route (getStudents) at /api/students/
router.get('/', getStudents);

// Provide "student/:id" alias (used by your frontend code) -> maps to getStudentById
router.get('/student/:id', getStudentById);

// Also keep '/:id' for other clients
router.get('/:id', getStudentById);

module.exports = router;

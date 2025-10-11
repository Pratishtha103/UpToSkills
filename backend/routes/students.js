// backend/routes/students.js
const express = require('express');
const router = express.Router();

const { getStudents, getStudentById, searchStudents } = require('../controllers/students.controller');
const pool = require('../config/database');

// Route to get total student count
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS total_students FROM students');
    res.json({ totalStudents: result.rows[0].total_students });
  } catch (err) {
    console.error('❌ Error fetching student count:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete student by ID
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

// Search route must come before '/:id'
router.get('/search/:name', searchStudents);

// Get all students
router.get('/', getStudents);

// Get student by ID
router.get('/:id', getStudentById);

module.exports = router;
// backend/routes/students.js
const express = require('express');
const router = express.Router();

const { getStudents, getStudentById } = require('../controllers/students.controller');
const pool = require('../config/database');

// Route to get total student count — place BEFORE '/:id' so '/count' is not treated as an id
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS total_students FROM students');
    res.json({ totalStudents: result.rows[0].total_students });
  } catch (err) {
    console.error('❌ Error fetching student count:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get all students
router.get('/', getStudents);

// Route to get a student by id
router.get('/:id', getStudentById);

module.exports = router;

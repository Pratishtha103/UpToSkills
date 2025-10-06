// routes/mentors.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET total mentors
router.get('/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS total_mentors FROM mentors');
    res.json({ totalMentors: result.rows[0].total_mentors });
  } catch (err) {
    console.error('❌ Error fetching mentor count:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

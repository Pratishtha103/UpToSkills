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

// GET all mentors (list)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone FROM mentors ORDER BY id DESC'
    );
    // return an array of mentor rows
    return res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching mentors list:', err.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE mentor by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM mentors WHERE id = $1', [id]);
    return res.json({ message: 'Mentor deleted' });
  } catch (err) {
    console.error('❌ Error deleting mentor:', err.message);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

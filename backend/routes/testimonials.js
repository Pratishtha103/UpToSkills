// server/routes/testimonials.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all testimonials (most recent first)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// POST create a testimonial
router.post('/', async (req, res) => {
  try {
    const { name, role, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'name and message are required' });
    }
    const result = await pool.query(
      'INSERT INTO testimonials (name, role, message) VALUES ($1, $2, $3) RETURNING *',
      [name, role || null, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// DELETE testimonial by id (optional)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

module.exports = router;

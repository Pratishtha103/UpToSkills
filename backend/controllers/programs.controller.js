const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const createProgram = async (req, res) => {
  const { name, email, phone, education, programexp, course } = req.body;

  if (!name || !email || !phone || !education || !programexp || !course) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (req.file && req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ success: false, message: 'Please upload a PDF resume' });
  }

  let resumePath = null;
  if (req.file?.buffer) {
    try {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const diskName = Date.now() + '-' + (req.file.originalname || 'resume.pdf');
      resumePath = path.join(uploadDir, diskName);
      fs.writeFileSync(resumePath, req.file.buffer);
    } catch (e) {
      console.warn('Could not write uploaded resume to disk:', e.message);
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO programs (name, email, phone, education, programexp, course, resume_path, resume_data, resume_mime, resume_filename)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, email, phone, education, programexp, course, resumePath, req.file?.buffer || null, req.file?.mimetype || null, req.file?.originalname || null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};

const getPrograms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};

const getProgramById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};

module.exports = { createProgram, getPrograms, getProgramById };

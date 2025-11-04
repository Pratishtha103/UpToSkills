const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const createProgram = async (req, res) => {
  const { name, email, phone, education, programexp, course,date,time } = req.body;

  if (!name || !email || !phone || !education || !programexp || !course) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (req.file && req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ success: false, message: 'Please upload a PDF resume' });
  }
  // pool.query('ALTER TABLE programs ADD COLUMN IF NOT EXISTS date TEXT', (err) => {
  //   if (err) throw err; // Handle the error appropriately.
  // });
  // pool.query('ALTER TABLE programs ADD COLUMN IF NOT EXISTS time TEXT', (err) => {
  //   if (err) throw err; // Handle the error appropriately.
  // });

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
    // Create program application
    const result = await pool.query(
      `INSERT INTO programs (name, email, phone, education, programexp, course, resume_path, resume_data, resume_mime, resume_filename,date,time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12) RETURNING *`,
      [name, email, phone, education, programexp, course, resumePath, req.file?.buffer || null, req.file?.mimetype || null, req.file?.originalname || null,date,time]
    );

    console.log('Program application created:', result.rows[0]);

    // Now create enrollment record
    try {
      // Find course by title
      const courseResult = await pool.query('SELECT id FROM courses WHERE title ILIKE $1', [course]);
      
      if (courseResult.rows.length > 0) {
        const courseId = courseResult.rows[0].id;
        console.log('Found course ID:', courseId);

        // Find or create student by email
        let studentResult = await pool.query('SELECT id FROM students WHERE email = $1', [email]);
        let studentId;

        if (studentResult.rows.length === 0) {
          // Create new student record
          console.log('Creating new student for email:', email);
          const newStudentResult = await pool.query(
            'INSERT INTO students (full_name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, phone, 'temp_password'] // You may want to generate a proper password
          );
          studentId = newStudentResult.rows[0].id;
          console.log('Created new student with ID:', studentId);
        } else {
          studentId = studentResult.rows[0].id;
          console.log('Found existing student with ID:', studentId);
        }

        // Create enrollment
        const { createEnrollment } = require('./enrollment.controller');
        const enrollment = await createEnrollment(studentId, courseId, 'active');
        console.log('Enrollment created:', enrollment);

        res.json({ 
          success: true, 
          data: result.rows[0],
          enrollment: enrollment,
          message: 'Program application and enrollment created successfully'
        });
      } else {
        console.log('Course not found for title:', course);
        res.json({ 
          success: true, 
          data: result.rows[0],
          message: 'Program application created, but course not found for enrollment'
        });
      }
    } catch (enrollmentError) {
      console.error('Enrollment creation failed:', enrollmentError);
      // Still return success for program creation even if enrollment fails
      res.json({ 
        success: true, 
        data: result.rows[0],
        message: 'Program application created, but enrollment failed'
      });
    }

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

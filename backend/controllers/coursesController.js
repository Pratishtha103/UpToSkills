const pool = require('../config/database');

const path = require('path');

// --- Ensure table exists ---
const ensureCoursesTable = async () => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image_path VARCHAR(255),
      enrolled integer[],
      skills TEXT[],     -- Added skills array column
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createQuery);

  const alterQuery = `
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS enroll_url TEXT;
  `;
  await pool.query(alterQuery);
};

// --- Add new course ---
const addCourse = async (req, res) => {
  try {
    const { title, description, enrolled } = req.body;
    let imagePath = null;

    if (req.file) {
      // store as relative path (for frontend use)
      imagePath = `/uploads/${req.file.filename}`;
    }

    // parse skills JSON string, fallback to empty array if invalid or missing
    let skillsArray = [];
    if (req.body.skills) {
      try {
        skillsArray = JSON.parse(req.body.skills);
        if (!Array.isArray(skillsArray)) skillsArray = [];
      } catch {
        skillsArray = [];
      }
    }

    const insertQuery = `
      INSERT INTO courses (title, description, image_path, enrolled, skills)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [title, description, imagePath, enrolled || null, skillsArray];

    const { rows } = await pool.query(insertQuery, values);

    res.status(201).json({
      message: "Course added successfully",
      course: rows[0],
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
};

// --- Get all courses ---
const getAllCourses = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM courses ORDER BY created_at DESC;");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

const enrollStudent = async (req, res) => {
  const { id } = req.params; // course id
  const { studentId } = req.body; // student id to enroll

  try {
    const courseResult = await pool.query("SELECT enrolled FROM courses WHERE id = $1", [id]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const enrolled = courseResult.rows[0].enrolled || [];

    if (enrolled.includes(parseInt(studentId))) {
      return res.status(400).json({ error: "Student already enrolled" });
    }

    const updatedEnrolled = [...enrolled, parseInt(studentId)];

    await pool.query("UPDATE courses SET enrolled = $1 WHERE id = $2", [updatedEnrolled, id]);

    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  ensureCoursesTable,
  addCourse,
  getAllCourses,
  getCourseById,
  enrollStudent,
};
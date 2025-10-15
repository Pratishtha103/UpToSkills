const pool = require("../config/database.js");
const path = require("path");

// --- Ensure table exists ---
const ensureCoursesTable = async () => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image_path VARCHAR(255),
      enroll_url TEXT,
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
    const { title, description, enroll_url } = req.body;
    let imagePath = null;

    if (req.file) {
      // store as relative path (for easy use in frontend)
      imagePath = `/uploads/${req.file.filename}`;
    }

    const insertQuery = `
      INSERT INTO courses (title, description, image_path, enroll_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [title, description, imagePath, enroll_url || null];

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

module.exports = {
    ensureCoursesTable,
    addCourse,
    getAllCourses
};

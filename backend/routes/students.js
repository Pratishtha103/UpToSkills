// backend/routes/students.js
const express = require("express");
const router = express.Router();

const pool = require("../config/database");

// Controllers
const {
  getStudents,
  getStudentById,
  searchStudents,
  searchStudentsByQuery,
  getStudentDetails
} = require("../controllers/students.controller");

// Middlewares
const verifyToken = require("../middleware/auth");

/*==========================================================
 🟢 COUNT  (NO ROLE CHECK)
==========================================================*/
router.get(
  "/count",
  verifyToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT COUNT(*)::int AS total_students FROM students"
      );
      res.json({ totalStudents: result.rows[0].total_students });
    } catch (err) {
      console.error("❌ Error fetching student count:", err.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

/*==========================================================
 🔴 DELETE (NO ROLE CHECK)
==========================================================*/
router.delete(
  "/:id",
  verifyToken,
  async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        "DELETE FROM students WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ success: false, message: "Student not found" });
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Student deleted",
        data: result.rows[0]
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error deleting student:", err);
      res.status(500).json({ success: false, message: "Server error" });
    } finally {
      client.release();
    }
  }
);

// --- SEARCH ROUTES ---
router.get('/search', searchStudentsByQuery);

// /api/students/search/:name
router.get(
  "/search/:name",
  verifyToken,
  searchStudents
);

// Autocomplete
router.get('/autocomplete', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.id, 
        COALESCE(u.full_name, s.full_name, s.username) as name,
        s.email, 
        s.phone 
       FROM students s
       LEFT JOIN user_details u ON s.id = u.student_id
       ORDER BY COALESCE(u.full_name, s.full_name, s.username) ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students for autocomplete:', error);
    res.status(500).json({ error: 'Server error while fetching students' });
  }
});

// Alias for all students
router.get('/all-students', getStudents);

// Default root route
router.get('/', getStudents);

// Get student details
router.get('/:id/details', getStudentDetails);

// Alias route
router.get('/student/:id', getStudentById);

// Keep '/:id'
router.get('/:id', getStudentById);

module.exports = router;

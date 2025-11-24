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
const checkRole = require("../middleware/checkRole");


// 🟢 GET student count
router.get(
  "/count",
  verifyToken,
  checkRole(["student"]),  
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

// 🟡 DELETE student by ID (only admin should delete ideally)
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]), // ONLY ADMIN can delete
  async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query("DELETE FROM user_details WHERE student_id = $1", [id]);

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

/*==========================================================
 🔍 SEARCH ROUTES
===========================================================*/

// /api/students/search?q=react
router.get(
  "/search",
  verifyToken,
  checkRole(["student"]),
  searchStudentsByQuery
);

// /api/students/search/:name
router.get(
  "/search/:name",
  verifyToken,
  checkRole(["student"]),
  searchStudents
);

/*==========================================================
 👥 STUDENT LIST ROUTES
===========================================================*/

// /api/students/all-students
router.get(
  "/all-students",
  verifyToken,
  checkRole(["student"]),
  getStudents
);

// /api/students/
router.get(
  "/",
  verifyToken,
  checkRole(["student"]),
  getStudents
);

/*==========================================================
 📌 STUDENT DETAILS ROUTES
===========================================================*/

// /api/students/:id/details
router.get(
  "/:id/details",
  verifyToken,
  checkRole(["student"]),
  getStudentDetails
);

// /api/students/student/:id
router.get(
  "/student/:id",
  verifyToken,
  checkRole(["student"]),
  getStudentById
);

// /api/students/:id
router.get(
  "/:id",
  verifyToken,
  checkRole(["student"]),
  getStudentById
);

module.exports = router;

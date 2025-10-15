// backend/routes/courses.route.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { addCourse, getAllCourses, ensureCoursesTable } = require("../controllers/coursesController");
const pool = require('../config/database');
const router = express.Router();

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// --- Ensure table exists before any operation ---
router.use(async (req, res, next) => {
  try {
    await ensureCoursesTable();
    next();
  } catch (err) {
    console.error("Error ensuring courses table:", err);
    res.status(500).json({ error: "Database setup failed" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: "Course deleted successfully", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to delete course",error: err.message });
  }
});


// --- Routes ---
router.post("/", upload.single("image"), addCourse);
router.get("/", getAllCourses);

module.exports = router;

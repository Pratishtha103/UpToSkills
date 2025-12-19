// routes/adminInterviewCount.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// ✅ GET interview count per student (ADMIN ONLY)
router.get("/count/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const result = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM interviews
      WHERE candidate_id = $1
      `,
      [studentId]
    );

    res.json({
      success: true,
      studentId,
      count: result.rows[0].count,
    });
  } catch (error) {
    console.error("Admin interview count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview count",
    });
  }
});

module.exports = router;

// backend/controllers/students.controller.js
const pool = require('../config/database');

/**
 * ✅ Fetch latest students (safe for use from frontend)
 * Returns rows as-is from DB. Clients may normalize fields.
 */
const getStudents = async (req, res) => {
  try {
    const query = `
      SELECT
        s.id,
        s.username,
        COALESCE(u.full_name, s.full_name) AS full_name,
        s.email,
        s.phone,
        u.ai_skill_summary,
        u.domains_of_interest,
        u.others_domain,
        u.profile_completed,
        s.created_at
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      ORDER BY s.created_at DESC;
    `;

    const result = await pool.query(query);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getStudents error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Fetch a single student (detailed)
 * Supports fetching from both `students` and `user_details` tables.
 */
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        s.id,
        s.username,
        s.full_name,
        s.email,
        s.phone,
        s.created_at,
        u.id AS user_detail_id,
        u.full_name AS profile_full_name,
        u.contact_number,
        u.linkedin_url,
        u.github_url,
        u.why_hire_me,
        u.profile_completed,
        u.ai_skill_summary,
        u.domains_of_interest,
        u.others_domain,
        u.created_at AS profile_created_at,
        u.updated_at AS profile_updated_at
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      WHERE s.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Student not found' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getStudentById error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Search by name (legacy route /search/:name)
 * Case-insensitive search for compatibility with old API.
 */
const searchStudents = async (req, res) => {
  try {
    const { name } = req.params;

    const query = `
      SELECT
        s.id,
        s.username,
        COALESCE(u.full_name, s.full_name) AS full_name,
        s.email,
        s.phone,
        u.ai_skill_summary,
        u.domains_of_interest,
        u.others_domain,
        u.profile_completed,
        s.created_at
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      WHERE LOWER(s.full_name) LIKE LOWER($1)
         OR LOWER(u.full_name) LIKE LOWER($1)
      ORDER BY s.created_at DESC;
    `;

    const result = await pool.query(query, [`%${name}%`]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No students found' });
    }

    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('searchStudents error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Enhanced search endpoint (recommended)
 * Route: /api/students/search?q=keyword
 * Searches by name, AI skill summary, domains, or others_domain.
 */
const searchStudentsByQuery = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Query parameter 'q' is required" });
    }

    const like = `%${q}%`;

    const query = `
      SELECT
        s.id,
        s.username,
        COALESCE(u.full_name, s.full_name) AS full_name,
        s.email,
        s.phone,
        u.ai_skill_summary,
        u.domains_of_interest,
        u.others_domain,
        u.profile_completed,
        s.created_at
      FROM students s
      LEFT JOIN user_details u ON s.id = u.student_id
      WHERE LOWER(s.full_name) LIKE LOWER($1)
         OR LOWER(u.full_name) LIKE LOWER($1)
         OR LOWER(COALESCE(u.ai_skill_summary, '')) LIKE LOWER($1)
         OR LOWER(COALESCE(u.domains_of_interest::text, '')) LIKE LOWER($1)
         OR LOWER(COALESCE(u.others_domain, '')) LIKE LOWER($1)
      ORDER BY s.created_at DESC;
    `;

    const result = await pool.query(query, [like]);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('searchStudentsByQuery error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  searchStudents,
  searchStudentsByQuery,
};

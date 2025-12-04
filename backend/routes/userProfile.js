const express = require('express');
const pool = require('../config/database');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// ===============================
// CREATE or UPDATE user profile
// ===============================
router.post('/profile', verifyToken, async (req, res) => {
  try {
    const {
      full_name,
      contact_number,
      linkedin_url,
      github_url,
      why_hire_me,
      ai_skill_summary,
      domainsOfInterest,
      othersDomain
    } = req.body;

    // ✅ Extract student ID from token
    const studentId = req.user.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: student ID missing'
      });
    }

    // ===== Validation =====
    if (!full_name || !full_name.trim() || !/^[A-Za-z ]+$/.test(full_name)) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required and should contain only alphabets'
      });
    }

    if (!contact_number || !/^[0-9]{10}$/.test(contact_number)) {
      return res.status(400).json({
        success: false,
        message: 'Contact number must be exactly 10 digits'
      });
    }

    if (
      linkedin_url &&
      linkedin_url.trim() &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedin_url)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid LinkedIn URL'
      });
    }

    if (
      github_url &&
      github_url.trim() &&
      !/^https?:\/\/(www\.)?github\.com\/.*$/.test(github_url)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub URL'
      });
    }

    if (!why_hire_me || !why_hire_me.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide why hire me information'
      });
    }

    if (!ai_skill_summary || !ai_skill_summary.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide AI skill summary'
      });
    }

    if (
      !domainsOfInterest ||
      !Array.isArray(domainsOfInterest) ||
      domainsOfInterest.length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least two domains of interest'
      });
    }

    // ===== Check if a profile already exists for this student =====
    const checkQuery = 'SELECT id FROM user_details WHERE student_id = $1';
    const checkResult = await pool.query(checkQuery, [studentId]);

    let result;

    if (checkResult.rows.length > 0) {
      // ✅ Update existing profile
      const updateQuery = `
        UPDATE user_details
        SET full_name = $1,
            contact_number = $2,
            linkedin_url = $3,
            github_url = $4,
            why_hire_me = $5,
            profile_completed = TRUE,
            ai_skill_summary = $6,
            domains_of_interest = $7,
            others_domain = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE student_id = $9
        RETURNING *
      `;
      result = await pool.query(updateQuery, [
        full_name,
        contact_number,
        linkedin_url,
        github_url,
        why_hire_me,
        ai_skill_summary,
        domainsOfInterest,
        othersDomain,
        studentId
      ]);
    } else {
      // ✅ Insert new profile with student_id
     const insertQuery = `
  INSERT INTO user_details
  (student_id, full_name, contact_number, linkedin_url, github_url,
   why_hire_me, ai_skill_summary, domains_of_interest, others_domain, profile_completed)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
  RETURNING *
`;
      result = await pool.query(insertQuery, [
  studentId,
  full_name,
  contact_number,
  linkedin_url,
  github_url,
  why_hire_me,
  ai_skill_summary,
  domainsOfInterest,
  othersDomain
]);
    }

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving profile',
      error: error.message
    });
  }
});

// ===============================
// GET all profiles
// ===============================
router.get('/profiles', async (req, res) => {
  try {
    const query = 'SELECT * FROM user_details ORDER BY created_at DESC';
    const result = await pool.query(query);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profiles',
      error: error.message
    });
  }
});

// ===============================
// GET profile of currently logged-in student
// ===============================
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;
 // taken from token
    if (!studentId) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const query = `
      SELECT
        s.id AS student_id,
        s.full_name AS student_name,
        s.email AS student_email,
        s.phone AS student_phone,
        u.id AS profile_id,
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
      LEFT JOIN user_details u
        ON s.id = u.student_id
      WHERE s.id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [studentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found for this student',
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
});


// ===============================
// MENTOR PROFILE ROUTES
// ===============================
router.post('/mentor/profile', verifyToken, async (req, res) => {
  try {
    const {
      full_name,
      contact_number,
      linkedin_url,
      github_url,
      about_me,
      expertise_domains,
      others_domain
    } = req.body;

    const mentorId = req.user.id;

    if (!mentorId) {
      return res.status(401).json({ success: false, message: 'Invalid token: mentor ID missing' });
    }

    // Incoming mentor profile data (kept as comments to avoid terminal noise)
    /*
      full_name,
      contact_number,
      linkedin_url,
      github_url,
      about_me,
      expertise_domains,
      others_domain
    */

    // ✅ Optional validation: only validate if value exists and is not empty
    if (full_name && full_name.trim() && !/^[A-Za-z ]+$/.test(full_name)) {
      return res.status(400).json({ success: false, message: 'Full name must contain only alphabets' });
    }

    if (contact_number && contact_number.trim() && !/^[0-9]{10}$/.test(contact_number)) {
      return res.status(400).json({ success: false, message: 'Contact number must be 10 digits' });
    }

    if (linkedin_url && linkedin_url.trim() && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedin_url)) {
      return res.status(400).json({ success: false, message: 'Invalid LinkedIn URL' });
    }

    if (github_url && github_url.trim() && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(github_url)) {
      return res.status(400).json({ success: false, message: 'Invalid GitHub URL' });
    }

    // Prepare expertise_domains:
    // - if an array with items -> convert to PostgreSQL array literal: '{"a","b"}'
    // - if an empty array -> set to '{}' (explicit empty array)
    // - if not provided (undefined/null) -> leave as null so we don't change existing value
    let expertiseDomainValue = null;
    if (Array.isArray(expertise_domains)) {
      if (expertise_domains.length > 0) {
        expertiseDomainValue = '{' + expertise_domains.map(d => `"${String(d).replace(/"/g, '\\"')}"`).join(',') + '}';
      } else {
        expertiseDomainValue = '{}';
      }
    }

    // Check if mentor profile exists
    const checkQuery = 'SELECT id FROM mentor_details WHERE mentor_id = $1';
    const checkResult = await pool.query(checkQuery, [mentorId]);

    let result;
    if (checkResult.rows.length > 0) {
      // Update existing - use CASE to conditionally update only non-empty fields
      const updateQuery = `
        UPDATE mentor_details
        SET 
          full_name = CASE WHEN $1::text IS NOT NULL THEN $1::text ELSE full_name END,
          contact_number = CASE WHEN $2::text IS NOT NULL THEN $2::text ELSE contact_number END,
          linkedin_url = CASE WHEN $3::text IS NOT NULL THEN $3::text ELSE linkedin_url END,
          github_url = CASE WHEN $4::text IS NOT NULL THEN $4::text ELSE github_url END,
          about_me = CASE WHEN $5::text IS NOT NULL THEN $5::text ELSE about_me END,
          expertise_domains = CASE WHEN $6::text[] IS NOT NULL THEN $6::text[] ELSE expertise_domains END,
          others_domain = CASE WHEN $7::text IS NOT NULL THEN $7::text ELSE others_domain END,
          updated_at = CURRENT_TIMESTAMP
        WHERE mentor_id = $8
        RETURNING *;
      `;

      // Pass parameter values as-is, but convert undefined -> null so that
      // a sent empty string ("" ) will overwrite existing DB value.
      const p1 = typeof full_name === 'undefined' ? null : full_name;
      const p2 = typeof contact_number === 'undefined' ? null : contact_number;
      const p3 = typeof linkedin_url === 'undefined' ? null : linkedin_url;
      const p4 = typeof github_url === 'undefined' ? null : github_url;
      const p5 = typeof about_me === 'undefined' ? null : about_me;
      const p6 = typeof expertiseDomainValue === 'undefined' ? null : expertiseDomainValue;
      const p7 = typeof others_domain === 'undefined' ? null : others_domain;

      result = await pool.query(updateQuery, [p1, p2, p3, p4, p5, p6, p7, mentorId]);
    } else {
      // Insert new profile
      const insertQuery = `
        INSERT INTO mentor_details
        (mentor_id, full_name, contact_number, linkedin_url, github_url, about_me, expertise_domains, others_domain)
        VALUES ($1, $2, $3, $4, $5, $6, $7::text[], $8)
        RETURNING *;
      `;

      const i2 = typeof full_name === 'undefined' ? null : full_name;
      const i3 = typeof contact_number === 'undefined' ? null : contact_number;
      const i4 = typeof linkedin_url === 'undefined' ? null : linkedin_url;
      const i5 = typeof github_url === 'undefined' ? null : github_url;
      const i6 = typeof about_me === 'undefined' ? null : about_me;
      const i7 = typeof expertiseDomainValue === 'undefined' ? null : expertiseDomainValue;
      const i8 = typeof others_domain === 'undefined' ? null : others_domain;

      result = await pool.query(insertQuery, [mentorId, i2, i3, i4, i5, i6, i7, i8]);
    }

    res.status(200).json({
      success: true,
      message: 'Mentor profile saved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving mentor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving mentor profile',
      error: error.message
    });
  }
});


// ✅ Fetch mentor profile
router.get('/mentor/profile', verifyToken, async (req, res) => {
  try {
    const mentorId = req.user.id;

    const query = `
      SELECT
        m.id AS mentor_id,
        m.full_name AS mentor_name,
        m.email AS mentor_email,
        md.full_name AS profile_full_name,
        md.contact_number,
        md.linkedin_url,
        md.github_url,
        md.about_me,
        md.expertise_domains,
        md.others_domain,
        md.created_at,
        md.updated_at
      FROM mentors m
      LEFT JOIN mentor_details md ON m.id = md.mentor_id
      WHERE m.id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [mentorId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mentor profile not found' });
    }

    // Handle expertise_domains - PostgreSQL returns as array
    const data = result.rows[0];
    if (data.expertise_domains) {
      // If it's already an array, keep it
      if (Array.isArray(data.expertise_domains)) {
        // It's already an array, good!
      } else if (typeof data.expertise_domains === 'string') {
        // Try to parse if it's a JSON string
        try {
          data.expertise_domains = JSON.parse(data.expertise_domains);
        } catch (e) {
          console.warn('Could not parse expertise_domains:', data.expertise_domains);
          data.expertise_domains = [];
        }
      }
    } else {
      data.expertise_domains = [];
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentor profile',
      error: error.message
    });
  }
});



module.exports = router;

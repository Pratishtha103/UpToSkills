const pool = require('../config/database');

const addSkillBadge = async (req, res) => {
  const { student_id, badge_name, badge_description } = req.body;

  if (!student_id || !badge_name || !badge_description) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const badgeResult = await pool.query(
      'INSERT INTO skill_badges (name, description) VALUES ($1, $2) RETURNING id',
      [badge_name, badge_description]
    );

    await pool.query(
      'INSERT INTO student_badges (student_id, badge_id) VALUES ($1, $2)',
      [student_id, badgeResult.rows[0].id]
    );

    res.json({ success: true, message: 'Skill badge added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};

const getStudentBadges = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sb.id, sb.name, sb.description, stb.awarded_at, s.full_name
       FROM student_badges stb
       JOIN skill_badges sb ON stb.badge_id = sb.id
       JOIN students s ON stb.student_id = s.id
       ORDER BY stb.awarded_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};

module.exports = { addSkillBadge, getStudentBadges };

// backend/controllers/skillBadges.controller.js

const pool = require('../config/database');

const addSkillBadge = async (req, res) => {
    // ... (Your existing addSkillBadge code remains unchanged)
    const { student_name, badge_name, badge_description, verified } = req.body; 

    if (!student_name || !badge_name || !badge_description) {
        return res.status(400).json({ success: false, message: 'All required fields are missing' });
    }

    try {
        const studentResult = await pool.query(
            'SELECT id FROM students WHERE full_name ILIKE $1',
            [student_name]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found with that name' });
        }
        
        const student_id = studentResult.rows[0].id;

        const badgeResult = await pool.query(
            'INSERT INTO skill_badges (name, description, is_verified) VALUES ($1, $2, $3) RETURNING id',
            [badge_name, badge_description, verified]
        );

        await pool.query(
            'INSERT INTO student_badges (student_id, badge_id) VALUES ($1, $2)',
            [student_id, badgeResult.rows[0].id]
        );

        res.json({ success: true, message: 'Skill badge added successfully' });
    } catch (err) {
        console.error('Error in addSkillBadge:', err);
        res.status(500).json({ success: false, message: 'Database error while adding badge' });
    }
};

// MODIFIED: Filters badges by the logged-in student's ID (req.user.id)
const getStudentBadges = async (req, res) => { 
    const student_id = req.user.id; 
    
    try {
        const result = await pool.query(
            `SELECT 
                sb.id, 
                sb.name, 
                sb.description, 
                sb.is_verified, 
                stb.awarded_at, 
                s.full_name
             FROM student_badges stb
             JOIN skill_badges sb ON stb.badge_id = sb.id
             JOIN students s ON stb.student_id = s.id
             WHERE stb.student_id = $1 
             ORDER BY stb.awarded_at DESC`, 
             [student_id]
        );

        res.json({ success: true, data: result.rows });
    } catch (err) {
        // CRITICAL DEBUGGING LINE: Log the exact error from the database to the server console
        console.error('DATABASE ERROR in getStudentBadges:', err.message || err); 
        
        // This response message will be seen on the frontend console (data.message)
        res.status(500).json({ 
            success: false, 
            message: 'Database error while fetching badges. Check server logs for details.' 
        });
    }
};

module.exports = { addSkillBadge, getStudentBadges };
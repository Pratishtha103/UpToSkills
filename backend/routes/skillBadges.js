// backend/routes/skillBadges.js

const express = require('express');
const router = express.Router();
const { addSkillBadge, getStudentBadges, getAllStudents } = require('../controllers/skillBadges.controller');
// IMPORT the authentication middleware (adjust path as necessary)
const authMiddleware = require('../middleware/auth'); // <<< IMPORTANT: ENSURE THIS PATH IS CORRECT

// Mentor POST route
router.post('/', addSkillBadge);
router.post('/*', addSkillBadge); 

// MODIFIED GET route: Add the authMiddleware to ensure only the logged-in student's ID is used
router.get('/', authMiddleware, getStudentBadges);

// GET route to fetch all students for mentor dropdown
router.get('/students', getAllStudents);

module.exports = router;

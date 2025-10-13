const express = require('express');
const router = express.Router();
const { addSkillBadge, getStudentBadges } = require('../controllers/skillBadges.controller');

router.post('/', addSkillBadge);
router.get('/', getStudentBadges);

module.exports = router;

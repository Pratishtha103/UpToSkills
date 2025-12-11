const express = require('express');
const multer = require('multer');
// CORRECTED: programs.controller (plural) and form.controller (new)
const { createProgram, getPrograms, getProgramById, checkDuplicateProgramEnrollment } = require('../controllers/programs.controller');
const { sendContactEmail } = require('../controllers/form.controller');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Original Program/Upload Routes
router.post('/', upload.single('resume'), createProgram);
router.get('/', getPrograms);
router.post('/check-duplicate', checkDuplicateProgramEnrollment);
router.get('/:id', getProgramById);

// New Contact Form Route
router.post('/contact', sendContactEmail);

module.exports = router;
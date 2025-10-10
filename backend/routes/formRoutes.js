const express = require('express');
const multer = require('multer');
const { createProgram, getPrograms, getProgramById } = require('../controllers/programs.controller');
// FIX: Using the convention 'form.controller'
const { sendContactEmail } = require('../controllers/form.controller'); 

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Original Program/Upload Routes
router.post('/', upload.single('resume'), createProgram);
router.get('/', getPrograms);
router.get('/:id', getProgramById);

// New Contact Form Route
router.post('/contact', sendContactEmail);

module.exports = router;
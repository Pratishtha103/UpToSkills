const express = require('express');
const multer = require('multer');
const { createProgram, getPrograms, getProgramById } = require('../controllers/programs.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('resume'), createProgram);
router.get('/', getPrograms);
router.get('/:id', getProgramById);

module.exports = router;

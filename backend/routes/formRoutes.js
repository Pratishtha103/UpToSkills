const express = require('express');
const { sendContactEmail } = require('../controllers/form.controller'); // Import the controller function

const router = express.Router();

/**
 * @route POST /api/forms/contact
 * @desc Handle contact form submission and send email
 * @access Public
 */
router.post('/contact', sendContactEmail);

module.exports = router;
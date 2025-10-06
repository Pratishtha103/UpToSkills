const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getCompanyProfiles,
  getCompanyProfileById,
  addCompanyProfile,
  updateCompanyProfile
} = require('../controllers/companyProfiles.controller');

// Routes for your task
router.get('/', getCompanyProfiles);
router.get('/:id', getCompanyProfileById);
router.post('/', upload.single('logo'), addCompanyProfile);
router.put('/:id', upload.single('logo'), updateCompanyProfile);

module.exports = router;

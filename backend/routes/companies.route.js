const express = require('express');
const router = express.Router();
const { getCompanies, deleteCompany } = require('../controllers/companies.controller');

router.get('/', getCompanies);
router.delete('/:id', deleteCompany);

module.exports = router;

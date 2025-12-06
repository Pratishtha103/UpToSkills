// routes/stats.js
const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/stats.controller");

router.get("/", getStats);

module.exports = router;

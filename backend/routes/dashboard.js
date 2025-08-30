const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/data
router.get('/data', verifyToken, dashboardController.getDashboardData);

module.exports = router;

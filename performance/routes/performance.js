const performanceController = require('../controllers/perfomanceController');
const express = require('express');
const router = express.Router();

router.get('/', performanceController.getAllPerformance);
router.get('/latest', performanceController.getLatestPerformance);
router.get('/by-date', performanceController.getPerformanceByDate);

module.exports = router;
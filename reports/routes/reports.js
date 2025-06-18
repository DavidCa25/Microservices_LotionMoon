const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportsController');

router.post('/reports', reportController.createReport);
router.get('/reports', reportController.getReports);
router.get('/reports/:id', reportController.getReportById);
router.patch('/reports/:id', reportController.updateReport);

module.exports = router;

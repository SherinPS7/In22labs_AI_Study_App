const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integration.controller');

router.post('/notion', integrationController.syncWithNotion);
router.post('/calendar', integrationController.syncWithGoogleCalendar);

module.exports = router;

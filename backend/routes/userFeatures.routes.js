const express = require('express');
const router = express.Router();
const userFeaturesController = require('../controllers/userFeatures.controller');  // Importing the controller

// Route to save selected features
router.post('/save-features', userFeaturesController.saveFeatures);  // Ensures saveFeatures is used as the handler

module.exports = router;

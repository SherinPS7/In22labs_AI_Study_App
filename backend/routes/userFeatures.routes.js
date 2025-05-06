const express = require('express');
const router = express.Router();
const userFeaturesController = require('../controllers/userFeatures.controller'); 

// Route to get all user features 
router.get('/features',  userFeaturesController.getUserFeatures);

// Route to get a specific user feature
router.get('/features/:feature_name', userFeaturesController.getUserFeature);

// Route to create or update a user feature 
router.post('/features', userFeaturesController.setUserFeature);

module.exports = router;

const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfile.controller');

// GET user profile by ID
router.get('/:userId', userProfileController.getUserProfile);

// PATCH update profile (bio, public/private toggle)
router.patch('/:userId', userProfileController.updateUserProfile);

module.exports = router;

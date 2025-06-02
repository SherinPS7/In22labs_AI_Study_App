const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/check-mobile', authController.checkMobile); // 🔍 Check if number exists
router.post('/signup', authController.signup);            // 📝 Signup after OTP
router.post("/login", authController.login); // <-- login route
router.post("/reset-password", authController.resetPassword);
router.post('/forgot/check-mobile', authController.checkMobileForReset);

module.exports = router;

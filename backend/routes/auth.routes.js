const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout); 
// Verify ID Token from client after OTP login
router.post('/verify-otp', async (req, res) => {
    const { idToken } = req.body;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      res.status(200).json({ message: 'OTP verified!', user: decodedToken });
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired OTP', error });
    }
  });
module.exports = router;

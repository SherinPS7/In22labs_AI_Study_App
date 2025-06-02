const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/plans', require('./plans.routes'));

//r//outer.use('/streaks', require('./streak.routes'));
router.use('/integrations', require('./integrations.routes'));

router.use('/features', require('./userFeatures.routes'));
router.use('/gamification', require('./gamification.routes'));  

// Add this line for session routes:
router.use('/session', require('./session.routes'));  

module.exports = router;
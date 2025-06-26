const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
// router.use('/users', require('./user.routes'));
router.use('/plans', require('./plans.routes'));

//r//outer.use('/streaks', require('./streak.routes'));
router.use('/integrations', require('./integrations.routes'));

router.use('/features', require('./userFeatures.routes'));
router.use('/gamification', require('./gamification.routes'));  
router.use('/recommendations', require('./recc.routes'));// Add this line for session routes:
router.use('/session', require('./session.routes'));  
router.use('/notion', require('./notion.routes')); // Add this line for Notion routes
module.exports = router;
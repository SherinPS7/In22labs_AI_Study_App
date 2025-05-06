const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/plans', require('./plans.routes'));

router.use('/streaks', require('./streak.routes'));
router.use('/integrations', require('./integrations.routes'));

router.use('/features', require('./userFeatures.routes'));
router.use('/gamification', require('./gamification.routes'));  


module.exports = router;
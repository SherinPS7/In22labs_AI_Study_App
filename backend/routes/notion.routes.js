// routes/notion.js

const express = require('express');
const router = express.Router();
const { testConnection,createUserStudyPlan } = require('../controllers/notion.controller');

router.get('/test-notion', testConnection);
router.post('/create-user-plan', createUserStudyPlan);

module.exports = router;

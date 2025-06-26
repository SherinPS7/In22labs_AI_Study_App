const express = require("express");
const router = express.Router();

const reccController = require("../controllers/recc.controller");

// Route: GET /api/recommendations/:userId
router.get("/:userId", reccController.getRecommendations);

module.exports = router;

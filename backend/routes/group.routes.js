// const express = require('express');
// const router = express.Router();
// const GroupController = require('../controllers/group.controller');

// // POST /api/group/create
// router.post('/create', GroupController.createGroup);

// // POST /api/group/join
// router.post('/join', GroupController.joinGroup);
// router.get('/:groupId/members', GroupController.getGroupMembers);
// router.get('/:groupId/leaderboard', GroupController.getGroupLeaderboard);
// router.post('/leave', GroupController.leaveGroup);
// // ✅ New
// router.get('/mystatus', GroupController.getMyGroupStatus);
// router.post('/sync', GroupController.resyncStudyPlanFromGroup);
// module.exports = router;
const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/group.controller');

// ✅ Create a group
router.post('/create', GroupController.createGroup);

// ✅ Join group by code
router.post('/join', GroupController.joinGroup);

// ✅ Share selected plans to group (admin only)
router.post('/add-plan', GroupController.addPlansToGroup);

// ✅ Get current group and study plan
router.get('/mystatus', GroupController.getMyGroupStatus);

// ✅ Resync current user's study plan from admin
router.post('/resync', GroupController.resyncStudyPlanFromGroup);

// ✅ Get group leaderboard (based on completed study)
router.get('/leaderboard/:groupId', GroupController.getGroupLeaderboard);

// ✅ Get all members of a group
router.get('/members/:groupId', GroupController.getGroupMembers);

// ✅ Leave group
router.post('/leave', GroupController.leaveGroup);
router.get('/mygroups', GroupController.getMyGroups);

module.exports = router;

const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfile.controller");

// -- Follow / Unfollow --

// Follow or send follow request if private
router.post("/follow/:userId", userProfileController.followUser);

// Unfollow user
router.delete("/unfollow/:userId", userProfileController.unfollowUser);

// -- Follow Requests --

// Cancel a sent follow request
router.delete("/requests/:userId", userProfileController.cancelFollowRequest);

// Get incoming pending follow requests for current user
router.get("/requests/pending", userProfileController.getPendingFollowRequests);

// Accept a follow request
router.post("/requests/accept/:followerId", userProfileController.acceptFollowRequest);

// Reject a follow request
router.post("/requests/reject/:followerId", userProfileController.rejectFollowRequest);

// -- Followers / Following --

// Get followers list for user
router.get("/:userId/followers", userProfileController.getFollowers);

// Get following list for user
router.get("/:userId/following", userProfileController.getFollowing);

// -- Profile --

// Get user profile info
router.get("/:userId", userProfileController.getUserProfile);

// Update user profile info (bio, email, visibility)
router.patch("/:userId", userProfileController.updateUserProfile);


router.get('/:userId/accomplishments', userProfileController.getUserAccomplishments);
module.exports = router;

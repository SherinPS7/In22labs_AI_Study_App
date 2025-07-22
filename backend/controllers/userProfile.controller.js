const { User, Follow, FollowRequest,QuizAttempt, Course } = require("../models");
const { Op } = require("sequelize");

// Helper: check if viewer can see target's follow lists
async function canViewFollowData(targetUserId, viewerUserId) {
  if (targetUserId === viewerUserId) return true;

  const targetUser = await User.findByPk(targetUserId, { attributes: ["is_public"] });
  if (!targetUser) throw new Error("User not found");
  if (targetUser.is_public) return true;

  const acceptedFollow = await Follow.findOne({
    where: { followerId: viewerUserId, followingId: targetUserId },
  });

  return Boolean(acceptedFollow);
}

// GET profile details
exports.getUserProfile = async (req, res) => {
  try {
    const requestedUserId = parseInt(req.params.userId, 10);
    const sessionUserId = req.session.userId;

    if (!sessionUserId) return res.status(401).json({ error: "Unauthorized" });
    if (isNaN(requestedUserId)) return res.status(400).json({ error: "Invalid ID" });

    const user = await User.findByPk(requestedUserId, {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "bio",
        "is_public",
        "follower_count",
        "following_count",
        "created_at",
        "updated_at",
      ],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isFollowing = await Follow.findOne({
      where: { followerId: sessionUserId, followingId: requestedUserId },
    });

    const hasPendingRequest = await FollowRequest.findOne({
      where: { followerId: sessionUserId, followingId: requestedUserId, status: "pending" },
    });

    res.json({
      id: user.id,
      name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      email: sessionUserId === requestedUserId ? user.email : null,
      bio: user.bio,
      is_public: user.is_public,
      follower_count: user.follower_count,
      following_count: user.following_count,
      joined_on: user.created_at,
      updated_at: user.updated_at,
      is_following: Boolean(isFollowing),
      has_pending_request: Boolean(hasPendingRequest),
    });
  } catch (error) {
    console.error("[getUserProfile] Error:", error);
    res.status(500).json({ error: "Server error fetching profile" });
  }
};

// PATCH update profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { bio, is_public, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const wasPrivate = !user.is_public;

    if (bio !== undefined) user.bio = bio;
    if (email !== undefined) user.email = email;
    if (is_public !== undefined) user.is_public = is_public;

    await user.save();

    // Auto accept pending requests if user switched to public
    if (wasPrivate && user.is_public) {
      const pending = await FollowRequest.findAll({
        where: { followingId: userId, status: "pending" },
      });

      for (const req of pending) {
        await Follow.create({ followerId: req.followerId, followingId: userId });
        await User.increment("follower_count", { where: { id: userId } });
        await User.increment("following_count", { where: { id: req.followerId } });
        await req.destroy();
      }
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("[updateUserProfile] Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// POST follow or send follow request if private
exports.followUser = async (req, res) => {
  try {
    const followerId = req.session.userId;
    const followingId = parseInt(req.params.userId, 10);

    if (!followerId) return res.status(401).json({ error: "Unauthorized" });
    if (followerId === followingId)
      return res.status(400).json({ error: "Cannot follow yourself" });

    const target = await User.findByPk(followingId);
    if (!target) return res.status(404).json({ error: "User not found" });

    const existingFollow = await Follow.findOne({
      where: { followerId, followingId },
    });
    if (existingFollow)
      return res.status(400).json({ error: "Already following" });

    if (!target.is_public) {
      const existingRequest = await FollowRequest.findOne({
        where: { followerId, followingId, status: "pending" },
      });
      if (existingRequest)
        return res.status(400).json({ error: "Follow request already sent" });

      await FollowRequest.create({ followerId, followingId, status: "pending" });
      return res.json({ message: "Follow request sent" });
    }

    await Follow.create({ followerId, followingId });
    await User.increment("follower_count", { where: { id: followingId } });
    await User.increment("following_count", { where: { id: followerId } });

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error("[followUser] Error:", err);
    res.status(500).json({ error: "Follow failed" });
  }
};

// DELETE unfollow and delete any request
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.session.userId;
    const followingId = parseInt(req.params.userId, 10);
    if (!followerId) return res.status(401).json({ error: "Unauthorized" });

    const deleted = await Follow.destroy({
      where: { followerId, followingId },
    });
    await FollowRequest.destroy({
      where: { followerId, followingId },
    });

    if (deleted) {
      await User.decrement("follower_count", { where: { id: followingId } });
      await User.decrement("following_count", { where: { id: followerId } });
    }

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("[unfollowUser] Error:", err);
    res.status(500).json({ error: "Unfollow failed" });
  }
};

// GET followers list for target user with access check
exports.getFollowers = async (req, res) => {
  try {
    const sessionUserId = req.session.userId;
    const requestedUserId = parseInt(req.params.userId, 10);

    if (!sessionUserId) return res.status(401).json({ error: "Unauthorized" });

    const canView = await canViewFollowData(requestedUserId, sessionUserId);
    if (!canView) return res.status(403).json({ error: "Access denied" });

    const followers = await User.findAll({
      include: [
        {
          model: Follow,
          as: "FollowingFollows",
          where: { followingId: requestedUserId },
          attributes: [],
        },
      ],
      attributes: ["id", "first_name", "last_name", "email"],
    });

    const formatted = followers.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`.trim(),
      email: u.email,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[getFollowers] Error:", err);
    res.status(500).json({ error: "Failed to fetch followers" });
  }
};

// GET following list for target user with access check
exports.getFollowing = async (req, res) => {
  try {
    const sessionUserId = req.session.userId;
    const requestedUserId = parseInt(req.params.userId, 10);

    if (!sessionUserId) return res.status(401).json({ error: "Unauthorized" });

    const canView = await canViewFollowData(requestedUserId, sessionUserId);
    if (!canView) return res.status(403).json({ error: "Access denied" });

    const following = await User.findAll({
      include: [
        {
          model: Follow,
          as: "FollowerFollows",
          where: { followerId: requestedUserId },
          attributes: [],
        },
      ],
      attributes: ["id", "first_name", "last_name", "email"],
    });

    const formatted = following.map((u) => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`.trim(),
      email: u.email,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[getFollowing] Error:", err);
    res.status(500).json({ error: "Failed to fetch following list" });
  }
};

// GET pending follow requests to current logged-in user
exports.getPendingFollowRequests = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const requests = await FollowRequest.findAll({
      where: { followingId: userId, status: "pending" },
      include: [
        {
          model: User,
          as: "Follower",
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = requests.map((r) => ({
      id: r.Follower.id,
      name: `${r.Follower.first_name} ${r.Follower.last_name}`.trim(),
      email: r.Follower.email,
      requested_at: r.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[getPendingFollowRequests] Error:", err);
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
};

// POST accept follow request
exports.acceptFollowRequest = async (req, res) => {
  try {
    const followingId = req.session.userId;
    const followerId = parseInt(req.params.followerId, 10);

    const request = await FollowRequest.findOne({
      where: { followerId, followingId, status: "pending" },
    });
    if (!request) return res.status(404).json({ error: "Request not found" });

    await Follow.create({ followerId, followingId });
    await User.increment("follower_count", { where: { id: followingId } });
    await User.increment("following_count", { where: { id: followerId } });
    await request.destroy();

    res.json({ message: "Follow request accepted" });
  } catch (err) {
    console.error("[acceptFollowRequest] Error:", err);
    res.status(500).json({ error: "Failed to accept request" });
  }
};

// POST reject follow request
exports.rejectFollowRequest = async (req, res) => {
  try {
    const followingId = req.session.userId;
    const followerId = parseInt(req.params.followerId, 10);

    const request = await FollowRequest.findOne({
      where: { followerId, followingId, status: "pending" },
    });
    if (!request) return res.status(404).json({ error: "Request not found" });

    await request.destroy();
    res.json({ message: "Follow request rejected" });
  } catch (err) {
    console.error("[rejectFollowRequest] Error:", err);
    res.status(500).json({ error: "Failed to reject request" });
  }
};

// DELETE cancel follow request (sent by you)
exports.cancelFollowRequest = async (req, res) => {
  try {
    const followerId = req.session.userId;
    const followingId = parseInt(req.params.userId, 10);

    const request = await FollowRequest.findOne({
      where: { followerId, followingId, status: "pending" },
    });
    if (!request) return res.status(404).json({ error: "Request not found" });

    await request.destroy();
    res.json({ message: "Follow request canceled" });
  } catch (err) {
    console.error("[cancelFollowRequest] Error:", err);
    res.status(500).json({ error: "Failed to cancel follow request" });
  }
};

// controllers/userProfileController.js


exports.getUserAccomplishments = async (req, res) => {
  const userId = req.params.userId;

  try {
    const attempts = await QuizAttempt.findAll({
      where: {
        user_id: userId,
        passed: true
      },
      include: [{
        model: Course,
        attributes: ['id', 'course_name']
      }]
    });

    // Get unique courses by course_id
    const seen = new Set();
    const uniqueCourses = [];
    for (const attempt of attempts) {
      if (attempt.Course && !seen.has(attempt.Course.id)) {
        uniqueCourses.push(attempt.Course);
        seen.add(attempt.Course.id);
      }
    }

    res.json(uniqueCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch accomplishments' });
  }
};

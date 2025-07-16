const { User } = require('../models');

// GET user profile
exports.getUserProfile = async (req, res) => {
  const userId = req.session.userId;
 console.log('Session userId:', req.session.userId);
  try {
    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'first_name',
        'last_name',
        'bio',
        'is_public',
        'follower_count',
        'following_count',
        'created_at',
        'updated_at'
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

    res.json({
      id: user.id,
      name: fullName,
      bio: user.bio,
      is_public: user.is_public,
      follower_count: user.follower_count,
      following_count: user.following_count,
      joined_on: user.created_at,
      updated_at: user.updated_at,
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// PATCH update user profile (bio, is_public)
exports.updateUserProfile = async (req, res) => {
  const userId = req.session.userId;
  const { bio, is_public } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (bio !== undefined) user.bio = bio;
    if (is_public !== undefined) user.is_public = is_public;

    await user.save();

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

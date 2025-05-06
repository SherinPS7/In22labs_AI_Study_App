const { UserFeatures } = require('../models');

// Create or update user feature
exports.setUserFeature = async (req, res) => {
  try {
    const { feature_name, value } = req.body;
    const userId = req.user.id; // Assuming you have the user's ID from authentication

    // Check if the user already has the feature set
    let userFeature = await UserFeatures.findOne({
      where: { user_id_foreign_key: userId, feature_name },
    });

    if (userFeature) {
      // If the feature already exists, update it
      userFeature.value = value;
      await userFeature.save();
    } else {
      // If it doesn't exist, create a new feature
      userFeature = await UserFeatures.create({
        feature_name,
        value,
        user_id_foreign_key: userId,
      });
    }

    res.status(200).json({ message: 'Feature updated successfully', userFeature });
  } catch (err) {
    res.status(500).json({ error: 'Failed to set user feature', details: err.message });
  }
};

// Get all user features (preferences)
exports.getUserFeatures = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have the user's ID from authentication

    // Retrieve all features for the user
    const features = await UserFeatures.findAll({ where: { user_id_foreign_key: userId } });

    res.status(200).json({ features });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user features', details: err.message });
  }
};

// Get a specific user feature
exports.getUserFeature = async (req, res) => {
  try {
    const { feature_name } = req.params;
    const userId = req.user.id; // Assuming you have the user's ID from authentication

    // Retrieve a specific feature for the user
    const feature = await UserFeatures.findOne({
      where: { user_id_foreign_key: userId, feature_name },
    });

    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    res.status(200).json({ feature });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user feature', details: err.message });
  }
};

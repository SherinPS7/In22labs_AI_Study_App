const { UserFeatures, User } = require('../models'); // Import the models

// Save selected features to DB
const saveFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    console.log("Received features:", features);

    if (!Array.isArray(features) || features.length === 0) {
      console.log("Error: Invalid or empty feature list");
      return res.status(400).json({ error: "Invalid or empty feature list" });
    }
const userId = `1`;

    console.log("Session user ID:", userId);

    if (!userId) {
      console.log("Error: Unauthorized - no user ID in session");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log(`Error: User not found with id ${userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    const existingFeatures = await UserFeatures.findOne({ where: { user_id: userId } });
    if (existingFeatures) {
      // Optionally update existing features instead of creating duplicates
      console.log(`Updating existing features for user ${userId}`);
      existingFeatures.selected_features = features;
      await existingFeatures.save();
    } else {
      console.log(`Creating new features record for user ${userId}`);
      await UserFeatures.create({
        user_id: userId,
        selected_features: features,
      });
    }

    console.log("Features saved successfully for user:", userId);
    return res.status(201).json({ message: "Features saved successfully" });

  } catch (err) {
    console.error("Error saving features:", err);
    return res.status(500).json({ error: "Internal server error", detail: err.message });
  }
};

module.exports = { saveFeatures };

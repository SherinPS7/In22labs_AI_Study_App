const { UserFeatures } = require('../models');  // Import the UserFeatures model

// Save selected features to DB
const saveFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    console.log("📥 Received features:", features);

    if (!Array.isArray(features) || features.length === 0) {
      return res.status(400).json({ error: "Invalid or empty feature list" });
    }

    const userId = '8'; // dummy UUID

    // Insert features for the user using Sequelize
    await UserFeatures.create({
      user_id: userId,  // Assuming user_id is the reference to the User
      selected_features: features,  // The features array is inserted as is
    });

    console.log("✅ Features saved successfully");
    res.status(201).json({ message: "Features saved successfully" });
  } catch (err) {
    console.error("❌ Error saving features:", err.message);
    res.status(500).json({ error: "Internal server error", detail: err.message });
  }
};

module.exports = {
  saveFeatures,
};

module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define("Follow", {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['followerId', 'followingId']
      }
    ]
  });

  // No need for additional associations here since 
  // they're handled in the User model's belongsToMany
Follow.associate = (models) => {
  Follow.belongsTo(models.User, { foreignKey: 'followerId', as: 'Follower' });
  Follow.belongsTo(models.User, { foreignKey: 'followingId', as: 'Following' });
};

  return Follow;
};
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: DataTypes.STRING(50),
    last_name: DataTypes.STRING(50),
    mobile: DataTypes.STRING(10),
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    password: DataTypes.STRING(255),
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    follower_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    following_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    google_tokens: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    google_calendar_connected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  User.associate = models => {
    User.hasMany(models.Course, { foreignKey: 'user_id_foreign_key' });
    User.hasMany(models.Streak, { foreignKey: 'user_id' });
    User.hasMany(models.StudyPlan, { foreignKey: 'user_id_foreign_key' });
    User.hasMany(models.QuizScore, { foreignKey: 'user_id_foreign_key' });
    User.hasMany(models.AssessmentScore, { foreignKey: 'user_id_foreign_key' });
    User.hasMany(models.ToDoList, { foreignKey: 'user_id_foreign_key' });

    // ⬇️ Follow Relationships
    User.belongsToMany(models.User, {
      through: models.Follow,
      as: "Followers",
      foreignKey: "followingId",
      otherKey: "followerId"
    });

    User.belongsToMany(models.User, {
      through: models.Follow,
      as: "Following",
      foreignKey: "followerId",
      otherKey: "followingId"
    });

    // ⬇️ Direct Follow associations for eager loading
    User.hasMany(models.Follow, { foreignKey: 'followerId', as: 'FollowingFollows' });
    User.hasMany(models.Follow, { foreignKey: 'followingId', as: 'FollowerFollows' });

    // Follow Requests
    User.belongsToMany(models.User, {
      through: models.FollowRequest,
      as: "RequestedFollowers",
      foreignKey: "followingId"
    });

    User.belongsToMany(models.User, {
      through: models.FollowRequest,
      as: "RequestedFollowing",
      foreignKey: "followerId"
    });
    User.hasMany(models.StudyPlan, { foreignKey: 'user_id_foreign_key' });
 
     User.hasMany(models.Group, { foreignKey: 'created_by' }); // Groups created by this user
    User.hasMany(models.GroupMember, { foreignKey: 'user_id' }); // Memberships
    User.hasMany(models.GroupJoinRequest, { foreignKey: 'user_id' }); // Join requests
    User.hasMany(models.GroupMessage, { foreignKey: 'sender_id' }); // Messages sent
    User.hasMany(models.GroupFile, { foreignKey: 'user_id' }); // Files uploaded

  };


  return User;
};

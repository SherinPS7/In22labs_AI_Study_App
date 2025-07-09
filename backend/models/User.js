module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
     {
    first_name: DataTypes.STRING(50),
    last_name: DataTypes.STRING(50),
    mobile: DataTypes.STRING(10),
   
    password: DataTypes.STRING(255),
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
    // User.hasMany(models.UserFeatures, { foreignKey: 'user_id_foreign_key' });
    User.hasMany(models.ToDoList, { foreignKey: 'user_id_foreign_key' });
    User.hasMany(models.StudyPlan, {foreignKey: 'user_id_foreign_key'});
  };

  return User;
};

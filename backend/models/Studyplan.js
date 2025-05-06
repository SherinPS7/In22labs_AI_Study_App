module.exports = (sequelize, DataTypes) => {
  const StudyPlan = sequelize.define('StudyPlan', {
    plan_name: DataTypes.STRING,
    user_id_foreign_key: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    weekdays: DataTypes.STRING,  
    study_time: DataTypes.TIME,
  });

  StudyPlan.associate = models => {
    StudyPlan.belongsTo(models.User, { foreignKey: 'user_id_foreign_key' });
  };

  return StudyPlan;
};

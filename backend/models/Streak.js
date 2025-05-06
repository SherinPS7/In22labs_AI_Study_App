module.exports = (sequelize, DataTypes) => {
  const Streak = sequelize.define('Streak', {
    last_active_date: DataTypes.DATE,
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    user_id: DataTypes.INTEGER,
  });

  Streak.associate = models => {
    Streak.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Streak;
};

module.exports = (sequelize, DataTypes) => {
    const UserFeatures = sequelize.define('UserFeatures', {
     selected_feature: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      user_id_foreign_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    UserFeatures.associate = models => {
      UserFeatures.belongsTo(models.User, { foreignKey: 'user_id_foreign_key' });
    };
  
    return UserFeatures;
  };
  
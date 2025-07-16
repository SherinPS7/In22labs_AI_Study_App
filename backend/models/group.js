'use strict';

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    creator_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Groups',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Group.associate = function(models) {
    Group.belongsTo(models.User, { foreignKey: 'creator_user_id' });
    Group.hasMany(models.GroupMember, { foreignKey: 'group_id' });
  };

  return Group;
};

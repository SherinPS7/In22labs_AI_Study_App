'use strict';

module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'GroupMembers',
    timestamps: false
  });

  GroupMember.associate = function(models) {
    GroupMember.belongsTo(models.Group, { foreignKey: 'group_id' });
    GroupMember.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return GroupMember;
};

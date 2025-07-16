'use strict';

module.exports = (sequelize, DataTypes) => {
  const StudyPlan = sequelize.define('StudyPlan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    plan_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    group_id: {
  type: DataTypes.INTEGER,
  allowNull: true
},

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    weekdays: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    study_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // ADD THESE NEW FIELDS
    course_ids: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    course_settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    course_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'StudyPlans', 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  StudyPlan.associate = function(models) {
    // Add associations if you have a User model
    // StudyPlan.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return StudyPlan;
};
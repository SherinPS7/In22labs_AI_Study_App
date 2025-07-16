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
    },
    // ✅ NEW FIELDS
    sync_with_notion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sync_with_google: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'StudyPlans', 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  StudyPlan.associate = function(models) {
    // StudyPlan.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return StudyPlan;
};

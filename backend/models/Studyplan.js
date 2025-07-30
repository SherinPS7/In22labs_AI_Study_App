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

    // New column to store study plan start time (clock time as "HH:mm")
    start_time: {
      type: DataTypes.STRING,       // Store time as "HH:mm" string
      allowNull: true,              // Make it nullable if optional
      validate: {
        is: /^([01]\d|2[0-3]):([0-5]\d)$/  // Validates "HH:mm" format
      }
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
   
    save_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    google_event_id: {
      type: DataTypes.STRING,
      allowNull: true,  // can be null if no Google event created
    },


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

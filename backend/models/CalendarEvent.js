// models/CalendarEvent.js
module.exports = (sequelize, DataTypes) => {
  const CalendarEvent = sequelize.define('CalendarEvent', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    summary: DataTypes.STRING,
    description: DataTypes.TEXT,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    days: DataTypes.ARRAY(DataTypes.STRING),
    durationInDays: DataTypes.INTEGER,
  });

  return CalendarEvent;
};

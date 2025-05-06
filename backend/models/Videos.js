module.exports = (sequelize, DataTypes) => {
    const Videos = sequelize.define('Videos', {
      video_title: DataTypes.STRING,
      video_link: DataTypes.STRING,
  
      video_author: DataTypes.STRING,
      video_likes: DataTypes.STRING,

      course_id_foreign_key: DataTypes.INTEGER,
    });
  
    Videos.associate = models => {
      Videos.belongsTo(models.Course, { foreignKey: 'course_id_foreign_key' });
    };
  
    return Videos;
  };
  
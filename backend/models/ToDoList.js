module.exports = (sequelize, DataTypes) => {
    const ToDoList = sequelize.define('ToDoList', {
      task_title: DataTypes.STRING,
      time: DataTypes.TIME,
      description: DataTypes.STRING,
      user_id_foreign_key: DataTypes.INTEGER,  // Added FK to User
    });
  
    ToDoList.associate = models => {
      ToDoList.belongsTo(models.User, { foreignKey: 'user_id_foreign_key' });
    };
  
    return ToDoList;
  };
  
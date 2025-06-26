const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/postgres');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all models
db.User = require('./User')(sequelize, DataTypes);
db.QuizScore = require('./QuizScore')(sequelize, DataTypes);
db.AssessmentScore = require('./AssessmentScore')(sequelize, DataTypes);
db.Course = require('./Course')(sequelize, DataTypes);
db.Keywords = require('./Keywords')(sequelize, DataTypes);
db.Videos = require('./Videos')(sequelize, DataTypes);
db.Streak = require('./streak')(sequelize, DataTypes);
db.StudyPlan = require('./Studyplan')(sequelize, DataTypes);
db.UserFeatures = require('./UserFeatures')(sequelize, DataTypes);
db.ToDoList = require('./ToDoList')(sequelize, DataTypes);

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

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
db.StudyPlan = require('./StudyPlan')(sequelize, DataTypes); // Fixed: was StudyPlans, now StudyPlan
db.UserFeatures = require('./UserFeatures')(sequelize, DataTypes);
db.ToDoList = require('./ToDoList')(sequelize, DataTypes);
db.QuizAttempt = require('./QuizAttempt')(sequelize, DataTypes);

// StudyProgress now follows standard pattern
db.StudyProgress = require('./StudyProgress')(sequelize, DataTypes);
db.Group = require('./group')(sequelize, DataTypes);
db.GroupMember = require('./GroupMember')(sequelize, DataTypes);
// Set up associations - with proper error checking
Object.keys(db).forEach(modelName => {
  // Skip Sequelize and sequelize properties, and check if associate function exists
  if (modelName !== 'Sequelize' && modelName !== 'sequelize' && db[modelName] && typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// TEMPORARY: Comment out all manual associations to debug
// Debug: Check what each model actually is before setting up associations
console.log('=== MODELS DEBUG ===');
Object.keys(db).forEach(key => {
  if (key !== 'Sequelize' && key !== 'sequelize') {
    console.log(`${key}:`, !!db[key], typeof db[key], db[key]?.name);
    if (db[key] && typeof db[key].hasMany === 'function') {
      console.log(`  ${key} has hasMany method`);
    }
    if (db[key] && typeof db[key].belongsTo === 'function') {
      console.log(`  ${key} has belongsTo method`);
    }
  }
});
console.log('=== END DEBUG ===');

// COMMENTED OUT FOR DEBUGGING - UNCOMMENT ONCE MODELS ARE WORKING
/*
// Only set up associations if all models are properly defined
if (db.User && db.StudyProgress && typeof db.User.hasMany === 'function') {
  db.User.hasMany(db.StudyProgress, { 
    foreignKey: 'user_id',
    as: 'studyProgress'
  });
}

if (db.StudyPlan && db.StudyProgress && typeof db.StudyPlan.hasMany === 'function') {
  db.StudyPlan.hasMany(db.StudyProgress, { 
    foreignKey: 'plan_id', // or 'study_plan_id' - check your StudyProgress model
    as: 'studyProgress'
  });
}

if (db.StudyProgress && db.User && typeof db.StudyProgress.belongsTo === 'function') {
  db.StudyProgress.belongsTo(db.User, { 
    foreignKey: 'user_id',
    as: 'user'
  });
}

if (db.StudyProgress && db.StudyPlan && typeof db.StudyProgress.belongsTo === 'function') {
  db.StudyProgress.belongsTo(db.StudyPlan, { 
    foreignKey: 'plan_id', // or 'study_plan_id' - check your StudyProgress model
    as: 'studyPlan'
  });
}
*/

// Alternative associations (uncomment if you prefer these)
// db.StudyPlan.hasMany(db.StudyProgress, {
//   foreignKey: 'study_plan_id',
//   as: 'progress'
// });

// db.StudyProgress.belongsTo(db.StudyPlan, {
//   foreignKey: 'study_plan_id',
//   as: 'studyPlan'
// });

module.exports = db;
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
//const session = require('express-session');
//const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sessionMiddleware, initSessionStore } = require('./config/session');


const routes = require('./routes/index.routes');  // Correct path to your index routes
//const streakRoutes = require('./routes/streak');  // Import your streak routes

// Ensure all necessary env variables are set
if (!process.env.DB_NAME || !process.env.DB_PASSWORD ) {
  console.error('Missing essential environment variables. Check .env file.');
  process.exit(1);
}

// Initialize Firebase Admin (from config/)
const sequelize = require('./config/postgres');

// Create Express app
const app = express();
// Enable CORS for specific origin
app.use(cors({
  //origin: '*',  // This allows requests from your frontend URL
  origin:'http://localhost:5173',
  credentials: true,  // If you're using cookies or authentication headers
}));
app.use(express.json()); 

app.use(sessionMiddleware);

initSessionStore();

app.use('/api', routes);




// Built-in JSON parser
app.use(express.urlencoded({ extended: true }));

// Database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

// Sync models with the database
sequelize.sync({force: false}) // Set to true only for development
  .then(() => console.log('Database schema synced'))
  .catch(err => console.error('Database sync error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
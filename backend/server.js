
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { sessionMiddleware, initSessionStore } = require('./config/session');
const routes = require('./routes/index.routes');  // Correct path to your index routes
const sequelize = require('./config/postgres');

// Create Express app
const app = express();

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,              // Required to pass cookies
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(sessionMiddleware);
initSessionStore();



// Mount routes
app.use('/api', routes);


// DB connect
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error(' Database connection error:', err));

// Sync models
sequelize.sync({ alter:true})//alter:true
  .then(() => console.log(' Database schema synced'))
  .catch(err => console.error(' Database sync error:', err));

// Error middleware
app.use((err, req, res, next) => {
  console.error(' Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server listening on port ${PORT}`);
});

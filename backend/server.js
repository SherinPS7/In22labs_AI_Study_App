require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.routes');  // Correct path to your index routes

if (!process.env.DB_NAME || !process.env.DB_PASSWORD || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Missing essential environment variables. Check .env file.');
  process.exit(1);
}

// Initialize Firebase Admin (from config/)
const sequelize = require('./config/postgres');

// Create Express app
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,  // If you're using cookies or authentication headers
}));
app.use(express.json()); 
app.use('/api', routes);



// Built-in JSON parser
app.use(express.urlencoded({ extended: true }));

// Database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

// Sync models with the database
sequelize.sync({force: false}) // Set to true for development to drop and recreate tables
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

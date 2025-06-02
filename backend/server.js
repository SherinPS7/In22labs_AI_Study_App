// require('dotenv').config(); // Load environment variables
// const express = require('express');
// const cors = require('cors');
// const routes = require('./routes/index.routes');  // Correct path to your index routes

// if (!process.env.DB_NAME || !process.env.DB_PASSWORD) {
//   console.error('Missing essential environment variables. Check .env file.');
//   process.exit(1);
// }

// // Initialize Firebase Admin (from config/)

// const sequelize = require('./config/postgres');

// // Create Express app
// const app = express();
// app.use('/api', routes);
// app.use(cors());
// app.use(express.json());  // Built-in JSON parser
// app.use(express.urlencoded({ extended: true }));

// // Database connection
// sequelize.authenticate()
//   .then(() => console.log('Database connected successfully'))
//   .catch(err => console.error('Database connection error:', err));

// // Sync models with the database
// sequelize.sync({ force: false })
//   .then(() => console.log('Database schema synced'))
//   .catch(err => console.error('Database sync error:', err));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// app.get('/test-firebase', async (req, res) => {
//   try {
//     // Check if Firebase Admin SDK is initialized properly
//     const time = new Date();
//     res.json({ message: 'Firebase connection successful', time });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({ error: 'Endpoint not found' });
// });



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.routes');  // Correct path to your index routes

// Ensure all necessary env variables are set
if (!process.env.DB_NAME || !process.env.DB_PASSWORD || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Missing essential environment variables. Check .env file.');
  process.exit(1);
}

// Initialize Firebase Admin (from config/)

const sequelize = require('./config/postgres');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());  // Built-in JSON parser
app.use('/api', routes);
app.use(express.urlencoded({ extended: true }));

// Database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

// Sync models with the database
sequelize.sync({alter : true})
  .then(() => console.log('Database schema synced'))
  .catch(err => console.error('Database sync error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Firebase connection test endpoint
app.get('/test-firebase', async (req, res) => {
  try {
    // Check if Firebase Admin SDK is initialized properly
    const time = new Date();
    res.json({ message: 'Firebase connection successful', time });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

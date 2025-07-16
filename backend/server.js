
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { sessionMiddleware, initSessionStore } = require('./config/session');
const routes = require('./routes/index.routes');
const sequelize = require('./config/postgres');
// Fix: Use require instead of import
const todoRoutes = require('./routes/todolist.routes');
const studyPlanRoutes = require('./routes/studyPlan.routes');
const studyProgressRoutes = require('./routes/studyProgress');



if (!process.env.DB_NAME || !process.env.DB_PASSWORD ) {
  console.error('Missing essential environment variables. Check .env file.');
  process.exit(1);
}

const app = express();
app.use('/certificates', express.static('public/certificates'));
// Enable CORS for specific origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session Middleware
app.use(sessionMiddleware);
initSessionStore();

// ✅ Mount routes under /api
app.use('/api', routes);
// Add todo routes specifically
app.use('/api/todos', todoRoutes);
// add routes for study planner










//get username
app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = 'SELECT id, name FROM Users WHERE id = $1';
    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User found',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// ✅ Health check (optional)
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});




// Built-in JSON parser
app.use(express.urlencoded({ extended: true }));

// Database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  
  .catch(err => console.error('Database connection error:', err));
   require('./utils/cleanup');


app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(' Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Start server and connect DB
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Listening on port ${PORT}`);
      
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});



require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { sessionMiddleware, initSessionStore } = require('./config/session');
const routes = require('./routes/index.routes');
const sequelize = require('./config/postgres');
// Fix: Use require instead of import
const todoRoutes = require('./routes/todolist.routes');
const studyPlanRoutes = require('./routes/studyPlan.routes');
const studyProgressRoutes = require('./routes/studyProgress');





const app = express();

// ✅ Enable CORS for frontend (5173) and allow credentials
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

// Sync models with the database
sequelize.sync({alter: true}) // Set to true only for development alter: true force: false
  .then(() => console.log('Database schema synced'))
  .catch(err => console.error('Database sync error:', err));
// ✅ Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Start server and connect DB
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync({ force: false });
    console.log('✅ Database synced');
    
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Listening on port ${PORT}`);
      // console.log('📋 Available todo routes:');
      // console.log('  GET    /api/todos');
      // console.log('  POST   /api/todos');
      // console.log('  PUT    /api/todos/:id');
      // console.log('  DELETE /api/todos/:id');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();
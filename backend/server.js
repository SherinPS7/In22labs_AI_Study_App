require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { sessionMiddleware, initSessionStore } = require('./config/session');
const routes = require('./routes/index.routes');
const sequelize = require('./config/postgres');
// Fix: Use require instead of import
const todoRoutes = require('./routes/todolist.routes');

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
      console.log('📋 Available todo routes:');
      console.log('  GET    /api/todos');
      console.log('  POST   /api/todos');
      console.log('  PUT    /api/todos/:id');
      console.log('  DELETE /api/todos/:id');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sessionMiddleware, initSessionStore } = require('./config/session');
const routes = require('./routes/index.routes');
const sequelize = require('./config/postgres');
const todoRoutes = require('./routes/todolist.routes');
const studyPlanRoutes = require('./routes/studyPlan.routes');
const studyProgressRoutes = require('./routes/studyProgress');
const path = require('path');



// --- 🚦 Sanity check for env ---
if (!process.env.DB_NAME || !process.env.DB_PASSWORD) {
  console.error('Missing essential environment variables. Check .env file.');
  process.exit(1);
}

// --- Express app setup ---
const app = express();
app.use('/certificates', express.static('public/certificates'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
initSessionStore();

// --- RESTful API routes ---
app.use('/api', routes);
app.use('/api/todos', todoRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/progress', studyProgressRoutes);

// Example: get username (make sure client is imported properly)
app.get('/user/:id', async (req, res) => {
  // ... your SQL logic ...
});

// Health check routes
app.get('/', (req, res) => res.send('Backend is running!'));
app.get('/api', (req, res) => res.json({ message: 'API is working!' }));

// 404 Handler for unknown API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Express error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// --- Database connection (Sequelize) ---
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));
require('./utils/cleanup');

// --- Create HTTP server so we can attach Socket.IO ---
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  }
});



// --- SOCKET.IO LOGIC (basic chat) ---
const { GroupMessage, User } = require('./models'); // adjust as needed

io.on("connection", (socket) => {
  // User joins a group chat room
  socket.on("joinGroup", (groupId) => {
    socket.join("group_" + groupId);
  });

  // User sends a message
  socket.on("groupMessage", async ({ groupId, userId, message }) => {
    try {
      // Persist to DB
      const groupMsg = await GroupMessage.create({
        group_id: groupId,
        sender_id: userId,
        message_text: message,
      });
      // Get sender info
      const senderUser = await User.findByPk(userId, {
        attributes: ["id", "first_name", "last_name"]
      });
      // Compose and broadcast
      const msgObj = {
        id: groupMsg.id,
        message_text: groupMsg.message_text,
        sender: senderUser,
        createdAt: groupMsg.createdAt,
      };
      io.to("group_" + groupId).emit("newMessage", msgObj);
    } catch (err) {
      console.error('Socket.IO groupMessage error:', err);
    }
  });

  // (Optional) Handle leave/disconnect etc.
});

// --- Boot the server (HTTP+Sockets) ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    const PORT = process.env.PORT || 4000;
    http.listen(PORT, () => {
      console.log(`🚀 Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();

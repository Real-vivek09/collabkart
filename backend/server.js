const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

// Custom config imports
const connectDB = require('./config/db');
require('./config/firebaseAdmin'); // Firebase Admin SDK initialize kar dega

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const paymentRoutes = require('./routes/payment');
const dashboardRoutes = require('./routes/dashboard');
const messageRoutes = require('./routes/messages');
const newsletterRoutes = require('./routes/newsletter');

// Connect to MongoDB database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io initialize with CORS for frontend origin
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware setup
app.use(cors());
app.use(express.json());

// Make io accessible to routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API route setup
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CollabKart API' });
});

// Socket.io realtime connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Listen for joinRoom event with userId to create private rooms
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
  });

  // Listen for sending messages to rooms (optional - implement event in messageRoutes/controller)
  socket.on('sendMessage', ({ receiverId, message }) => {
    io.to(receiverId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

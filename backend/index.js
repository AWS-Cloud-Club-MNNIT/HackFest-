import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './src/config/db.js';

import { startKeepAliveCron } from './cron.js';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server wrapping the Express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

// Basic Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected via socket: ${socket.id}`);

  // Listen for user registering their socket
  socket.on('register', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined room user:${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Attach io to the app so we can use it in controllers/routes
app.set('io', io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Start the Render keep-alive cron job
  startKeepAliveCron();
});
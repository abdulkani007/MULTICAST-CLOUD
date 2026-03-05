const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const routes = require('./routes');
const { initializeSocketHandler } = require('./socketHandler');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Initialize socket handler
initializeSocketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🎥 IPCCTV Streaming System initialized`);
});

module.exports = { io };

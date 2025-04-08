const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import configuration
const config = process.env.NODE_ENV === 'production' 
  ? require('../config/production')
  : require('../config/development');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.server.corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: config.server.corsOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.logging.format));

// Connect to MongoDB
mongoose.connect(config.database.uri, config.database.options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes (to be implemented)
app.use('/api/agents', require('./api/agents'));
app.use('/api/memory', require('./api/memory'));
app.use('/api/projects', require('./api/projects'));

// Serve static files in production
if (config.server.environment === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Initialize Socket.io handlers
const socketHandler = require('./utils/socket_handler');
socketHandler.initializeSocketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: config.server.environment === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = config.server.port;
server.listen(PORT, () => {
  console.log(`Server running in ${config.server.environment} mode on port ${PORT}`);
});

module.exports = { app, server, io };

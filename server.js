const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const logger = require('./utils/logger');
const routes = require('./routes');
const cors = require('cors'); // Added for handling CORS
const http = require('http');
const socketio = require('socket.io');
const multiplayerService = require('./services/multiplayerService');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    console.error('Please ensure your MONGO_URI is correct in the .env file.');
  });

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS Middleware for handling CORS errors
app.use(cors({
  origin: ['http://localhost:5006', 'https://yourproductiondomain.com'], // Specify allowed origins for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', routes);

// Static files
app.use(express.static('public'));

// Socket.io for real-time communication
io.on('connection', socket => {
  logger.info('New WebSocket connection');

  socket.on('joinGame', async ({ userId, gameId }) => {
    try {
      const game = await multiplayerService.joinGame(userId, gameId);
      socket.join(game.id);
      io.to(game.id).emit('gameUpdate', game);
      logger.info(`User ${userId} joined game ${gameId}`);
    } catch (error) {
      logger.error('Error joining game:', error.message, error.stack);
      socket.emit('error', 'Failed to join game');
    }
  });

  // Additional event listeners for game actions like 'makeMove', 'leaveGame', etc.
  // Placeholder for additional multiplayer event handling

});

const PORT = process.env.PORT || 5006;

server.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
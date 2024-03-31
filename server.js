const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const logger = require('./utils/logger');
const routes = require('./routes');
const cors = require('cors'); // Added for handling CORS

require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

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

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
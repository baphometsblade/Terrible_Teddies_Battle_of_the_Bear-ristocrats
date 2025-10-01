const express = require('express');
const path = require('path');
const logger = require('../utils/logger');

const router = express.Router();

// Root URL route
router.get('/', (req, res) => {
    logger.info('Root URL accessed');
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Home route
router.get('/home', (req, res) => {
    logger.info('Accessed home page');
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

// Route to serve the deck builder page
router.get('/deck-builder', (req, res) => {
    logger.info('Accessed deck builder page');
    res.sendFile(path.join(__dirname, '..', 'views', 'deckBuilder.html'));
});

// Adding routes for battles and profile pages
router.get('/battles', (req, res) => {
    logger.info('Accessed battles page');
    res.sendFile(path.join(__dirname, '..', 'views', 'battles.html'));
});

router.get('/profile', (req, res) => {
    logger.info('Accessed profile page');
    res.sendFile(path.join(__dirname, '..', 'views', 'profile.html'));
});

module.exports = router;

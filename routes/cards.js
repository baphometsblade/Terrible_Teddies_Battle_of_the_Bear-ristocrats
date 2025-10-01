const express = require('express');
const Card = require('../models/cardModel');
const logger = require('../utils/logger');
const teddyBearGenerationService = require('../services/teddyBearGenerationService');

const router = express.Router();

// New route to fetch all cards
router.get('/api/cards', async (req, res) => {
    try {
        const cards = await Card.find({});
        res.json(cards);
    } catch (error) {
        logger.error('Failed to fetch cards:', error.message, error.stack);
        res.status(500).send('Server error while fetching cards');
    }
});

// New route for generating teddy bear metadata and images
router.post('/api/generate-teddy', async (req, res) => {
    try {
        const teddyData = await teddyBearGenerationService.generateTeddyBearMetadata();
        const newTeddy = new Card(teddyData);
        await newTeddy.save();
        logger.info('New teddy bear generated and saved successfully');
        res.json(newTeddy);
    } catch (error) {
        logger.error('Failed to generate teddy bear:', error.message, error.stack);
        res.status(500).send('Server error during teddy bear generation');
    }
});

module.exports = router;

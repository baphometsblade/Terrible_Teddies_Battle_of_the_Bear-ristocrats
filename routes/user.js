const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const logger = require('../utils/logger');
const auth = require('../middleware/auth'); // Assuming an auth middleware exists

// @route   POST api/user/deck
// @desc    Save a user's deck
// @access  Private
router.post('/deck', auth, async (req, res) => {
    try {
        const { deck } = req.body;
        // Basic validation
        if (!deck || !Array.isArray(deck)) {
            return res.status(400).json({ msg: 'Invalid deck data' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // For simplicity, we'll overwrite the first deck.
        // A more advanced implementation would support multiple decks.
        user.decks[0] = deck;
        await user.save();

        res.json({ msg: 'Deck saved successfully' });
    } catch (err) {
        logger.error('Error saving deck:', err.stack);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('./models/userModel');
const Card = require('./models/cardModel');
const logger = require('./utils/logger');
const path = require('path');
const MultiplayerService = require('./services/multiplayerService'); // Importing MultiplayerService

const router = express.Router();

// Root URL route
router.get('/', (req, res) => {
    logger.info('Root URL accessed');
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Registration route
router.post('/register', [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors during registration: ' + JSON.stringify(errors.array()));
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            logger.error('User already exists');
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        logger.info('User registered successfully');

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) {
                logger.error('Error signing JWT token: ' + err.stack);
                return res.status(500).send('Server error during token generation');
            }
            res.json({ token });
        });
    } catch (err) {
        if (err.code === 11000) {
            logger.error('Duplicate key error during user registration: ' + err.stack);
            return res.status(400).json({ errors: [{ msg: 'Username or email already exists. Please choose a different one.' }] });
        }
        logger.error('Server error during user registration: ' + err.stack);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) {
                logger.error('Error signing JWT token: ' + err.stack);
                return res.status(500).send('Server error during token generation');
            }
            res.json({ token });
        });
    } catch (err) {
        logger.error('Server error during user login: ' + err.stack);
        res.status(500).send('Server error');
    }
});

// Temporary route for manual JWT token generation for testing
router.get('/generate-test-token', (req, res) => {
    User.findOne({}).then(user => {
        const payload = {
            user: {
                id: user.id // Automatically using the ID of the first user found
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        logger.info('Test JWT token generated successfully');
        res.json({ token });
    }).catch(error => {
        logger.error('Error fetching user for test JWT token:', error);
        res.status(500).json({ message: 'Failed to generate test JWT token', error: error.message });
    });
});

// Google Auth
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
});

// Home route
router.get('/home', (req, res) => {
    logger.info('Accessed home page');
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

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

// Route to serve the deck builder page
router.get('/deck-builder', (req, res) => {
    logger.info('Accessed deck builder page');
    res.sendFile(path.join(__dirname, 'views', 'deckBuilder.html'));
});

// Adding routes for battles and profile pages
router.get('/battles', (req, res) => {
    logger.info('Accessed battles page');
    res.sendFile(path.join(__dirname, 'views', 'battles.html'));
});

router.get('/profile', (req, res) => {
    logger.info('Accessed profile page');
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Implementing new routes for multiplayer features
router.post('/create-game', async (req, res) => {
    // Placeholder for creating a new game session
    logger.info('Creating a new game session');
    // Implement logic to create a new game session and return session details
    // Remember to handle errors appropriately and log them
    const newGameSession = await MultiplayerService.createGameSession(req.body.userId);
    if (newGameSession.error) {
        logger.error('Error creating game session:', newGameSession.error);
        return res.status(500).json({ message: 'Failed to create game session', error: newGameSession.error });
    }
    res.json(newGameSession);
});

router.post('/join-game', async (req, res) => {
    // Placeholder for joining an existing game session
    logger.info('Joining an existing game session');
    // Implement logic for a player to join an existing game session using session ID
    // Remember to handle errors appropriately and log them
    const joinGameResult = await MultiplayerService.joinGameSession(req.body.sessionId, req.body.userId);
    if (joinGameResult.error) {
        logger.error('Error joining game session:', joinGameResult.error);
        return res.status(500).json({ message: 'Failed to join game session', error: joinGameResult.error });
    }
    res.json(joinGameResult);
});

module.exports = router;
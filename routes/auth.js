const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/userModel');
const logger = require('../utils/logger');

const router = express.Router();

const UserService = require('../services/userService');

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
        const result = await UserService.registerUser(username, email, password);
        res.json(result);
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
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
        const result = await UserService.loginUser(username, password);
        res.json(result);
    } catch (error) {
        if (error.message === 'Invalid Credentials') {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
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

module.exports = router;

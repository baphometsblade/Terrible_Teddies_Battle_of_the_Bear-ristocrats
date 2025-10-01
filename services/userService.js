const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const logger = require('../utils/logger');

class UserService {
    async registerUser(username, email, password) {
        try {
            let user = await User.findOne({ $or: [{ email }, { username }] });
            if (user) {
                throw new Error('User already exists');
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

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
            return { token };
        } catch (error) {
            logger.error('Error during user registration:', error.message);
            throw error;
        }
    }

    async loginUser(username, password) {
        try {
            let user = await User.findOne({ username });
            if (!user) {
                throw new Error('Invalid Credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid Credentials');
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
            return { token };
        } catch (error) {
            logger.error('Error during user login:', error.message);
            throw error;
        }
    }
}

module.exports = new UserService();

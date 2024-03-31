const mongoose = require('mongoose');
const Card = require('./models/cardModel');
const Image = require('./models/imageModel');
const { generateImage, generatePersonalizedDescription } = require('./services/imageGenerationService');
const logger = require('./utils/logger'); // Importing logger for enhanced logging
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

const generateAndSaveImagesForAllCards = async () => {
  try {
    const cards = await Card.find({});
    for (const card of cards) {
      const personalizedDescription = await generatePersonalizedDescription(card._id);
      const imageUrl = await generateImage(personalizedDescription);
      const newImage = new Image({
        cardId: card._id,
        imageUrl,
        imageDescription: personalizedDescription
      });
      await newImage.save();
      logger.info(`Image for card ${card.name} generated and saved successfully.`);
    }
  } catch (error) {
    logger.error('Error generating or saving images for cards:', error.message, error.stack);
  }
};

generateAndSaveImagesForAllCards().then(() => {
  logger.info('All images have been generated and saved successfully.');
  mongoose.disconnect().then(() => logger.info('MongoDB Disconnected'));
}).catch((error) => {
  logger.error('An error occurred during the image generation process:', error.message, error.stack);
  mongoose.disconnect().then(() => logger.info('MongoDB Disconnected'));
});
const mongoose = require('mongoose');
const Card = require('./models/cardModel');
const Image = require('./models/imageModel');
const { generateImage, generatePersonalizedDescription } = require('./services/imageGenerationService');
const logger = require('./utils/logger'); // Importing logger for enhanced logging
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => {
    logger.error('MongoDB connection error:', err.message, err.stack);
  });

const generateAndSaveImagesForAllCards = async () => {
  try {
    const cards = await Card.find({});
    for (const card of cards) {
      // Check if an image already exists for the current card
      const existingImage = await Image.findOne({ cardId: card._id });
      if (existingImage) {
        logger.info(`Image already exists for card ${card.name}, skipping image generation.`);
        continue; // Skip to the next iteration if an image already exists
      }

      const personalizedDescription = await generatePersonalizedDescription(card._id);
      try {
        const imageUrl = await generateImage(personalizedDescription);
        const newImage = new Image({
          cardId: card._id,
          imageUrl,
          imageDescription: personalizedDescription
        });
        await newImage.save();
        logger.info(`Image for card ${card.name} generated and saved successfully.`);
      } catch (imageError) {
        logger.error(`Error generating or saving image for card ${card.name}:`, imageError.message, imageError.stack);
      }
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
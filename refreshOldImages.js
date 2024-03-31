const mongoose = require('mongoose');
const Image = require('./models/imageModel');
const Card = require('./models/cardModel');
const { generateImage } = require('./services/imageGenerationService');
const logger = require('./utils/logger');
require('dotenv').config();

async function refreshOldImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB Connected');

    // Calculate the date a year ago from now
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

    // Find images created more than a year ago
    const oldImages = await Image.find({
      createdAt: { $lte: oneYearAgo },
    });

    for (const image of oldImages) {
      const card = await Card.findById(image.cardId);
      if (!card) {
        logger.error(`Card with ID ${image.cardId} not found`);
        continue;
      }

      const personalizedDescription = `${card.name} wields an attack power of ${card.attack} and a defense of ${card.defense}. Special abilities include: ${card.specialAbilities.join(', ')}.`;

      // Regenerate the image
      const newImageUrl = await generateImage(personalizedDescription);

      // Update the image document with the new URL
      await Image.findByIdAndUpdate(image._id, { imageUrl: newImageUrl });

      logger.info(`Image for card ${card.name} refreshed successfully.`);
    }
  } catch (error) {
    logger.error('Error refreshing old images:', error.message, error.stack);
  } finally {
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected');
  }
}

refreshOldImages();
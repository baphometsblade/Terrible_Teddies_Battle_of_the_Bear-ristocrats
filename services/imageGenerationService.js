const axios = require('axios');
const Card = require('../models/cardModel');
const logger = require('../utils/logger');

// Initialize a simple in-memory cache
const imageCache = {};

// Function for generating personalized descriptions for cards
async function generatePersonalizedDescription(cardId) {
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      throw new Error(`Card with ID ${cardId} not found`);
    }
    // Generating a personalized description based on card properties
    const description = `${card.name} wields an attack power of ${card.attack} and a defense of ${card.defense}. Special abilities include: ${card.specialAbilities.join(', ')}.`;
    return description;
  } catch (error) {
    logger.error('Error generating personalized description:', error.message, error.stack);
    throw error;
  }
}

// Function for generating images based on descriptions
async function generateImage(description) {
  // Check if the image URL already exists in the cache
  if (imageCache[description]) {
    logger.info('Returning cached image URL for description:', description);
    return imageCache[description];
  }

  const maxRetries = 3;
  let currentAttempt = 0;
  while (currentAttempt < maxRetries) {
    try {
      // Using DeepAI's Text to Image API to generate an image based on the description
      const response = await axios.post('https://api.deepai.org/api/text2img', { text: description }, {
        headers: {
          'Api-Key': process.env.DEEP_AI_API_KEY
        }
      });
      if (response.status !== 200 || !response.data.output_url) {
        throw new Error(`Failed to generate image. Status: ${response.status}, Message: ${response.statusText}`);
      }
      // Cache the generated image URL before returning it
      imageCache[description] = response.data.output_url;
      return response.data.output_url;
    } catch (error) {
      logger.error('Error generating image:', error.message, error.stack);
      currentAttempt++;
      if (currentAttempt >= maxRetries) {
        logger.error(`Failed to generate image after ${maxRetries} attempts.`);
        throw error;
      }
      logger.info(`Retrying image generation, attempt ${currentAttempt}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
    }
  }
}

module.exports = {
  generatePersonalizedDescription,
  generateImage
};
const axios = require('axios');
const Card = require('../models/cardModel');
const logger = require('../utils/logger');

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
  try {
    // Using DeepAI's Text to Image API to generate an image based on the description
    const response = await axios.post('https://api.deepai.org/api/text2img', { text: description }, {
      headers: {
        'Api-Key': process.env.DEEP_AI_API_KEY
      }
    });
    if (response.status !== 200 || !response.data.output_url) {
      throw new Error('Failed to generate image');
    }
    return response.data.output_url;
  } catch (error) {
    logger.error('Error generating image:', error.message, error.stack);
    throw error;
  }
}

module.exports = {
  generatePersonalizedDescription,
  generateImage
};
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

module.exports = {
  generatePersonalizedDescription
};
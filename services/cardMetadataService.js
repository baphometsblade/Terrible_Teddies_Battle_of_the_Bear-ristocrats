const axios = require('axios');
const Card = require('../models/cardModel');
const logger = require('../utils/logger');

// Function for generating metadata based on card properties
const generateMetadataForCard = async (cardId) => {
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            logger.error(`Card with ID ${cardId} not found`);
            return;
        }
        // Enhanced metadata generation logic
        const specialAbilityDescriptions = card.specialAbilities.map((ability, index) => `${ability} empowers ${card.name} with a unique edge in battle.`).join(' ');
        const rarityDescription = `As a ${card.rarity ? card.rarity.toLowerCase() : 'common'} bear, ${card.name} stands out in the realm of the Bear-ristocrats.`;
        const backstory = `In the Stuffed Realm, ${card.name} was once a mere plaything, forgotten and lost. Through a twist of fate and a dash of magic, it rose to prominence, becoming a legend whispered among both the plush and the living.`;
        const abilitiesDescription = `Wielding ${card.specialAbilities.length} distinct abilities, ${card.name} is a force to be reckoned with, capable of turning the tide of any battle.`;
        const artistName = "Artisan of the Stuffed Realm"; // More thematic artist name
        const edition = "Bear-ristocratic Edition"; // More thematic edition name

        const metadata = {
            backstory,
            abilitiesDescription,
            rarityDescription,
            artistName,
            edition
        };
        return metadata;
    } catch (error) {
        logger.error('Error generating metadata for card:', error.message, error.stack);
        throw error;
    }
};

// Function for saving generated metadata to the database
const saveMetadataForCard = async (cardId, metadata) => {
    try {
        await Card.updateOne({ _id: cardId }, { $set: metadata });
        logger.info(`Metadata saved for card ID: ${cardId}`);
    } catch (error) {
        logger.error('Error saving metadata for card:', error.message, error.stack);
        throw error;
    }
};

// Function for generating and saving images for cards using an external API
const generateAndSaveImageForCard = async (cardId) => {
    const maxRetries = 3; // Maximum number of retries
    let currentAttempt = 0; // Current retry attempt
    while (currentAttempt < maxRetries) {
        try {
            const card = await Card.findById(cardId);
            // Enhanced prompt for image generation
            const prompt = `Generate an image for ${card.name}, a character in the game Terrible Teddies: Battle of the Bear-ristocrats. ${card.name} is known for ${card.specialAbilities.join(', ')}. They are a ${card.rarity ? card.rarity.toLowerCase() : 'common'} bear with a backstory of: ${card.backstory.substring(0, 100)}...`; // Custom prompt based on card's backstory and abilities
            const response = await axios.post('https://api.deepai.org/api/text2img', { text: prompt }, {
                headers: {
                    'Api-Key': process.env.DEEP_AI_API_KEY // Ensure you have set the DeepAI API key in your environment variables
                }
            });
            const imageResponse = response.data;
            if (!imageResponse || !imageResponse.output_url) {
                logger.error(`Image generation failed for card ID: ${cardId}`);
                return;
            }
            await Card.updateOne({ _id: cardId }, { $set: { imageUrl: imageResponse.output_url } });
            logger.info(`Image generated and saved for card ID: ${cardId} using enhanced prompt: ${prompt}`);
            break; // Break the loop if the image is successfully generated and saved
        } catch (error) {
            logger.error('Error generating or saving image for card:', error.message, error.stack);
            currentAttempt++;
            if (currentAttempt >= maxRetries) {
                logger.error(`Failed to generate or save image for card ID: ${cardId} after ${maxRetries} attempts.`);
                throw error;
            }
            logger.info(`Retrying image generation for card ID: ${cardId}, attempt ${currentAttempt}`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
        }
    }
};

module.exports = {
    generateMetadataForCard,
    saveMetadataForCard,
    generateAndSaveImageForCard
};
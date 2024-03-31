const mongoose = require('mongoose');
const Card = require('./models/cardModel');
const { generateAndSaveImageForCard } = require('./services/cardMetadataService');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const generateUniqueMetadata = (card) => {
  // Enhanced unique metadata generation logic based on card properties
  const specialAbilityDescriptions = card.specialAbilities.map((ability, index) => `${ability} empowers ${card.name} with a unique edge in battle.`).join(' ');
  const rarityDescription = `As a ${card.rarity ? card.rarity.toLowerCase() : 'common'} bear, ${card.name} stands out in the realm of the Bear-ristocrats.`;
  const backstory = `In the Stuffed Realm, ${card.name} was once a mere plaything, forgotten and lost. Through a twist of fate and a dash of magic, it rose to prominence, becoming a legend whispered among both the plush and the living.`;
  const abilitiesDescription = `Wielding ${card.specialAbilities.length} distinct abilities, ${card.name} is a force to be reckoned with, capable of turning the tide of any battle.`;
  const artistName = "Artisan of the Stuffed Realm"; // More thematic artist name
  const edition = "Bear-ristocratic Edition"; // More thematic edition name

  return {
    backstory,
    abilitiesDescription,
    rarityDescription,
    artistName,
    edition
  };
};

// Function to update a single card with metadata and generate its image
const updateCardWithMetadataAndImage = async (cardId) => {
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      console.log(`Card with ID ${cardId} not found`);
      return;
    }
    const metadata = generateUniqueMetadata(card);
    await Card.updateOne({ _id: card._id }, { $set: { backstory: metadata.backstory, abilitiesDescription: metadata.abilitiesDescription, rarityDescription: metadata.rarityDescription, artistName: metadata.artistName, edition: metadata.edition } })
    .then(() => console.log(`Metadata updated for card: ${card.name}`))
    .catch(error => {
      console.error('Error updating metadata for card:', error.message, error.stack);
    });

    await generateAndSaveImageForCard(card._id)
    .then(() => console.log(`Image generated and saved for card: ${card.name}`))
    .catch(error => {
      console.error('Error generating or saving image for card:', error.message, error.stack);
    });
  } catch (error) {
    console.error('Error updating card with metadata and image:', error.message, error.stack);
  } finally {
    await mongoose.disconnect().then(() => console.log('MongoDB Disconnected')).catch((error) => {
      console.error('An error occurred during MongoDB disconnection:', error.message, error.stack);
    });
  }
};

// Note: To use the updateCardWithMetadataAndImage function, call it with a specific card ID as an argument.
// This function is designed to be used programmatically and should not be run directly as a script without specifying a card ID.
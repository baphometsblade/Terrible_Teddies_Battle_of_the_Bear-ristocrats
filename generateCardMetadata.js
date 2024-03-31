const mongoose = require('mongoose');
const Card = require('./models/cardModel');
const { generateAndSaveImageForCard } = require('./services/cardMetadataService'); // Updated import path
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message, err.stack);
  });

const generateUniqueMetadata = (card) => {
  // Implementing unique metadata generation logic based on card properties
  const specialAbilityDescriptions = card.specialAbilities.map(ability => `${ability} that dazzles opponents`).join(', ');
  const rarityDescription = `A ${card.rarity ? card.rarity.toLowerCase() : 'common'} specimen, ${card.name} is sought after by collectors and strategists alike.`;
  const backstory = `Once a mere toy in the realm of the mundane, ${card.name} was imbued with extraordinary powers through a mysterious ritual. Known for its ${specialAbilityDescriptions}.`;
  const abilitiesDescription = `${card.name} harnesses the power of ${card.specialAbilities.length} unique abilities, making it a formidable opponent in any duel.`;
  // Placeholder values for artistName and edition to comply with the Card model requirements
  const artistName = "Default Artist"; // Placeholder artist name
  const edition = "Default Edition"; // Placeholder edition

  return {
    backstory,
    abilitiesDescription,
    rarityDescription,
    artistName, // Including artistName in the returned metadata
    edition // Including edition in the returned metadata
  };
};

const updateCardsWithMetadataAndImages = async () => {
  try {
    const cards = await Card.find({});
    for (const card of cards) {
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
    }
    console.log('All cards have been updated with unique metadata and images.');
  } catch (error) {
    console.error('Error updating cards with metadata and images:', error.message, error.stack);
  }
};

updateCardsWithMetadataAndImages().then(() => {
  mongoose.disconnect().then(() => console.log('MongoDB Disconnected'));
}).catch((error) => {
  console.error('An error occurred during the metadata and image generation process:', error.message, error.stack);
  mongoose.disconnect().then(() => console.log('MongoDB Disconnected'));
});
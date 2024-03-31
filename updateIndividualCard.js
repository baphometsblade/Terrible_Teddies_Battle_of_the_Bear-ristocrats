const mongoose = require('mongoose');
const Card = require('./models/cardModel');
const { generateAndSaveImageForCard } = require('./services/cardMetadataService');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message, err.stack);
  });

const generateUniqueMetadata = (card) => {
  // Implementing unique metadata generation logic based on card properties
  const specialAbilityDescriptions = card.specialAbilities.map(ability => `${ability} that dazzles opponents`).join(', ');
  const rarityDescription = `A ${card.rarity.toLowerCase()} specimen, ${card.name} is sought after by collectors and strategists alike.`;
  const backstory = `Once a mere toy in the realm of the mundane, ${card.name} was imbued with extraordinary powers through a mysterious ritual. Known for its ${specialAbilityDescriptions}.`;
  const abilitiesDescription = `${card.name} harnesses the power of ${card.specialAbilities.length} unique abilities, making it a formidable opponent in any duel.`;
  const artistName = "Generated Artist"; // Updated to reflect dynamic generation
  const edition = "Generated Edition"; // Updated to reflect dynamic generation

  return {
    backstory,
    abilitiesDescription,
    rarityDescription,
    artistName, // Including artistName in the returned metadata
    edition // Including edition in the returned metadata
  };
};

const updateCardWithMetadataAndImage = async (cardId) => {
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      console.log(`Card with ID ${cardId} not found`);
      return;
    }
    const metadata = generateUniqueMetadata(card);
    await Card.updateOne({ _id: card._id }, { $set: { backstory: metadata.backstory, abilitiesDescription: metadata.abilitiesDescription, rarityDescription: metadata.rarityDescription, artistName: metadata.artistName, edition: metadata.edition } });
    console.log(`Metadata updated for card: ${card.name}`);

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

// Accepting card ID as a command-line argument
const cardId = process.argv[2];
if (!cardId) {
  console.error('Please provide a card ID as an argument.');
  process.exit(1);
}

updateCardWithMetadataAndImage(cardId).catch((error) => {
  console.error('An error occurred:', error.message, error.stack);
});
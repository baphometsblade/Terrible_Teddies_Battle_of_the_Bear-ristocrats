const mongoose = require('mongoose');
const Card = require('./models/cardModel');
const Image = require('./models/imageModel');
const { generateImage } = require('./services/imageGenerationService');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const generateUniqueMetadata = (card) => {
  const specialAbilityDescriptions = card.specialAbilities.map((ability, index) => `${ability} empowers ${card.name} with a unique edge in battle, reflecting the game's setting and theme.`).join(' ');
  const rarityDescription = `As a ${card.rarity ? card.rarity.toLowerCase() : 'common'} bear, ${card.name} stands out in the realm of the Bear-ristocrats, embodying the game's humorous and adult-themed setting.`;
  const backstory = `In the Stuffed Realm, ${card.name} was once a mere plaything, forgotten and lost. Through a twist of fate and a dash of magic, it rose to prominence, becoming a legend whispered among both the plush and the living, showcasing the game's rich narrative.`;
  const abilitiesDescription = `Wielding ${card.specialAbilities.length} distinct abilities, ${card.name} is a force to be reckoned with, capable of turning the tide of any battle, perfectly aligning with the strategic depth of the game.`;
  const artistName = "Artisan of the Stuffed Realm";
  const edition = "Bear-ristocratic Edition";

  return {
    backstory,
    abilitiesDescription,
    rarityDescription,
    artistName,
    edition
  };
};

const updateCardWithMetadataAndImage = async (cardId) => {
  if (!cardId) {
    console.error('Card ID is required as an argument.');
    process.exit(1);
  }

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

    const existingImage = await Image.findOne({ cardId: card._id });
    if (!existingImage) {
      const imageUrl = await generateImage(metadata.backstory + " " + metadata.abilitiesDescription)
      .catch(error => {
        console.error('Error generating image for card:', error.message, error.stack);
        throw error;
      });

      const newImage = new Image({
        cardId: card._id,
        imageUrl,
        imageDescription: `${card.name} - ${metadata.edition}`
      });

      await newImage.save()
      .then(() => console.log(`Image generated and saved for card: ${card.name}`))
      .catch(error => {
        console.error('Error saving image for card:', error.message, error.stack);
      });
    } else {
      console.log(`Image already exists for card ${card.name}, skipping image generation.`);
    }
  } catch (error) {
    console.error('Error updating card with metadata and image:', error.message, error.stack);
  } finally {
    await mongoose.disconnect().then(() => console.log('MongoDB Disconnected')).catch((error) => {
      console.error('An error occurred during MongoDB disconnection:', error.message, error.stack);
    });
  }
};

updateCardWithMetadataAndImage(cardId).catch((error) => {
  console.error('An error occurred:', error.message, error.stack);
});
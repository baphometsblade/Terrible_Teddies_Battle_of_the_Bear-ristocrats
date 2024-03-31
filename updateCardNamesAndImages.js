const mongoose = require('mongoose');
const Card = require('./models/cardModel');
const Image = require('./models/imageModel');
const { generateImage } = require('./services/imageGenerationService');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Connected');

    const cards = await Card.find({});
    for (const card of cards) {
      const specialAbilityDescriptions = card.specialAbilities.map((ability, index) => `${ability} empowers ${card.name} with a unique edge in battle, reflecting the game's setting and theme.`).join(' ');
      const rarityDescription = `As a ${card.rarity ? card.rarity.toLowerCase() : 'common'} bear, ${card.name} stands out in the realm of the Bear-ristocrats, embodying the game's humorous and adult-themed setting.`;
      const backstory = `In the Stuffed Realm, ${card.name} was once a mere plaything, forgotten and lost. Through a twist of fate and a dash of magic, it rose to prominence, becoming a legend whispered among both the plush and the living, showcasing the game's rich narrative.`;
      const abilitiesDescription = `Wielding ${card.specialAbilities.length} distinct abilities, ${card.name} is a force to be reckoned with, capable of turning the tide of any battle, perfectly aligning with the strategic depth of the game.`;
      const artistName = "Artisan of the Stuffed Realm";
      const edition = "Bear-ristocratic Edition";

      try {
        await Card.updateOne({ _id: card._id }, { $set: { backstory, abilitiesDescription, rarityDescription, artistName, edition } });
      } catch (error) {
        console.error(`Error updating card ${card.name}:`, error.message);
        continue;
      }

      const existingImage = await Image.findOne({ cardId: card._id });
      if (!existingImage) {
        try {
          const imageUrl = await generateImage(`${card.name} - ${backstory.substring(0, 100)}... ${abilitiesDescription}`);
          const newImage = new Image({
            cardId: card._id,
            imageUrl,
            imageDescription: `${card.name} - ${edition}`
          });
          await newImage.save();
        } catch (error) {
          console.error(`Error generating or saving image for card ${card.name}:`, error.message);
        }
      }
      console.log(`Updated card and image for ${card.name}`);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB or updating cards:', error.message);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('MongoDB Disconnected');
    } catch (error) {
      console.error('An error occurred during MongoDB disconnection:', error.message);
    }
  }
})();
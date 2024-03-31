const mongoose = require('mongoose');
const Card = require('./models/cardModel'); // Ensure this path is correct based on your project structure
const logger = require('./utils/logger'); // Importing logger for logging
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Function to generate unique special abilities
const generateUniqueSpecialAbilities = (index) => {
  const abilities = [
    "Tea Party Massacre",
    "Honey Heist",
    "Silent Paw",
    "Bear Roar",
    "Cuddly Carnage",
    "Fuzzy Fury",
    "Stitch Stitch Boom",
    "Fluffball Frenzy",
    "Picnic Plunder",
    "Teddy Tornado"
  ];
  return [abilities[index % abilities.length]];
};

// Function to generate unique humor content
const generateUniqueHumorContent = (index) => {
  const contents = [
    "A bear of noble birth with a penchant for chaos at social gatherings.",
    "This bear loves nothing more than a good honey heist.",
    "Moves in silence but has a deadly paw.",
    "Can let out a roar that freezes any opponent in their tracks.",
    "Looks cuddly but watch out for its carnage.",
    "When angered, turns into a whirlwind of fuzzy fury.",
    "Can stitch itself back together after an attack. Boom!",
    "A seemingly innocent fluffball, but a fierce fighter.",
    "Never invite to a picnic unless you want it plundered.",
    "Creates a tornado of teddies to confuse and conquer foes."
  ];
  return contents[index % contents.length];
};

const cardData = [
  {
    name: "Sir Stuffington",
    attack: 10,
    defense: 5,
    specialAbilities: generateUniqueSpecialAbilities(0),
    humorContent: generateUniqueHumorContent(0)
  },
  // Generating 49 more unique card objects
  ...Array.from({ length: 49 }).map((_, index) => ({
    name: `Bear #${index + 2}`,
    attack: Math.floor(Math.random() * 10) + 1,
    defense: Math.floor(Math.random() * 10) + 1,
    specialAbilities: generateUniqueSpecialAbilities(index + 1),
    humorContent: generateUniqueHumorContent(index + 1)
  }))
];

const seedCards = async () => {
  try {
    await Card.insertMany(cardData);
    logger.info('Cards seeded successfully');
  } catch (err) {
    logger.error('Error seeding cards:', err.message, err.stack);
  }
};

seedCards();
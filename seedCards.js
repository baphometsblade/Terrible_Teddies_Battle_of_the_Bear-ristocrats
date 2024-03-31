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
    "Tea Party Massacre: Unleashes a flurry of porcelain and pastries, bewildering foes.",
    "Honey Heist: Stealthily pilfers honey, boosting morale and muddling enemies.",
    "Silent Paw: A stealth attack that leaves opponents questioning their surroundings.",
    "Bear Roar: A fearsome roar that demoralizes foes, lowering their defenses.",
    "Cuddly Carnage: An adorable onslaught that's as deadly as it is fluffy.",
    "Fuzzy Fury: A berserker rage that increases attack power at the cost of defense.",
    "Stitch Stitch Boom: A self-repair ability that ends with an explosive surprise for attackers.",
    "Fluffball Frenzy: A chaotic attack that confuses and damages multiple enemies.",
    "Picnic Plunder: Plunders the battlefield for resources, healing the user.",
    "Teddy Tornado: Summons a whirlwind of teddies, dealing area damage."
  ];
  return [abilities[index % abilities.length]];
};

// Function to generate unique humor content
const generateUniqueHumorContent = (index) => {
  const contents = [
    "A bear of noble birth with a penchant for chaos at social gatherings, known for his scandalous escapades.",
    "This bear loves nothing more than a good honey heist, often found plotting in the shadows.",
    "Moves in silence but has a deadly paw, feared by many for his silent takedowns.",
    "Can let out a roar that freezes any opponent in their tracks, a true force of nature.",
    "Looks cuddly but watch out for its carnage, leaving a trail of fluff and destruction.",
    "When angered, turns into a whirlwind of fuzzy fury, a sight both terrifying and mesmerizing.",
    "Can stitch itself back together after an attack. Boom! A surprise no one sees coming.",
    "A seemingly innocent fluffball, but a fierce fighter, underestimated by many to their peril.",
    "Never invite to a picnic unless you want it plundered, a master of culinary heists.",
    "Creates a tornado of teddies to confuse and conquer foes, a spectacle of plush and power."
  ];
  return contents[index % contents.length];
};

const cardData = [
  {
    name: "Sir Stuffington the Bold",
    attack: 10,
    defense: 5,
    specialAbilities: generateUniqueSpecialAbilities(0),
    humorContent: generateUniqueHumorContent(0)
  },
  // Generating 49 more unique card objects with thematic names and detailed descriptions
  ...Array.from({ length: 49 }).map((_, index) => ({
    name: `Lord Fluffington ${index + 2}`,
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
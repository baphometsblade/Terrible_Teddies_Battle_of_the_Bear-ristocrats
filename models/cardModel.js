const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  attack: {
    type: Number,
    required: true
  },
  defense: {
    type: Number,
    required: true
  },
  specialAbilities: [{
    type: String,
    required: true
  }],
  humorContent: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  backstory: {
    type: String,
    required: true
  },
  abilitiesDescription: {
    type: String,
    required: true
  },
  rarityDescription: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  edition: {
    type: String,
    required: true
  },
  energyCost: {
    type: Number,
    required: true,
    default: 1 // Assuming a default energy cost for all cards unless specified otherwise
  },
  cardSynergies: [{
    type: String,
    required: false // Not all cards may have synergies
  }],
  uniqueEffects: [{
    type: String,
    required: false // Not all cards may have unique effects
  }]
});

cardSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error('Error saving card:', error.message, error.stack);
    next(new Error('A card with this name already exists'));
  } else {
    next(error);
  }
});

cardSchema.post('save', function(doc) {
  console.log('%s has been saved', doc.name);
});

cardSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('Error saving card:', error.message, error.stack);
    next(error);
  } else {
    next();
  }
});

module.exports = mongoose.model('Card', cardSchema);
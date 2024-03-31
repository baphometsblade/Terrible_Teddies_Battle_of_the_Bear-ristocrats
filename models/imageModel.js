const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Card'
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  imageDescription: {
    type: String,
    required: true
  }
}, { timestamps: true }); // This option adds createdAt and updatedAt fields automatically

imageSchema.post('save', function(error, doc, next) {
  if (error) {
    console.error('Error saving image:', error.message, error.stack);
    next(error);
  } else {
    console.log(`Image for card ${doc.cardId} saved successfully.`);
    next();
  }
});

module.exports = mongoose.model('Image', imageSchema);
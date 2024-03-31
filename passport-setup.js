const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email"
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rivals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  winLossRecord: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
  }
});

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email or username already exists'));
  } else {
    next(error);
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
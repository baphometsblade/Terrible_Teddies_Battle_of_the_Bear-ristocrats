const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    deck: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
    hand: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
    health: { type: Number, default: 30 }
});

const gameSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    players: [{ type: String, required: true }],
    state: { type: String, required: true, enum: ['waiting', 'in-progress', 'finished'], default: 'waiting' },
    turn: { type: String },
    board: {
        player1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
        player2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }]
    },
    player1: playerSchema,
    player2: playerSchema
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

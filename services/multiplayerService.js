const socketIO = require('socket.io');
const logger = require('../utils/logger');

const Game = require('../models/gameModel'); // Assuming a game model exists for storing game state

class MultiplayerService {
    constructor(server) {
        this.io = socketIO(server);
        this.rooms = {}; // Tracks active rooms
        this.games = new Map(); // Tracks game states
        this.debugMode = false; // Tracks the debug mode status
        this.initialize();
    }

    // Function to toggle debug mode
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        logger.info(`Debug mode is now ${this.debugMode ? 'enabled' : 'disabled'}.`);
    }

    initialize() {
        this.io.on('connection', (socket) => {
            logger.info(`New connection: ${socket.id}`);

            socket.on('joinRoom', async ({ roomId, userId }) => {
                try {
                    if (!this.rooms[roomId]) {
                        this.rooms[roomId] = { players: [], maxPlayers: 2 };
                    }

                    if (this.rooms[roomId].players.length < this.rooms[roomId].maxPlayers) {
                        this.rooms[roomId].players.push(userId);
                        socket.join(roomId);
                        logger.info(`User ${userId} joined room ${roomId}`);
                        socket.to(roomId).emit('playerJoined', { userId });

                        if (this.rooms[roomId].players.length === this.rooms[roomId].maxPlayers) {
                            const game = await this.createGame(roomId, this.rooms[roomId].players);
                            this.games.set(roomId, game);
                            this.io.to(roomId).emit('gameUpdate', game);
                            logger.info(`Game started in room ${roomId}`);
                        }
                    } else {
                        socket.emit('roomFull');
                        logger.info(`User ${userId} attempted to join full room ${roomId}`);
                    }
                } catch (error) {
                    logger.error('Error in joinRoom event:', error.message, error.stack);
                    socket.emit('error', 'Failed to join room');
                }
            });

            socket.on('moveMade', async ({ roomId, userId, move }) => {
                try {
                    const game = this.games.get(roomId);
                    if (!game || game.turn !== userId) {
                        return socket.emit('error', 'Invalid move');
                    }

                    // Example move: playing a card
                    if (move.type === 'PLAY_CARD') {
                        const player = game.player1.id === userId ? game.player1 : game.player2;
                        const cardIndex = player.hand.findIndex(c => c.id === move.cardId);
                        if (cardIndex > -1) {
                            const card = player.hand.splice(cardIndex, 1)[0];
                            game.board[userId].push(card);
                        }
                    }

                    // Switch turns
                    game.turn = game.players.find(p => p !== userId);

                    // Update the game state in the database
                    await Game.updateOne({ id: roomId }, { $set: game });

                    this.io.to(roomId).emit('gameUpdate', game);
                    logger.info(`Move made in room ${roomId}: ${JSON.stringify(move)}`);
                } catch (error) {
                    logger.error('Error in moveMade event:', error.message, error.stack);
                    socket.emit('error', 'Failed to make move');
                }
            });

            socket.on('leaveRoom', ({ roomId, userId }) => {
                try {
                    socket.leave(roomId);
                    this.rooms[roomId].players = this.rooms[roomId].players.filter(player => player !== userId);
                    logger.info(`User ${userId} left room ${roomId}`);
                    if (this.rooms[roomId].players.length === 0) {
                        delete this.rooms[roomId];
                        logger.info(`Room ${roomId} deleted due to no players`);
                    }
                } catch (error) {
                    logger.error('Error in leaveRoom event:', error.message, error.stack);
                }
            });

            socket.on('disconnect', () => {
                try {
                    logger.info(`Connection disconnected: ${socket.id}`);
                    // Handle disconnection logic, such as cleaning up user from rooms
                    Object.keys(this.rooms).forEach(roomId => {
                        this.rooms[roomId].players = this.rooms[roomId].players.filter(player => player !== socket.id);
                        if (this.rooms[roomId].players.length === 0) {
                            delete this.rooms[roomId];
                            logger.info(`Room ${roomId} deleted due to disconnection`);
                        }
                    });
                } catch (error) {
                    logger.error('Error in disconnect event:', error.message, error.stack);
                }
            });
        });
    }

    async createGame(roomId, players) {
        const [player1Id, player2Id] = players;
        const newGame = new Game({
            id: roomId,
            players: players,
            state: 'in-progress',
            turn: player1Id,
            player1: { id: player1Id },
            player2: { id: player2Id }
        });

        // Here you would populate the decks and deal cards

        await newGame.save();
        logger.info(`Game ${roomId} saved to database.`);
        return newGame.toObject();
    }
}

module.exports = MultiplayerService;
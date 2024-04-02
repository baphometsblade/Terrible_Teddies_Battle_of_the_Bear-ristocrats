const socketIO = require('socket.io');
const logger = require('../utils/logger');

class MultiplayerService {
    constructor(server) {
        this.io = socketIO(server);
        this.rooms = {}; // Tracks active rooms
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

            socket.on('joinRoom', ({ roomId, userId }) => {
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
                            this.io.to(roomId).emit('startGame');
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

            socket.on('moveMade', ({ roomId, move }) => {
                try {
                    socket.to(roomId).emit('moveMade', move);
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
}

module.exports = MultiplayerService;
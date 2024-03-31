const socketIO = require('socket.io');
const logger = require('../utils/logger');

class MultiplayerService {
    constructor(server) {
        this.io = socketIO(server);
        this.rooms = {}; // Tracks active rooms
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            logger.info(`New connection: ${socket.id}`);

            socket.on('joinRoom', ({ roomId, userId }) => {
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
            });

            socket.on('moveMade', ({ roomId, move }) => {
                socket.to(roomId).emit('moveMade', move);
                logger.info(`Move made in room ${roomId}: ${JSON.stringify(move)}`);
            });

            socket.on('leaveRoom', ({ roomId, userId }) => {
                socket.leave(roomId);
                this.rooms[roomId].players = this.rooms[roomId].players.filter(player => player !== userId);
                logger.info(`User ${userId} left room ${roomId}`);
                if (this.rooms[roomId].players.length === 0) {
                    delete this.rooms[roomId];
                    logger.info(`Room ${roomId} deleted due to no players`);
                }
            });

            socket.on('disconnect', () => {
                logger.info(`Connection disconnected: ${socket.id}`);
                // Handle disconnection logic, such as cleaning up user from rooms
                Object.keys(this.rooms).forEach(roomId => {
                    this.rooms[roomId].players = this.rooms[roomId].players.filter(player => player !== socket.id);
                    if (this.rooms[roomId].players.length === 0) {
                        delete this.rooms[roomId];
                        logger.info(`Room ${roomId} deleted due to disconnection`);
                    }
                });
            });
        });
    }
}

module.exports = MultiplayerService;
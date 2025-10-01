document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    const userId = 'user_id_placeholder'; // This should be replaced with the actual user ID

    if (roomId) {
        socket.emit('joinRoom', { roomId, userId });
    }

    socket.on('gameUpdate', (game) => {
        console.log('Game update received:', game);
        updateGameBoard(game);
    });

    socket.on('error', (error) => {
        console.error('Error:', error);
        alert('An error occurred: ' + error);
    });

    function updateGameBoard(game) {
        const player = game.player1.id === userId ? game.player1 : game.player2;
        const opponent = game.player1.id === userId ? game.player2 : game.player1;

        document.getElementById('turn').textContent = game.turn === userId ? 'Your turn' : "Opponent's turn";
        document.getElementById('player-health').textContent = player.health;
        document.getElementById('opponent-health').textContent = opponent.health;

        renderHand(player.hand, 'player-hand');
        renderHand(opponent.hand, 'opponent-hand');
        renderBoard(game.board[player.id], 'player-board');
        renderBoard(game.board[opponent.id], 'opponent-board');
    }

    function renderHand(hand, elementId) {
        const handElement = document.getElementById(elementId);
        handElement.innerHTML = '';
        hand.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `<img src="${card.imageUrl}" alt="${card.name}">`;
            cardElement.addEventListener('click', () => playCard(card._id));
            handElement.appendChild(cardElement);
        });
    }

    function renderBoard(board, elementId) {
        const boardElement = document.getElementById(elementId);
        boardElement.innerHTML = '';
        board.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `<img src="${card.imageUrl}" alt="${card.name}">`;
            boardElement.appendChild(cardElement);
        });
    }

    function playCard(cardId) {
        socket.emit('moveMade', { roomId, userId, move: { type: 'PLAY_CARD', cardId } });
    }
});

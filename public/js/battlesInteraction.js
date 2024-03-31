document.addEventListener('DOMContentLoaded', () => {
    const availableBattlesList = document.getElementById('available-battles-list');
    const ongoingBattlesList = document.getElementById('ongoing-battles-list');
    const battleResultsList = document.getElementById('battle-results-list');

    if (availableBattlesList && ongoingBattlesList && battleResultsList) {
        // Fetch available battles from the server and display them
        fetch('/api/available-battles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for available battles.');
            }
            return response.json();
        })
        .then(battles => {
            if (battles.length === 0) {
                availableBattlesList.textContent = 'No available battles at the moment.';
            } else {
                battles.forEach(battle => {
                    const battleElement = document.createElement('div');
                    battleElement.textContent = `Battle ID: ${battle.id}, Players: ${battle.players.join(', ')}`;
                    availableBattlesList.appendChild(battleElement);
                });
            }
        })
        .catch(error => {
            console.error('Failed to load available battles:', error.message, error.stack);
            alert('Failed to load available battles. Please try again later.');
        });

        // Fetch ongoing battles from the server and display them
        fetch('/api/ongoing-battles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for ongoing battles.');
            }
            return response.json();
        })
        .then(battles => {
            if (battles.length === 0) {
                ongoingBattlesList.textContent = 'No ongoing battles at the moment.';
            } else {
                battles.forEach(battle => {
                    const battleElement = document.createElement('div');
                    battleElement.textContent = `Battle ID: ${battle.id}, Players: ${battle.players.join(', ')}`;
                    ongoingBattlesList.appendChild(battleElement);
                });
            }
        })
        .catch(error => {
            console.error('Failed to load ongoing battles:', error.message, error.stack);
            alert('Failed to load ongoing battles. Please try again later.');
        });

        // Fetch battle results from the server and display them
        fetch('/api/battle-results')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for battle results.');
            }
            return response.json();
        })
        .then(results => {
            if (results.length === 0) {
                battleResultsList.textContent = 'No battle results available at the moment.';
            } else {
                results.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.textContent = `Battle ID: ${result.battleId}, Winner: ${result.winner}`;
                    battleResultsList.appendChild(resultElement);
                });
            }
        })
        .catch(error => {
            console.error('Failed to load battle results:', error.message, error.stack);
            alert('Failed to load battle results. Please try again later.');
        });
    } else {
        console.error('One or more required DOM elements were not found.');
    }

    // Placeholder for additional interactive functionalities
});
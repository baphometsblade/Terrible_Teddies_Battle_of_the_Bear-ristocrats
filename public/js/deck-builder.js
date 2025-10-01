document.addEventListener('DOMContentLoaded', () => {
    const cardSelectionElement = document.getElementById('card-selection');
    const deckPreviewElement = document.getElementById('deck-preview');
    const saveDeckButton = document.getElementById('save-deck');
    let deck = [];

    async function loadAvailableCards() {
        try {
            const response = await fetch('/api/cards');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const cards = await response.json();
            renderCards(cards);
        } catch (error) {
            console.error('Failed to load available cards for deck building:', error.message, error.stack);
            alert('Failed to load available cards. Please try again later.');
        }
    }

    function renderCards(cards) {
        cardSelectionElement.innerHTML = '<h3>Select Cards</h3>';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card-selection-item');
            cardElement.dataset.cardId = card._id;
            cardElement.innerHTML = `
                <img src="${card.imageUrl}" alt="${card.name}">
                <p>${card.name}</p>
            `;
            cardElement.addEventListener('click', () => addCardToDeck(card, cardElement));
            cardSelectionElement.appendChild(cardElement);
        });
    }

    function addCardToDeck(card, cardElement) {
        if (deck.length >= 40) {
            alert('Deck is full!');
            return;
        }
        deck.push(card);
        cardElement.classList.add('selected');
        cardElement.removeEventListener('click', () => addCardToDeck(card, cardElement));
        renderDeckPreview();
    }

    function renderDeckPreview() {
        deckPreviewElement.innerHTML = '<h3>Deck Preview</h3>';
        deck.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('deck-preview-item');
            cardElement.innerHTML = `<p>${card.name}</p>`;
            cardElement.addEventListener('click', () => removeCardFromDeck(index));
            deckPreviewElement.appendChild(cardElement);
        });
    }

    function removeCardFromDeck(index) {
        const card = deck.splice(index, 1)[0];
        const cardElement = cardSelectionElement.querySelector(`[data-card-id="${card._id}"]`);
        if (cardElement) {
            cardElement.classList.remove('selected');
            cardElement.addEventListener('click', () => addCardToDeck(card, cardElement));
        }
        renderDeckPreview();
    }

    saveDeckButton.addEventListener('click', async () => {
        if (deck.length < 30) {
            alert('Deck must have at least 30 cards.');
            return;
        }
        try {
            const response = await fetch('/api/user/deck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include auth token if needed
                },
                body: JSON.stringify({ deck: deck.map(c => c._id) })
            });
            if (!response.ok) {
                throw new Error('Failed to save deck');
            }
            alert('Deck saved successfully!');
        } catch (error) {
            console.error('Error saving deck:', error);
            alert('Error saving deck. Please try again.');
        }
    });

    loadAvailableCards();
});

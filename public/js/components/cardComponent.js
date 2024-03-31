// This script defines a reusable card component for displaying card information in the game.

class CardComponent {
    constructor(cardData) {
        this.cardData = cardData;
    }

    // Generates HTML for the card
    generateCardHTML() {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const imgElement = document.createElement('img');
        imgElement.src = this.cardData.imageUrl;
        imgElement.alt = `Image of ${this.cardData.name}`;
        cardElement.appendChild(imgElement);

        const nameElement = document.createElement('p');
        nameElement.textContent = this.cardData.name;
        cardElement.appendChild(nameElement);

        // Implement hover effects
        cardElement.addEventListener('mouseenter', () => {
            cardElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
        });
        cardElement.addEventListener('mouseleave', () => {
            cardElement.style.boxShadow = '';
        });

        // Click event to open modal with detailed card information
        cardElement.addEventListener('click', () => {
            this.openModal(this.cardData);
        });

        return cardElement;
    }

    // Opens a modal displaying detailed information about the card
    openModal(cardData) {
        const modalContent = `
            <h2>${cardData.name}</h2>
            <img src="${cardData.imageUrl}" alt="Image of ${cardData.name}">
            <p>Special Abilities: ${cardData.specialAbilities.join(', ')}</p>
            <p>Attack: ${cardData.attack} | Defense: ${cardData.defense}</p>
        `;
        const modal = document.createElement('div');
        modal.id = 'card-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="modal-content" tabindex="-1">
                <div id="modal-title" class="modal-title">${modalContent}</div>
                <button onclick="closeModal()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

        console.log(`Modal opened for card: ${cardData.name}`);
    }
}

// Function to close the modal
window.closeModal = function() {
    const modal = document.getElementById('card-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = ''; // Re-enable scrolling when modal is closed
        console.log('Modal closed');
    } else {
        console.error('Failed to close modal');
    }
};
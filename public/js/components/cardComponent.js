// This script defines a reusable card component for displaying card information in the game.
// It has been updated to include more vibrant and playful colors, playful fonts, and interactive elements.

class CardComponent {
    constructor(cardData) {
        this.cardData = cardData;
    }

    // Generates HTML for the card with updated styles and interactive elements
    generateCardHTML() {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const imgElement = document.createElement('img');
        imgElement.src = this.cardData.imageUrl;
        imgElement.alt = `Image of ${this.cardData.name}`;
        imgElement.classList.add('card-image'); // Added class for styling
        cardElement.appendChild(imgElement);

        const nameElement = document.createElement('p');
        nameElement.textContent = this.cardData.name;
        nameElement.classList.add('card-name'); // Added class for styling
        cardElement.appendChild(nameElement);

        // Implement hover effects and animations
        cardElement.addEventListener('mouseenter', () => {
            cardElement.style.transform = 'scale(1.05) rotate(3deg)';
            cardElement.style.transition = 'transform 0.3s ease-in-out';
            cardElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)'; // Re-added box shadow effect on hover
        });
        cardElement.addEventListener('mouseleave', () => {
            cardElement.style.transform = 'none';
            cardElement.style.boxShadow = 'none'; // Remove box shadow when not hovering
        });

        // Click event to open modal with detailed card information
        cardElement.addEventListener('click', () => {
            this.openModal(this.cardData);
        });

        return cardElement;
    }

    // Opens a modal displaying detailed information about the card with enhanced UI
    openModal(cardData) {
        const modalContent = `
            <h2>${cardData.name}</h2>
            <img src="${cardData.imageUrl}" alt="Image of ${cardData.name}" class="modal-image">
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

        console.log(`Modal opened for card: ${cardData.name}`); // Enhanced logging for debugging
    }
}

// Function to close the modal
window.closeModal = function() {
    const modal = document.getElementById('card-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = ''; // Re-enable scrolling when modal is closed
        console.log('Modal closed'); // Enhanced logging for debugging
    } else {
        console.error('Failed to close modal'); // Enhanced error logging
    }
};
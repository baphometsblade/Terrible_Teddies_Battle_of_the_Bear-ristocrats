document.addEventListener('DOMContentLoaded', () => {
    // Implement hover and touch effects on cards for a better user experience across devices
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // Hover effects for desktop
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });

        // Touch effects for mobile devices
        card.addEventListener('touchstart', () => {
            card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
        }, {passive: true});
        card.addEventListener('touchend', () => {
            card.style.boxShadow = '';
        }, {passive: true});

        // Click event to open modal with detailed card information
        card.addEventListener('click', () => {
            const modalContent = `
                <h2>${card.querySelector('.card-name').textContent}</h2>
                <img src="${card.querySelector('img').src}" alt="${card.querySelector('.card-name').textContent}">
                <p>Special Abilities: ${card.dataset.abilities}</p>
                <p>Attack: ${card.dataset.attack} | Defense: ${card.dataset.defense}</p>
            `;
            openModal(modalContent);
        });
    });

    // Function to open modal with provided content
    function openModal(content) {
        const modal = document.createElement('div');
        modal.id = 'card-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="modal-content" tabindex="-1">
                <div id="modal-title" class="modal-title">${content}</div>
                <button onclick="closeModal()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    // Function to close the modal
    window.closeModal = function() {
        const modal = document.getElementById('card-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = ''; // Re-enable scrolling when modal is closed
        }
    };
});
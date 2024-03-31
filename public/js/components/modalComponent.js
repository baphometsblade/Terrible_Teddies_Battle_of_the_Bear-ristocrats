class ModalComponent {
    constructor() {
        this.modal = null;
        this.content = null;
        this.initEventListeners();
    }

    createModal(content) {
        this.modal = document.createElement('div');
        this.modal.id = 'modal-component';
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-labelledby', 'modal-title');
        this.modal.setAttribute('aria-modal', 'true');
        this.modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content" tabindex="-1">
                <div id="modal-title" class="modal-title">${content}</div>
                <button class="modal-close-btn">Close</button>
            </div>
        `;
        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        console.log('Modal created and appended to the body');
    }

    closeModal() {
        if (this.modal) {
            this.modal.remove();
            document.body.style.overflow = ''; // Re-enable scrolling when modal is closed
            console.log('Modal closed and removed from the body');
        } else {
            console.error('Attempted to close a modal that does not exist');
        }
    }

    initEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('modal-close-btn')) {
                this.closeModal();
            }
        });
    }
}

// Instantiate the modal component for global access
const modalComponent = new ModalComponent();

// Example usage:
// modalComponent.createModal('Your dynamic content here');
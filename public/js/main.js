async function loadCardImages() {
  try {
    const axiosUrl = window.location.origin + "/api/cards"; // Dynamically set AXIOS_URL based on the current origin
    const response = await fetch(axiosUrl); // Updated to use AXIOS_URL for fetching cards
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const cards = await response.json();

    const cardGalleryElement = document.getElementById('card-gallery'); // Ensure there's a card gallery section in your HTML
    if (!cardGalleryElement) {
      console.error('Card gallery element not found');
      return;
    }

    if (cards.length === 0) {
      const noCardsMessage = document.createElement('p');
      noCardsMessage.textContent = 'No cards available at the moment.';
      cardGalleryElement.appendChild(noCardsMessage);
      return;
    }

    cards.forEach(card => {
      if (card.imageUrl) {
        const cardElement = document.createElement('div');
        cardElement.id = `card-${card._id}`;
        cardElement.classList.add('card');

        const imgElement = document.createElement('img');
        imgElement.dataset.src = card.imageUrl; // Use dataset.src for lazy loading
        imgElement.alt = `Image for ${card.name}`;
        imgElement.classList.add('card-image'); // Added class for styling card images
        cardElement.appendChild(imgElement);

        const nameElement = document.createElement('p');
        nameElement.textContent = card.name;
        nameElement.classList.add('card-name'); // Added class for styling card names
        cardElement.appendChild(nameElement);

        cardGalleryElement.appendChild(cardElement);
      }
    });

    lazyLoadImages();
  } catch (error) {
    console.error('Failed to load card images:', error.message, error.stack);
    alert('Failed to load card images. Please try again later.');
  }
}

async function loadAvailableCards() {
  try {
    const axiosUrl = window.location.origin + "/api/cards"; // Dynamically set AXIOS_URL based on the current origin
    const response = await fetch(axiosUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const cards = await response.json();

    const cardSelectionElement = document.getElementById('card-selection');
    if (!cardSelectionElement) {
      console.error('Card selection element not found');
      return;
    }

    if (cards.length === 0) {
      const noCardsMessage = document.createElement('p');
      noCardsMessage.textContent = 'No cards available for deck building at the moment.';
      cardSelectionElement.appendChild(noCardsMessage);
      return;
    }

    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card-selection-item');

      const imgElement = document.createElement('img');
      imgElement.dataset.src = card.imageUrl; // Use dataset.src for lazy loading
      imgElement.alt = `Image for ${card.name}`;
      cardElement.appendChild(imgElement);

      const nameElement = document.createElement('p');
      nameElement.textContent = card.name;
      cardElement.appendChild(nameElement);

      cardSelectionElement.appendChild(cardElement);
    });

    lazyLoadImages();
  } catch (error) {
    console.error('Failed to load available cards for deck building:', error.message, error.stack);
    alert('Failed to load available cards. Please try again later.');
  }
}

function attachEventListeners() {
  // Placeholder for attaching event listeners related to deck building actions
  console.log('Attaching event listeners for deck building actions...');
}

function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src; // Correctly set src from dataset.src
          observer.unobserve(image);
        }
      });
    }, { rootMargin: '0px 0px 200px 0px' });

    document.querySelectorAll('img.card-image').forEach(img => {
      observer.observe(img);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadCardImages();
  loadAvailableCards();
  attachEventListeners();
});
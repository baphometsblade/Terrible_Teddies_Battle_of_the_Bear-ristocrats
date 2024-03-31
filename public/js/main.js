async function loadCardImages() {
  try {
    // Assuming AXIOS_URL is set to the backend API dynamically
    const axiosUrl = window.location.origin + "/api"; // Dynamically set AXIOS_URL based on the current origin
    const response = await fetch(`${axiosUrl}/cards`); // Updated to use AXIOS_URL for fetching cards
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const cards = await response.json();

    const cardGalleryElement = document.getElementById('card-gallery'); // Ensure there's a card gallery section in your HTML
    if (!cardGalleryElement) {
      console.error('Card gallery element not found');
      return;
    }

    cards.forEach(card => {
      if (card.imageUrl) {
        const cardElement = document.createElement('div');
        cardElement.id = `card-${card._id}`;
        cardElement.classList.add('card');

        const imgElement = document.createElement('img');
        imgElement.src = card.imageUrl;
        imgElement.alt = `Image for ${card.name}`;
        cardElement.appendChild(imgElement);

        const nameElement = document.createElement('p');
        nameElement.textContent = card.name;
        cardElement.appendChild(nameElement);

        cardGalleryElement.appendChild(cardElement);
      }
    });
  } catch (error) {
    console.error('Failed to load card images:', error.message, error.stack);
    alert('Failed to load card images. Please try again later.');
  }
}

document.addEventListener('DOMContentLoaded', loadCardImages);
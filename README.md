# Terrible Teddies: Battle of the Bear-ristocrats

"Terrible Teddies: Battle of the Bear-ristocrats" is a strategically engaging and humorously themed card battling game set in the Stuffed Realm, a world where teddy bears vie for power and influence. This project combines a rich, adult-themed narrative with a complex deck-building and dueling system, all brought to life through web technologies. Notably, the game features a unique collection of pre-generated bear images, ensuring a visually consistent and engaging experience for players.

## Overview

The project utilizes Node.js and Express for server-side logic, MongoDB for data persistence, and Socket.IO for real-time multiplayer interactions. The architecture supports dynamic, turn-based card battles with a focus on strategic gameplay and secure user management. Key components include:

- Server setup and API routing
- User authentication and session management
- Real-time multiplayer logic
- Card management with pre-generated bear images for deck building

## Features

- **Deck Building**: Players can build decks from an array of cards, each with unique abilities and pre-generated images.
- **Dynamic Dueling**: Engage in turn-based battles that require strategy and foresight.
- **Multiplayer**: Compete against others in real-time online battles.
- **Mature Humor**: The game's narrative and text are filled with adult, tongue-in-cheek humor.

## Getting started

### Requirements

- Node.js
- MongoDB
- npm

### Quickstart

1. Clone the repository to your local machine.
2. Run `npm install` to install dependencies.
3. Set up your `.env` file based on the `.env.example` provided. 
PORT=5006
MONGO_URI=mongodb+srv://user:user@cluster0.8wuam9k.mongodb.net/Cluster0?retryWrites=true&w=majority
AXIOS_URL=http://localhost:5006/api
JWT_SECRET=8f2b7e2d3c4a5b6e7f8g9h0i
DEEP_AI_API_KEY=543ec4d6-da50-4d5d-9099-6047f1d00a83
4. Start the server with `node server.js`.
5. Access the game through your web browser at the specified port.

## Individual Card Metadata and Image Generation

To generate unique metadata and images for individual cards, follow these steps:

1. Ensure you have a card ID for which you want to generate metadata and images.
2. Run the script `updateIndividualCard.js` from the command line, passing the card ID as an argument. For example: `node updateIndividualCard.js <cardId>`. This script will update the card with unique metadata and generate a corresponding image.

This process allows for the generation of unique and individual metadata and images for each card, enhancing the game's depth and player experience.

## Debugging and Logging Strategy for Token Generation and Verification

To ensure the secure and correct generation, storage, and usage of JWT tokens throughout the application, a comprehensive debugging and logging strategy has been implemented. This strategy includes:

- Enhanced logging within the `/register` and `/login` routes to log events related to token generation, including successful generation and any errors encountered.
- The introduction of middleware that logs the incoming request's authorization header to verify that tokens are being sent correctly with requests.
- A new logging utility function that allows conditional logging based on the environment, ensuring sensitive information such as tokens is only logged in a development environment.
- A test endpoint `/testToken` for manually verifying and debugging token issues, logging the process of verifying the token, including the decoded token information and the final result of the token verification process.
- Documentation updates to include information on the new logging strategy for token generation and verification.

This strategy is designed to provide a detailed log trail of the entire token lifecycle, allowing for quick identification and resolution of any issues related to token generation, storage, and usage.

### License

Copyright (c) 2024. All rights reserved.#   T e r r i b l e _ T e d d i e s _ B a t t l e _ o f _ t h e _ B e a r - r i s t o c r a t s  
 #   T e r r i b l e _ T e d d i e s _ B a t t l e _ o f _ t h e _ B e a r r i s t o c r a t s  
 
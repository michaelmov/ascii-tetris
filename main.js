import { Game } from './src/game/Game.js';
import { Renderer } from './src/game/Renderer.js';

// Initialize the renderer with DOM elements
const renderer = new Renderer(
  document.getElementById('game-board'),
  document.getElementById('next-piece'),
  document.getElementById('scoreboard'),
  document.getElementById('instructions')
);

// Create the game instance
const game = new Game(renderer);

// Start the game when the page loads
window.onload = () => {
  document.getElementById('start-screen').style.display = 'flex';
  document.getElementById('tetris-container').style.display = 'none';
};

import './style.css';
import { Game } from './game/Game';
import { Renderer } from './game/Renderer';

// Initialize the renderer with DOM elements
const renderer = new Renderer(
  document.getElementById('game-board') as HTMLElement,
  document.getElementById('next-piece') as HTMLElement,
  document.getElementById('scoreboard') as HTMLElement,
  document.getElementById('instructions') as HTMLElement
);

// Create the game instance
const game = new Game(renderer);

// Start the game when the page loads
window.onload = (): void => {
  const startScreen = document.getElementById('start-screen');
  const tetrisContainer = document.getElementById('tetris-container');
  let gameStarted = false;

  if (startScreen && tetrisContainer) {
    startScreen.style.display = 'flex';
    tetrisContainer.style.display = 'none';

    // Start game when clicking/tapping anywhere on the document
    document.body.addEventListener('click', () => {
      if (!gameStarted) {
        gameStarted = true;
        startScreen.style.display = 'none';
        tetrisContainer.style.display = 'flex';
        game.start();
      }
    });
  }
};

export class InputHandler {
  constructor(game) {
    this.game = game;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (!this.game.isStarted) {
        this.game.start();
        return;
      }

      if (this.game.gameState.gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case '7':
          this.game.move(-1);
          break;
        case 'ArrowRight':
        case '9':
          this.game.move(1);
          break;
        case 'ArrowUp':
        case '8':
          this.game.rotatePiece();
          break;
        case 'ArrowDown':
        case '4':
          this.game.moveDown();
          break;
        case ' ':
        case '5':
          this.game.drop();
          break;
        case 'p':
        case 'P':
          this.game.togglePause();
          break;
      }
    });
  }
} 
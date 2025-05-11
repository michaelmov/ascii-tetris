import { Game } from './Game';

export class InputHandler {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.game.getIsStarted()) {
        this.game.start();
        return;
      }

      switch (e.key) {
        case 'r':
        case 'R':
          this.game.restart();
          return;
      }

      if (this.game.getGameState().isGameOver()) return;

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

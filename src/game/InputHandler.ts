import { Game } from './Game';

export class InputHandler {
  private game: Game;
  private touchStartX: number | null;
  private touchStartY: number | null;
  private lastTapTime: number;
  private readonly SWIPE_THRESHOLD = 50;
  private readonly DOUBLE_TAP_DELAY = 300;

  constructor(game: Game) {
    this.game = game;
    this.touchStartX = null;
    this.touchStartY = null;
    this.lastTapTime = 0;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Keyboard controls
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

    // Touch controls
    document.addEventListener('touchstart', (e: TouchEvent) => {
      if (!this.game.getIsStarted() || this.game.getGameState().isGameOver())
        return;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;

      const now = Date.now();
      if (now - this.lastTapTime < this.DOUBLE_TAP_DELAY) {
        // Double tap detected - drop piece
        this.game.drop();
        e.preventDefault();
      }
      this.lastTapTime = now;
    });

    document.addEventListener('touchend', (e: TouchEvent) => {
      if (
        !this.game.getIsStarted() ||
        !this.touchStartX ||
        !this.touchStartY ||
        this.game.getGameState().isGameOver()
      )
        return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;

      // Determine if it's a swipe or a tap
      if (
        Math.abs(deltaX) < this.SWIPE_THRESHOLD &&
        Math.abs(deltaY) < this.SWIPE_THRESHOLD
      ) {
        // Tap - rotate piece
        this.game.rotatePiece();
      } else {
        // Handle swipes
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0) {
            this.game.move(1); // Right
          } else {
            this.game.move(-1); // Left
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            this.game.drop(); // Down
          }
        }
      }

      this.touchStartX = null;
      this.touchStartY = null;
      e.preventDefault();
    });

    document.addEventListener('touchmove', (e: TouchEvent) => {
      if (!this.game.getIsStarted() || this.game.getGameState().isGameOver())
        return;
      e.preventDefault();
    });
  }
}

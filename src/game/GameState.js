export class GameState {
  constructor() {
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.gameOver = false;
    this.isPaused = false;
  }

  updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += clearedLines * 100;
      this.lines += clearedLines;
      this.level = 1 + Math.floor(this.lines / 10);
    }
  }

  reset() {
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.gameOver = false;
    this.isPaused = false;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  setGameOver() {
    this.gameOver = true;
  }
} 
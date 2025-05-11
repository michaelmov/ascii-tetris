import { Board } from './Board.js';
import { GameState } from './GameState.js';
import { InputHandler } from './InputHandler.js';
import { Piece } from './Piece.js';

export class Game {
  constructor(renderer) {
    this.ROWS = 25;
    this.COLS = 10;
    this.TICK_MS = 500;

    this.board = new Board(this.ROWS, this.COLS);
    this.gameState = new GameState();
    this.renderer = renderer;
    this.inputHandler = new InputHandler(this);

    this.current = null;
    this.next = null;
    this.position = null;
    this.isStarted = false;
    this.tickInterval = null;
  }

  start() {
    if (!this.isStarted) {
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('tetris-container').style.display = 'flex';
      this.isStarted = true;
      this.spawnPiece();
      this.tickInterval = setInterval(() => this.tick(), this.TICK_MS);
    }
  }

  spawnPiece() {
    this.current = this.next || new Piece();
    this.next = new Piece();
    this.position = {
      row: 0,
      col: Math.floor((this.COLS - this.current.getWidth()) / 2),
    };

    if (
      !this.board.isValidMove(
        this.current.shape,
        this.position.row,
        this.position.col
      )
    ) {
      this.gameState.setGameOver();
    }
  }

  tick() {
    if (this.gameState.gameOver || this.gameState.isPaused) return;

    if (
      this.board.isValidMove(
        this.current.shape,
        this.position.row + 1,
        this.position.col
      )
    ) {
      this.position.row++;
    } else {
      this.board.mergePiece(this.current, this.position);

      // Find lines that are about to be cleared
      const linesToClear = [];
      for (let r = this.ROWS - 1; r >= 0; r--) {
        if (this.board.grid[r].every((cell) => cell !== this.board.empty)) {
          linesToClear.push(r);
        }
      }

      if (linesToClear.length > 0) {
        this.renderer.setLinesToClear(linesToClear);
        this.render();

        // Wait for the flash animation to complete before clearing the lines
        setTimeout(() => {
          const clearedLines = this.board.clearLines();
          this.gameState.updateScore(clearedLines);
          this.renderer.setLinesToClear([]);
          this.spawnPiece();
          this.render();
        }, 100);
        return; // Skip the final render call
      } else {
        this.spawnPiece();
      }
    }
    this.render();
  }

  move(dx) {
    if (
      this.board.isValidMove(
        this.current.shape,
        this.position.row,
        this.position.col + dx
      )
    ) {
      this.position.col += dx;
      this.render();
    }
  }

  moveDown() {
    if (
      this.board.isValidMove(
        this.current.shape,
        this.position.row + 1,
        this.position.col
      )
    ) {
      this.position.row++;
      this.render();
    }
  }

  drop() {
    while (
      this.board.isValidMove(
        this.current.shape,
        this.position.row + 1,
        this.position.col
      )
    ) {
      this.position.row++;
    }
    this.tick();
  }

  rotatePiece() {
    this.current.rotate();
    if (
      !this.board.isValidMove(
        this.current.shape,
        this.position.row,
        this.position.col
      )
    ) {
      // If rotation is invalid, rotate back
      this.current.rotate();
      this.current.rotate();
      this.current.rotate();
    }
    this.render();
  }

  togglePause() {
    this.gameState.togglePause();
    this.render();
  }

  restart() {
    // Clear existing interval
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }

    this.gameState.reset();
    this.board.reset();
    this.current = null;
    this.next = null;
    this.position = null;
    this.spawnPiece();
    // Start new interval
    this.tickInterval = setInterval(() => this.tick(), this.TICK_MS);
    this.render();
  }

  render() {
    this.renderer.render(
      this.board,
      this.current,
      this.next,
      this.position,
      this.gameState
    );
  }
}

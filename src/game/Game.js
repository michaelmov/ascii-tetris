import { Board } from './Board.js';
import { Piece } from './Piece.js';
import { Renderer } from './Renderer.js';

export class Game {
  constructor(renderer) {
    this.TICK_MS = 500;
    this.board = new Board();
    this.renderer = renderer;
    this.reset();
  }

  reset() {
    this.board.reset();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.gameOver = false;
    this.isPaused = false;
    this.nextPiece = new Piece();
    this.spawnPiece();
    this.renderer.renderAll(this.getGameState());
  }

  getGameState() {
    return {
      board: this.board,
      currentPiece: this.currentPiece,
      currentPos: this.currentPos,
      nextPiece: this.nextPiece,
      score: this.score,
      lines: this.lines,
      level: this.level,
      gameOver: this.gameOver,
      isPaused: this.isPaused
    };
  }

  spawnPiece() {
    this.currentPiece = this.nextPiece;
    this.nextPiece = new Piece();
    this.currentPos = {
      row: 0,
      col: Math.floor((this.board.COLS - this.currentPiece.getWidth()) / 2)
    };
    
    if (!this.board.isValidMove(this.currentPiece, this.currentPos.row, this.currentPos.col)) {
      this.gameOver = true;
    }
  }

  tick() {
    if (this.gameOver || this.isPaused) return;
    
    if (this.board.isValidMove(this.currentPiece, this.currentPos.row + 1, this.currentPos.col)) {
      this.currentPos.row++;
    } else {
      this.board.mergePiece(this.currentPiece, this.currentPos.row, this.currentPos.col);
      const cleared = this.board.clearLines();
      if (cleared) {
        this.score += cleared * 100;
        this.lines += cleared;
        this.level = 1 + Math.floor(this.lines / 10);
      }
      this.spawnPiece();
    }
    
    this.renderer.renderAll(this.getGameState());
  }

  move(dx) {
    if (this.board.isValidMove(this.currentPiece, this.currentPos.row, this.currentPos.col + dx)) {
      this.currentPos.col += dx;
      this.renderer.renderAll(this.getGameState());
    }
  }

  moveDown() {
    if (this.board.isValidMove(this.currentPiece, this.currentPos.row + 1, this.currentPos.col)) {
      this.currentPos.row++;
      this.renderer.renderAll(this.getGameState());
    }
  }

  drop() {
    while (this.board.isValidMove(this.currentPiece, this.currentPos.row + 1, this.currentPos.col)) {
      this.currentPos.row++;
    }
    this.tick();
  }

  rotatePiece() {
    const rotated = new Piece(this.currentPiece.shape);
    rotated.rotate();
    if (this.board.isValidMove(rotated, this.currentPos.row, this.currentPos.col)) {
      this.currentPiece = rotated;
      this.renderer.renderAll(this.getGameState());
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.renderer.renderAll(this.getGameState());
  }

  start() {
    this.reset();
    this.loop();
  }

  loop() {
    if (!this.gameOver) {
      setTimeout(() => {
        this.tick();
        this.loop();
      }, Math.max(100, this.TICK_MS - (this.level - 1) * 40));
    }
  }
} 
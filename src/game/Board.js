export class Board {
  constructor(rows = 20, cols = 10) {
    this.ROWS = rows;
    this.COLS = cols;
    this.EMPTY = 0;
    this.board = this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(this.EMPTY));
  }

  reset() {
    this.board = this.createEmptyBoard();
  }

  isValidMove(piece, row, col) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[0].length; c++) {
        if (piece.shape[r][c]) {
          let nr = row + r, nc = col + c;
          if (nr < 0 || nr >= this.ROWS || nc < 0 || nc >= this.COLS || this.board[nr][nc] !== this.EMPTY) {
            return false;
          }
        }
      }
    }
    return true;
  }

  mergePiece(piece, row, col) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[0].length; c++) {
        if (piece.shape[r][c]) {
          this.board[row + r][col + c] = 1;
        }
      }
    }
  }

  clearLines() {
    let cleared = 0;
    for (let r = this.ROWS - 1; r >= 0; r--) {
      if (this.board[r].every(cell => cell !== this.EMPTY)) {
        this.board.splice(r, 1);
        this.board.unshift(Array(this.COLS).fill(this.EMPTY));
        cleared++;
        r++;
      }
    }
    return cleared;
  }

  getCell(row, col) {
    return this.board[row][col];
  }
} 
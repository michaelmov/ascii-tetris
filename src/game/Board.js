export class Board {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.empty = 0;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(this.empty));
  }

  isValidMove(shape, row, col) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c]) {
          let nr = row + r, nc = col + c;
          if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols || this.grid[nr][nc] !== this.empty) {
            return false;
          }
        }
      }
    }
    return true;
  }

  mergePiece(piece, position) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[0].length; c++) {
        if (piece.shape[r][c]) {
          this.grid[position.row + r][position.col + c] = 1;
        }
      }
    }
  }

  clearLines() {
    let cleared = 0;
    for (let r = this.rows - 1; r >= 0; r--) {
      if (this.grid[r].every(cell => cell !== this.empty)) {
        this.grid.splice(r, 1);
        this.grid.unshift(Array(this.cols).fill(this.empty));
        cleared++;
        r++;
      }
    }
    return cleared;
  }

  reset() {
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(this.empty));
  }

  getCell(row, col) {
    return this.grid[row][col];
  }
} 
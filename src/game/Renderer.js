export class Renderer {
  constructor(gameBoard, nextPiece, scoreboard, instructions) {
    this.gameBoard = gameBoard;
    this.nextPiece = nextPiece;
    this.scoreboard = scoreboard;
    this.instructions = instructions;
    this.linesToClear = new Set();
  }

  setLinesToClear(lines) {
    this.linesToClear = new Set(lines);
  }

  renderBoard(board, currentPiece, currentPos, gameOver, isPaused) {
    let out = '';
    out += '<!'.padEnd(board.COLS * 4 + 2, '-') + '!>\n';
    
    for (let r = 0; r < board.ROWS; r++) {
      out += '<!';
      for (let c = 0; c < board.COLS; c++) {
        let filled = board.getCell(r, c) !== board.EMPTY;
        
        if (!gameOver && currentPiece) {
          for (let pr = 0; pr < currentPiece.shape.length; pr++) {
            for (let pc = 0; pc < currentPiece.shape[0].length; pc++) {
              if (
                currentPiece.shape[pr][pc] &&
                r === currentPos.row + pr &&
                c === currentPos.col + pc
              ) {
                filled = true;
              }
            }
          }
        }
        out += filled ? '[ ]' : ' . ';
      }
      out += '!>\n';
    }
    
    out += '<!'.padEnd(board.COLS * 4 + 2, '=') + '!>\n';
    out += 'V'.repeat(board.COLS * 2 + 2) + '\n';
    
    if (gameOver) {
      out += '\nGAME OVER!';
    } else if (isPaused) {
      out += '\nPAUSED';
    }
    
    this.gameBoard.textContent = out;
    
    // Apply flash animation to lines that are about to be cleared
    if (this.linesToClear.size > 0) {
      const lines = this.gameBoard.textContent.split('\n');
      this.linesToClear.forEach(row => {
        if (row >= 0 && row < lines.length - 3) { // -3 to account for border lines
          const line = lines[row + 1]; // +1 to account for top border
          if (line) {
            const flashLine = line.replace(/\[ \]/g, '█ █');
            lines[row + 1] = flashLine;
          }
        }
      });
      this.gameBoard.textContent = lines.join('\n');
    }
  }

  renderNext(piece) {
    let out = 'Next:\n';
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[0].length; c++) {
        out += piece.shape[r][c] ? '[ ]' : '   ';
      }
      out += '\n';
    }
    this.nextPiece.textContent = out;
  }

  renderScore(score, lines, level) {
    this.scoreboard.textContent =
      `LINES CLEARED: ${lines}\nLEVEL: ${level}\nSCORE: ${score}`;
  }

  renderInstructions() {
    this.instructions.textContent =
      `7/←: LEFT   9/→: RIGHT\n8/↑: ROTATE\n4/↓: SOFT DROP  5/SPACE: HARD DROP\nP: PAUSE`;
  }

  renderAll(gameState) {
    this.renderBoard(
      gameState.board,
      gameState.currentPiece,
      gameState.currentPos,
      gameState.gameOver,
      gameState.isPaused
    );
    this.renderNext(gameState.nextPiece);
    this.renderScore(gameState.score, gameState.lines, gameState.level);
    this.renderInstructions();
  }
} 
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

  render(board, current, next, position, gameState) {
    this.renderBoard(board, current, position, gameState);
    this.renderNext(next);
    this.renderScore(gameState);
    this.renderInstructions();
  }

  renderBoard(board, current, position, gameState) {
    let out = '';

    for (let r = 0; r < board.rows; r++) {
      out += '<!';
      for (let c = 0; c < board.cols; c++) {
        let filled = board.getCell(r, c) !== board.empty;

        if (!gameState.gameOver && current) {
          for (let pr = 0; pr < current.shape.length; pr++) {
            for (let pc = 0; pc < current.shape[0].length; pc++) {
              if (
                current.shape[pr][pc] &&
                r === position.row + pr &&
                c === position.col + pc
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

    out += '<!'.padEnd(board.cols * 3 + 2, '=') + '!>\n';

    if (gameState.gameOver) {
      out += '\nGAME OVER!\nPress R to play again';
    } else if (gameState.isPaused) {
      out += '\nPAUSED';
    }

    this.gameBoard.textContent = out;

    // Apply flash animation to lines that are about to be cleared
    if (this.linesToClear.size > 0) {
      const lines = this.gameBoard.textContent.split('\n');
      this.linesToClear.forEach((row) => {
        if (row >= 0 && row < lines.length - 3) {
          // -3 to account for border lines
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

  renderScore(gameState) {
    this.scoreboard.textContent = `LINES CLEARED: ${gameState.lines}\nLEVEL: ${gameState.level}\nSCORE: ${gameState.score}`;
  }

  renderInstructions() {
    this.instructions.textContent = `7/←: LEFT   9/→: RIGHT\n8/↑: ROTATE\n4/↓: SOFT DROP  5/SPACE: HARD DROP\nP: PAUSE    R: RESTART`;
  }
}

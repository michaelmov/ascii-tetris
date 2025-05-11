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
        let isAnimating = this.linesToClear.has(r);

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

        if (filled) {
          if (isAnimating) {
            const flashStates = ['█', '▓', '▒', '░'];
            const flashIndex = Math.floor(Date.now() / 50) % flashStates.length;
            out += `[${flashStates[flashIndex]}]`;
          } else {
            out += '[ ]';
          }
        } else {
          out += ' . ';
        }
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
  }

  renderNext(piece) {
    let out = 'NEXT:\n';
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
    this.instructions.textContent = `INSTURCTIONS:\n7/←: LEFT   9/→: RIGHT\n8/↑: ROTATE\n4/↓: SOFT DROP  5/SPACE: HARD DROP\nP: PAUSE    R: RESTART`;
  }
}

export class Renderer {
  constructor(gameBoard, nextPiece, scoreboard, instructions) {
    this.gameBoard = gameBoard;
    this.nextPiece = nextPiece;
    this.scoreboard = scoreboard;
    this.instructions = instructions;
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
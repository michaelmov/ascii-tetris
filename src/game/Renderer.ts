import { Board } from './Board';
import { Piece } from './Piece';
import { GameState } from './GameState';

interface Position {
  row: number;
  col: number;
}

enum GameMessage {
  NONE = '',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME OVER!<br>Press R to play again',
  // Future messages can be easily added here:
  // LEVEL_UP = 'LEVEL UP!',
  // TETRIS = 'TETRIS!',
  // etc.
}

export class Renderer {
  private readonly gameBoard: HTMLElement;
  private readonly nextPiece: HTMLElement;
  private readonly scoreboard: HTMLElement;
  private readonly instructions: HTMLElement;
  private readonly gameMessage: HTMLElement;
  private linesToClear: Set<number>;

  constructor(
    gameBoard: HTMLElement,
    nextPiece: HTMLElement,
    scoreboard: HTMLElement,
    instructions: HTMLElement,
    gameMessage: HTMLElement
  ) {
    this.gameBoard = gameBoard;
    this.nextPiece = nextPiece;
    this.scoreboard = scoreboard;
    this.instructions = instructions;
    this.gameMessage = gameMessage;
    this.linesToClear = new Set();
  }

  public setLinesToClear(lines: number[]): void {
    this.linesToClear = new Set(lines);
  }

  public render(
    board: Board,
    current: Piece | null,
    next: Piece,
    position: Position,
    gameState: GameState
  ): void {
    this.renderBoard(board, current, position, gameState);
    this.renderNext(next);
    this.renderScore(gameState);
    this.renderInstructions();
    this.renderGameMessage(gameState);
  }

  private renderBoard(
    board: Board,
    current: Piece | null,
    position: Position,
    gameState: GameState
  ): void {
    let out = '';

    for (let r = 0; r < board.getGrid().length; r++) {
      out += '<!';
      for (let c = 0; c < board.getGrid()[0].length; c++) {
        let filled = board.getCell(r, c) !== 0;
        let isAnimating = this.linesToClear.has(r);

        if (!gameState.isGameOver() && current) {
          for (let pr = 0; pr < current.getShape().length; pr++) {
            for (let pc = 0; pc < current.getShape()[0].length; pc++) {
              if (
                current.getShape()[pr][pc] &&
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

    out += '<!'.padEnd(board.getGrid()[0].length * 3 + 2, '=') + '!>\n';

    this.gameBoard.textContent = out;
  }

  private renderNext(piece: Piece): void {
    let out = 'NEXT:\n';
    for (let r = 0; r < piece.getShape().length; r++) {
      for (let c = 0; c < piece.getShape()[0].length; c++) {
        out += piece.getShape()[r][c] ? '[ ]' : '   ';
      }
      out += '\n';
    }
    this.nextPiece.textContent = out;
  }

  private renderScore(gameState: GameState): void {
    this.scoreboard.textContent = `LINES CLEARED: ${gameState.getLines()}\nLEVEL: ${gameState.getLevel()}\nSCORE: ${gameState.getScore()}`;
  }

  private renderInstructions(): void {
    this.instructions.textContent = `INSTRUCTIONS:\n7/←: LEFT   9/→: RIGHT\n8/↑: ROTATE\n4/↓: SOFT DROP\n5/SPACE: HARD DROP\nP: PAUSE    R: RESTART`;
  }

  private renderGameMessage(gameState: GameState): void {
    let message: GameMessage = GameMessage.NONE;
    
    if (gameState.isGameOver()) {
      message = GameMessage.GAME_OVER;
    } else if (gameState.getIsPaused()) {
      message = GameMessage.PAUSED;
    }
    
    this.gameMessage.innerHTML = message;
  }

  /**
   * Set a custom message to display in the game message area
   * @param message The message to display, or empty string to clear
   */
  public setCustomMessage(message: string): void {
    this.gameMessage.innerHTML = message;
  }
}

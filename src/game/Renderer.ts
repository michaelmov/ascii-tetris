import { Board } from './Board';
import { Piece } from './Piece';
import { GameState } from './GameState';

interface Position {
  row: number;
  col: number;
}

export class Renderer {
  private readonly gameBoard: HTMLElement;
  private readonly nextPiece: HTMLElement;
  private readonly scoreboard: HTMLElement;
  private readonly instructions: HTMLElement;
  private linesToClear: Set<number>;

  constructor(
    gameBoard: HTMLElement,
    nextPiece: HTMLElement,
    scoreboard: HTMLElement,
    instructions: HTMLElement
  ) {
    this.gameBoard = gameBoard;
    this.nextPiece = nextPiece;
    this.scoreboard = scoreboard;
    this.instructions = instructions;
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

    if (gameState.isGameOver()) {
      out += '\nGAME OVER!\nPress R to play again';
    } else if (gameState.getIsPaused()) {
      out += '\nPAUSED';
    }

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
}

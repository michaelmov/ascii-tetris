import { Board } from './Board';
import { GameState } from './GameState';
import { InputHandler } from './InputHandler';
import { Piece } from './Piece';
import { Renderer } from './Renderer';

interface Position {
  row: number;
  col: number;
}

export class Game {
  private readonly ROWS: number;
  private readonly COLS: number;
  private readonly TICK_MS: number;

  private board: Board;
  private gameState: GameState;
  private renderer: Renderer;
  private inputHandler: InputHandler;

  private current: Piece | null;
  private next: Piece | null;
  private position: Position | null;
  private isStarted: boolean;
  private tickInterval: number | null;

  constructor(renderer: Renderer) {
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

  public start(): void {
    if (!this.isStarted) {
      const startScreen = document.getElementById('start-screen');
      const tetrisContainer = document.getElementById('tetris-container');

      if (startScreen && tetrisContainer) {
        startScreen.style.display = 'none';
        tetrisContainer.style.display = 'flex';
      }

      this.isStarted = true;
      this.spawnPiece();
      this.tickInterval = window.setInterval(() => this.tick(), this.TICK_MS);
    }
  }

  private spawnPiece(): void {
    this.current = this.next || new Piece();
    this.next = new Piece();
    this.position = {
      row: 0,
      col: Math.floor((this.COLS - this.current.getWidth()) / 2),
    };

    if (
      !this.board.isValidMove(
        this.current.getShape(),
        this.position.row,
        this.position.col
      )
    ) {
      this.gameState.setGameOver();
    }
  }

  private tick(): void {
    if (this.gameState.isGameOver() || this.gameState.getIsPaused()) return;

    if (
      this.board.isValidMove(
        this.current!.getShape(),
        this.position!.row + 1,
        this.position!.col
      )
    ) {
      this.position!.row++;
    } else {
      this.board.mergePiece(this.current!, this.position!);

      // Find lines that are about to be cleared
      const linesToClear: number[] = [];
      for (let r = this.ROWS - 1; r >= 0; r--) {
        if (this.board.getGrid()[r].every((cell) => cell !== 0)) {
          linesToClear.push(r);
        }
      }

      if (linesToClear.length > 0) {
        // Start the animation
        this.renderer.setLinesToClear(linesToClear);
        this.render();

        // Wait for animation to complete before clearing
        setTimeout(() => {
          const clearedLines = this.board.clearLines();
          this.gameState.updateScore(clearedLines);
          this.renderer.setLinesToClear([]);
          this.spawnPiece();
          this.render();
        }, 300);
        return;
      } else {
        this.spawnPiece();
      }
    }
    this.render();
  }

  public move(dx: number): void {
    if (
      this.board.isValidMove(
        this.current!.getShape(),
        this.position!.row,
        this.position!.col + dx
      )
    ) {
      this.position!.col += dx;
      this.render();
    }
  }

  public moveDown(): void {
    if (
      this.board.isValidMove(
        this.current!.getShape(),
        this.position!.row + 1,
        this.position!.col
      )
    ) {
      this.position!.row++;
      this.render();
    }
  }

  public drop(): void {
    while (
      this.board.isValidMove(
        this.current!.getShape(),
        this.position!.row + 1,
        this.position!.col
      )
    ) {
      this.position!.row++;
    }
    this.tick();
  }

  public rotatePiece(): void {
    this.current!.rotate();
    if (
      !this.board.isValidMove(
        this.current!.getShape(),
        this.position!.row,
        this.position!.col
      )
    ) {
      // If rotation is invalid, rotate back
      this.current!.rotate();
      this.current!.rotate();
      this.current!.rotate();
    }
    this.render();
  }

  public togglePause(): void {
    this.gameState.togglePause();
    this.render();
  }

  public restart(): void {
    // Clear existing interval
    if (this.tickInterval) {
      window.clearInterval(this.tickInterval);
    }

    this.gameState.reset();
    this.board.reset();
    this.current = null;
    this.next = null;
    this.position = null;
    this.spawnPiece();
    // Start new interval
    this.tickInterval = window.setInterval(() => this.tick(), this.TICK_MS);
    this.render();
  }

  private render(): void {
    this.renderer.render(
      this.board,
      this.current,
      this.next!,
      this.position!,
      this.gameState
    );
  }

  public getIsStarted(): boolean {
    return this.isStarted;
  }

  public getGameState(): GameState {
    return this.gameState;
  }
}

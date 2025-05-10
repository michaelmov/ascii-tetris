import { Game } from './src/game/Game.js';
import { Renderer } from './src/game/Renderer.js';

// ASCII Tetris Game

const ROWS = 20;
const COLS = 10;
const EMPTY = 0;
const TICK_MS = 500;

const PIECES = [
  // O
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  // I
  {
    shape: [
      [1, 1, 1, 1],
    ],
  },
  // Z
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  // L
  {
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  // T
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
let current, next, pos, score = 0, lines = 0, level = 1, gameOver = false, isPaused = false;

function randomPiece() {
  const idx = Math.floor(Math.random() * PIECES.length);
  return JSON.parse(JSON.stringify(PIECES[idx]));
}

function spawnPiece() {
  current = next || randomPiece();
  next = randomPiece();
  pos = { row: 0, col: Math.floor((COLS - current.shape[0].length) / 2) };
  if (!validMove(current.shape, pos.row, pos.col)) {
    gameOver = true;
  }
}

function rotate(shape) {
  // Clockwise rotation
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function validMove(shape, row, col) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c]) {
        let nr = row + r, nc = col + c;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== EMPTY) {
          return false;
        }
      }
    }
  }
  return true;
}

function mergePiece() {
  for (let r = 0; r < current.shape.length; r++) {
    for (let c = 0; c < current.shape[0].length; c++) {
      if (current.shape[r][c]) {
        board[pos.row + r][pos.col + c] = 1;
      }
    }
  }
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== EMPTY)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(EMPTY));
      cleared++;
      r++;
    }
  }
  if (cleared) {
    score += cleared * 100;
    lines += cleared;
    level = 1 + Math.floor(lines / 10);
  }
}

function renderBoard() {
  let out = '';
  out += '<!'.padEnd(COLS * 4 + 2, '-') + '!>\n';
  for (let r = 0; r < ROWS; r++) {
    out += '<!';
    for (let c = 0; c < COLS; c++) {
      let filled = board[r][c] !== EMPTY;
      // Overlay current piece
      if (!gameOver) {
        for (let pr = 0; pr < current.shape.length; pr++) {
          for (let pc = 0; pc < current.shape[0].length; pc++) {
            if (
              current.shape[pr][pc] &&
              r === pos.row + pr &&
              c === pos.col + pc
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
  out += '<!'.padEnd(COLS * 4 + 2, '=') + '!>\n';
  out += 'V'.repeat(COLS * 2 + 2) + '\n';
  document.getElementById('game-board').textContent = out;
}

function renderNext() {
  let out = 'Next:\n';
  for (let r = 0; r < next.shape.length; r++) {
    for (let c = 0; c < next.shape[0].length; c++) {
      out += next.shape[r][c] ? '[ ]' : '   ';
    }
    out += '\n';
  }
  document.getElementById('next-piece').textContent = out;
}

function renderScore() {
  document.getElementById('scoreboard').textContent =
    `LINES CLEARED: ${lines}\nLEVEL: ${level}\nSCORE: ${score}`;
}

function renderInstructions() {
  document.getElementById('instructions').textContent =
    `7/←: LEFT   9/→: RIGHT\n8/↑: ROTATE\n4/↓: SOFT DROP  5/SPACE: HARD DROP\nP: PAUSE`;
}

function renderAll() {
  renderBoard();
  renderNext();
  renderScore();
  renderInstructions();
  if (gameOver) {
    document.getElementById('game-board').textContent += '\nGAME OVER!';
  } else if (isPaused) {
    document.getElementById('game-board').textContent += '\nPAUSED';
  }
}

function tick() {
  if (gameOver || isPaused) return;
  if (validMove(current.shape, pos.row + 1, pos.col)) {
    pos.row++;
  } else {
    mergePiece();
    clearLines();
    spawnPiece();
  }
  renderAll();
}

function move(dx) {
  if (validMove(current.shape, pos.row, pos.col + dx)) {
    pos.col += dx;
    renderAll();
  }
}

function drop() {
  while (validMove(current.shape, pos.row + 1, pos.col)) {
    pos.row++;
  }
  tick();
}

function rotatePiece() {
  const rotated = rotate(current.shape);
  if (validMove(rotated, pos.row, pos.col)) {
    current.shape = rotated;
    renderAll();
  }
}

// Initialize the renderer with DOM elements
const renderer = new Renderer(
  document.getElementById('game-board'),
  document.getElementById('next-piece'),
  document.getElementById('scoreboard'),
  document.getElementById('instructions')
);

// Create and start the game
const game = new Game(renderer);

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (game.gameOver) return;
  
  if (e.key.toLowerCase() === 'p') {
    game.togglePause();
    return;
  }
  
  if (game.isPaused) return;
  
  switch (e.key) {
    case '7': // left
    case 'ArrowLeft':
      game.move(-1);
      break;
    case '9': // right
    case 'ArrowRight':
      game.move(1);
      break;
    case '8': // rotate
    case 'ArrowUp':
      game.rotatePiece();
      break;
    case '4': // soft drop
    case 'ArrowDown':
      game.moveDown();
      break;
    case '5': // hard drop
    case ' ': // space
      game.drop();
      break;
  }
});

// Start the game
game.start();

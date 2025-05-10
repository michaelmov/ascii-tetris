export class Piece {
  static PIECES = [
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

  constructor(shape = null) {
    this.shape = shape ? JSON.parse(JSON.stringify(shape)) : this.getRandomPiece().shape;
  }

  getRandomPiece() {
    const idx = Math.floor(Math.random() * Piece.PIECES.length);
    return JSON.parse(JSON.stringify(Piece.PIECES[idx]));
  }

  rotate() {
    // Clockwise rotation
    this.shape = this.shape[0].map((_, i) => 
      this.shape.map(row => row[i]).reverse()
    );
  }

  getWidth() {
    return this.shape[0].length;
  }

  getHeight() {
    return this.shape.length;
  }
} 
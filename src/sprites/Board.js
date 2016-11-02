import Bubble from './Bubble';

export default class Board {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.grid = [];
    this.maxRows = 0;
    this.maxCols = 0;
  }

  createGrid(maxRows, maxCols) {
      this.maxRows = maxRows;
      this.maxCols = maxCols;
      this.grid = [];

      for(var row = 0; row < this.maxRows; row++) {
        this.grid[row] = [];
        var mod = row % 2 === 0;

        for (var col = 0; col < this.maxCols; col++) {
          // last col
          if (!mod && col >= this.maxCols - 1) {
            continue;
          }

          var bubble = new Bubble({
            game: this.game,
            x: this.leftBound + i * this.bubbleRadius + this.bubbleRadius / 2,
            y: 400 + j * this.bubbleRadius,
            asset: 'bluebubble',
            rightBound: this.rightBound,
            leftBound: this.leftBound
          });

          this.grid[row][col] = bubble;
        }
      }
  }
}

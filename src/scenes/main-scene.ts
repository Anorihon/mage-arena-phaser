import { Board, QuadGrid } from 'phaser3-rex-plugins/plugins/board-components.js';
import {TileXYType} from "phaser3-rex-plugins/plugins/board/types/Position";

export class MainScene extends Phaser.Scene {
  private bg: Phaser.GameObjects.Image // background image

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.load.image('bg', '../assets/desk-bg.jpg');
    this.load.atlas('map', '../assets/map.png', '../assets/map.json');
  }

  create(): void {
    // Setup bg image
    this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
    this.bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Generate map
    const ROWS: number = 12;
    const COLS: number = 12;
    const CELL_SIZE: number = Math.floor(this.cameras.main.height / ROWS);
    const board = new Board(this, {
      grid: new QuadGrid({
        x: 0,
        y: 0,
        cellWidth: CELL_SIZE,
        cellHeight: CELL_SIZE,
        type: 0
      }),
      width: COLS,
      height: ROWS
    });

    // Fill base grid
    board.forEachTileXY(function (tileXY, board) {
      board.addChess(
          this.add.image(0, 0, 'map', 'earth').setOrigin(0, 0).setDisplaySize(CELL_SIZE, CELL_SIZE),
          tileXY.x, tileXY.y, 0, true);
    }, this);

    // Get 4 tiles coordinates
    const forestList: Array<TileXYType> = [];
    const startX: number = 4;
    const startY: number = 2;

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const tileXY: TileXYType = {
          x: startX + i,
          y: startY + j
        };

        forestList.push(tileXY);
      }
    }

    // Get Cells by coordinates
    const chessForest: Array<Phaser.GameObjects.GameObject> = board.tileXYArrayToChessArray(forestList);

    // Change frame to Forest for Cells
    chessForest.forEach(chess => {
      (chess as Phaser.GameObjects.Image).setFrame('forest');
    });
  }
}

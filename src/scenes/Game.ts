import { Sizer, GridSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import Board from "../objects/Board";
import ChooseSquad from "../ui/ChooseSquad";
import Database from "../utils/Database";
import IRexScene from "../interfaces/IRexScene";


export class Game extends Phaser.Scene implements IRexScene{
  public rexUI: RexUIPlugin

  private bg: Phaser.GameObjects.Image // background image
  private mainLayout: GridSizer
  private board: Board

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.load.image('bg', '../assets/desk-bg.jpg');
    this.load.image('hero', '../assets/img/hero.png');
    this.load.image('button', '../assets/img/button.png');
    this.load.atlas('map', '../assets/map.png', '../assets/map.json');
    this.load.atlas('fractions', '../assets/img/fractions.png', '../assets/img/fractions.json');
    this.load.json('db', '../assets/data/db.json');
  }

  create(): void {
    const totalRows: number = 1;
    const totalCols: number = 3;
    const { width: screenWidth, height: screenHeight } = this.cameras.main;

    // Init Database
    Database.init(this);

    this.mainLayout = new GridSizer(this,{
      column: totalCols,
      row: totalRows,
      columnProportions: 1,
      rowProportions: 1,
    });

    // Setup bg image
    this.bg = this.add.image(screenWidth / 2, screenHeight / 2, 'bg');
    this.mainLayout.addBackground(this.bg);

    // const RandomInt = Phaser.Math.Between;

    // for (let row = 0; row < totalRows; row++) {
    //   for (let col = 0; col < totalCols; col++) {
    //
    //     this.mainLayout.add(
    //         this.add.rectangle(0, 0, 300, 300, RandomInt(0, 0x1000000)),
    //         {
    //           column: col,
    //           row: row,
    //           expand: true
    //         }
    //     );
    //   }
    // }

    this.board = new Board(this);
    this.mainLayout.add(
        this.board,
        { column: 1, row: 1, align: 'left-top' }
    );

    // Choose squad scene
    // new ChooseSquad(this);

    this.scale.on('resize', this.onResize, this);
    this.scale.refresh();
  }

  onResize(gameSize: Phaser.Structs.Size) {
    const { width: screenWidth, height: screenHeight } = gameSize;
    const centerX: number = screenWidth / 2;
    const centerY: number = screenHeight / 2;
    const { TOTAL_COLS, cellSize } = Board;
    const BOARD_PROPORTION: number = cellSize * TOTAL_COLS / screenWidth;
    const COLUMN_PROPORTION: number = (1 - BOARD_PROPORTION) / 2;

    this.mainLayout
        .setPosition(centerX, centerY)
        .setMinSize(screenWidth, screenHeight)
        .setColumnProportion(0, COLUMN_PROPORTION)
        .setColumnProportion(1, BOARD_PROPORTION)
        .setColumnProportion(2, COLUMN_PROPORTION)
        .layout();
  }
}

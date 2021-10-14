import { Sizer, GridSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Board from "../objects/Board";
import ChooseSquad from "../ui/ChooseSquad";


export class MainScene extends Phaser.Scene {
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
  }

  create(): void {
    const totalRows: number = 1;
    const totalCols: number = 3;
    const { width: screenWidth, height: screenHeight } = this.cameras.main;

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
        { column: 1, row: 1 }
    );

    // Choose squad scene
    new ChooseSquad(this);

    this.scale.on('resize', this.onResize, this);
    this.scale.refresh();

    // Layout
    // const mainSizer = new Sizer(this,{
    //   x: screenWidth / 2,
    //   y: screenHeight / 2,
    //   orientation: 'x',
    //   width: screenWidth,
    //   height: screenHeight,
    // });
    // this.add.existing(mainSizer);

    // const TOTAL_ROWS: number = 12;
    // const TOTAL_COLS: number = 12;
    // const CELL_SIZE: number = Math.floor(screenHeight / TOTAL_ROWS);
    // const BOARD_PROPORTION: number = CELL_SIZE * TOTAL_COLS / screenWidth;
    // const COLUMN_PROPORTION: number = (1 - BOARD_PROPORTION) / 2;
    //
    // mainSizer
    //     // .add(this.add.zone(0, 0, 100, screenHeight),1)
    //     .add(this.add.rectangle(0, 0, 100, screenHeight,0x00FABD), COLUMN_PROPORTION)
    //     .add(new Board(this), BOARD_PROPORTION)
    //     .add(this.add.rectangle(0, 0, 100, screenHeight,0x6DBDAA), COLUMN_PROPORTION)
    //     .layout();



    // Create map
    // new Map(this);

    // this.firebaseTest();
  }

  onResize(gameSize: Phaser.Structs.Size) {
    const { width: screenWidth, height: screenHeight } = gameSize;
    const centerX: number = screenWidth / 2;
    const centerY: number = screenHeight / 2;
    const { TOTAL_ROWS, TOTAL_COLS } = Board;
    const CELL_SIZE: number = Math.floor(screenHeight / TOTAL_ROWS);
    const BOARD_PROPORTION: number = CELL_SIZE * TOTAL_COLS / screenWidth;
    const COLUMN_PROPORTION: number = (1 - BOARD_PROPORTION) / 2;

    this.game.registry.set('cell_size', CELL_SIZE);

    this.mainLayout
        .setPosition(centerX, centerY)
        .setMinSize(screenWidth, screenHeight)
        .setColumnProportion(0, COLUMN_PROPORTION)
        .setColumnProportion(1, BOARD_PROPORTION)
        .setColumnProportion(2, COLUMN_PROPORTION)
        .layout();
  }

  async firebaseTest() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAAUpGOY7lBxacetipo7wSo2-Ks5vzdQM4",
      authDomain: "mage-arena-ddae5.firebaseapp.com",
      projectId: "mage-arena-ddae5",
      storageBucket: "mage-arena-ddae5.appspot.com",
      messagingSenderId: "841478924881",
      appId: "1:841478924881:web:f725b0d643a1cf21846670"
    };

    // Initialize Firebase
    initializeApp(firebaseConfig);

    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "fractions"));

    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }
}

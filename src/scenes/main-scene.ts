import { Sizer, GridSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import Map from "../objects/Map";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {Cell} from "../objects/Cell";


export class MainScene extends Phaser.Scene {
  private bg: Phaser.GameObjects.Image // background image

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.load.image('bg', '../assets/desk-bg.jpg');
    this.load.image('hero', '../assets/img/hero.png');
    this.load.atlas('map', '../assets/map.png', '../assets/map.json');
  }

  create(): void {
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // Setup bg image
    this.bg = this.add.image(screenWidth / 2, screenHeight / 2, 'bg');
    this.bg.setDisplaySize(screenWidth, screenHeight);

    // Layout
    const mainSizer = new Sizer(this,{
      x: screenWidth / 2,
      y: screenHeight / 2,
      orientation: 'x',
      width: screenWidth,
      height: screenHeight,
    });
    this.add.existing(mainSizer);

    const totalRows = 12;
    const totalCols = 12;
    const grid = new GridSizer(this, {
      column: totalCols,
      row: totalRows
    });
    this.add.existing(grid);

    for(let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        const cell = new Cell(this, 0, 0);

        grid.add(cell, col, row);
      }
    }

    mainSizer
        // .add(this.add.zone(0, 0, 100, screenHeight),1)
        .add(this.add.rectangle(0, 0, 100, screenHeight,0x00FABD),1)
        .add(grid,3)
        // .add(this.add.rectangle(0, 0, 100, screenHeight,0x068465),3, 'center')
        .add(this.add.rectangle(0, 0, 100, screenHeight,0x6DBDAA),1)
        .layout();

    // Create map
    // new Map(this);

    // this.firebaseTest();
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

    // @ts-ignore
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "fractions"));

    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }
}

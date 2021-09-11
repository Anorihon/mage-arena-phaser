import Map from "../objects/Map";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';


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
    // Setup bg image
    this.bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
    this.bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Create map
    new Map(this);

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

import 'Phaser';
import { GameConfig } from './config';

export class App extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new App(GameConfig);
});

import 'Phaser';
import { GameConfig } from './config';

export class Game extends Phaser.Game {
  public fun: string = 'wow'
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new Game(GameConfig);
});

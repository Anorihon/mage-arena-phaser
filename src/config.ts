import {Game} from './scenes/Game';
import ScaleModes = Phaser.Scale.ScaleModes;
import GrayScalePipelinePlugin from 'phaser3-rex-plugins/plugins/grayscalepipeline-plugin.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
// import ScaleOuterPlugin from 'phaser3-rex-plugins/plugins/scaleouter-plugin.js';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Mage Arena',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  width: 1280,
  height: 800,
  backgroundColor: 0x3a404d,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [Game],
  scale: {
     mode: ScaleModes.RESIZE
  },
  plugins: {
    global: [
      {
        key: 'rexGrayScalePipeline',
        plugin: GrayScalePipelinePlugin,
        start: true
      },
    ],
    scene: [{
      key: 'rexUI',
      plugin: RexUIPlugin,
      mapping: 'rexUI'
    }]
  },
  disableContextMenu: true
};

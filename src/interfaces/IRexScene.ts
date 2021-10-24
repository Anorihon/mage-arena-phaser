import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export default interface IRexScene extends Phaser.Scene {
    rexUI: RexUIPlugin;
}
import GameBoard from "./GameBoard";

export default class UnitChipParam extends Phaser.GameObjects.Container {
    shape: Phaser.GameObjects.Rectangle
    shapeText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, text: string = '-', shapeColor: number = 0xffffff, textColor: string = '#ffffff') {
        super(scene);

        const shapeSize: number = GameBoard.CELL_SIZE * .25;

        this.width = shapeSize;
        this.height = shapeSize;

        this.shape = scene.add
            .rectangle(0, 0, shapeSize, shapeSize)
            .setFillStyle(shapeColor);

        this.shapeText = scene.add
            .text(0, 0, text, {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: textColor
                // strokeThickness: 0.5
            })
            .setOrigin(.5, .5);

        this.add([this.shape, this.shapeText]);
        scene.add.existing(this);
    }
}
import Map from "./Map";
import UnitChipParam from "./UnitChipParam";


export default class Unit extends Phaser.GameObjects.Container {
    hp: number = 1
    meleePower: number = 1
    shootRange: number = 0
    shootAccuracy: number = 0
    magicDefense: number = 0

    constructor(scene: Phaser.Scene) {
        super(scene);

        this.width = Map.CELL_SIZE;
        this.height = Map.CELL_SIZE;

        const card: Phaser.GameObjects.Image = scene.add.image(0, 0, 'hero');
        const bounds: Phaser.Geom.Rectangle = card.getBounds();

        const halfOfCell: number = Map.CELL_SIZE * .5;

        const scaleMod: number = .25;
        const scaledWidth: number = bounds.width * scaleMod;
        const scaledHeight: number = bounds.height * scaleMod;
        const cropWidth: number = bounds.width * (Map.CELL_SIZE / scaledWidth);
        const cropHeight: number = bounds.height * (Map.CELL_SIZE / scaledHeight);

        card
            .setPosition(0, -halfOfCell)
            .setOrigin(.5, .05)
            .setScale(scaleMod)
            .setCrop(
                (bounds.width - cropWidth) / 2,
                bounds.height * .05,
                cropWidth, cropHeight
            );
        this.add(card);

        // @ts-ignore
        scene.plugins.get('rexGrayScalePipeline').add(card);

        setTimeout(() => {
            // @ts-ignore
            scene.plugins.get('rexGrayScalePipeline').remove(card);
        }, 3000);

        // Border
        const borderWidth: number = 4;
        const border = scene.add.graphics()
            .lineStyle(borderWidth, 0x8826A5FF, 1)
            .strokeRect(
                -halfOfCell + borderWidth / 2,
                -halfOfCell + borderWidth / 2,
                Map.CELL_SIZE - borderWidth,
                Map.CELL_SIZE - borderWidth
            )
        ;
        this.add(border);

        // --- Params ---
        let shape: UnitChipParam;

        shape = new UnitChipParam(scene, '4', 0xff0000);
        Phaser.Display.Align.In.TopLeft(shape, this);
        this.add(shape);

        shape = new UnitChipParam(scene, '4', 0x0095ff);
        Phaser.Display.Align.In.TopRight(shape, this);
        this.add(shape);

        shape = new UnitChipParam(scene, '4/2', 0xffa500, '#000');
        Phaser.Display.Align.In.BottomLeft(shape, this);
        this.add(shape);

        shape = new UnitChipParam(scene, '4', 0x4caf50);
        Phaser.Display.Align.In.BottomRight(shape, this);
        this.add(shape);

        scene.add.existing(this);
    }
}
import Map from './Map';

export enum FieldTypes {Field, Forest, Mount, Water, Swamp}

export class Cell extends Phaser.GameObjects.Container {
    private readonly bg: Phaser.GameObjects.Image
    private cellType: FieldTypes = FieldTypes.Field


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.width = Map.CELL_SIZE;
        this.height = Map.CELL_SIZE;

        // Create main texture
        this.bg = scene.add.image(0, 0, 'map', 'earth');
        // this.bg.setOrigin(0, 0);
        this.bg.setDisplaySize(Map.CELL_SIZE, Map.CELL_SIZE);

        this.add(this.bg);
        scene.add.existing(this);
    }

    set fieldType(value: FieldTypes) {
        let frameName: string = 'earth';

        this.cellType = value;

        switch (value) {
            case FieldTypes.Forest: frameName = 'forest'; break;
            case FieldTypes.Mount: frameName = 'mount'; break;
            case FieldTypes.Swamp: frameName = 'swamp'; break;
            case FieldTypes.Water: frameName = 'water'; break;
        }

        this.bg.setFrame(frameName);
    }

    get fieldType(): FieldTypes {
        return this.cellType;
    }

    get row(): number {
        // @ts-ignore
        return this.rexChess.tileXYZ.y;
    }

    get col(): number {
        // @ts-ignore
        return this.rexChess.tileXYZ.x;
    }
}
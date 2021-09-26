import Map from './Map';

export enum FieldTypes {Field, Forest, Mount, Water, Swamp}

export class Cell extends Phaser.GameObjects.Container {
    private static readonly HIGHLIGHT_COLOR: number = 0x00c700
    private static readonly HIGHLIGHT_ALPHA: number = .6

    private readonly bg: Phaser.GameObjects.Image
    private cellType: FieldTypes = FieldTypes.Field
    private highlight: Phaser.GameObjects.Rectangle

    col: number
    row: number


    constructor(scene: Phaser.Scene, col: number, row: number) {
        super(scene);
        
        const cellSize: number = Math.floor(scene.cameras.main.height / 12);

        this.width = cellSize;
        this.height = cellSize;
        this.col = col;
        this.row = row;

        // Create main texture
        this.bg = scene.add.image(0, 0, 'map', 'earth');
        this.bg.setDisplaySize(cellSize, cellSize);

        this.highlight = scene.add
            .rectangle(0, 0, cellSize, cellSize)
            .setFillStyle(Cell.HIGHLIGHT_COLOR, Cell.HIGHLIGHT_ALPHA)
            .setVisible(false);

        this.add([this.bg, this.highlight]);
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

    setHighlight(visible: boolean, color?: number, alpha?: number) {
        if (color || alpha) {
            this.highlight.setFillStyle(
                color ? color : Cell.HIGHLIGHT_COLOR,
                alpha ? alpha : Cell.HIGHLIGHT_ALPHA
            );
        }

        this.highlight.setVisible(visible);
    }

    isHighlighted(): boolean {
        return this.highlight.visible;
    }
}
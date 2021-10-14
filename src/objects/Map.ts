import {Board, QuadGrid, MiniBoard, MoveTo} from 'phaser3-rex-plugins/plugins/board-components.js';
import {Cell, FieldTypes} from "./Cell";
import GameObject = Phaser.GameObjects.GameObject;
import {TileXYType} from "phaser3-rex-plugins/plugins/board/types/Position";
import Unit from "./Unit";


export default class Map {
    static readonly ROWS: number = 12;
    static readonly COLS: number = 12;

    public static CELL_SIZE: number = 50;

    public board: Board;
    public cellsBoard: MiniBoard;
    public unitsBoard: MiniBoard;


    constructor(scene: Phaser.Scene) {
        // Update cell size
        Map.CELL_SIZE = Math.floor(scene.cameras.main.height / Map.ROWS);

        // Create board
        const alignX: number = scene.cameras.main.width / 2 - Map.COLS / 2 * Map.CELL_SIZE + Map.CELL_SIZE / 2;
        const alignY: number = scene.cameras.main.height / 2 - Map.ROWS / 2 * Map.CELL_SIZE + Map.CELL_SIZE / 2;

        const grid: QuadGrid = new QuadGrid({
            x: alignX,
            y: alignY,
            cellWidth: Map.CELL_SIZE,
            cellHeight: Map.CELL_SIZE,
            type: 0
        });

        this.board = new Board(scene, {
            grid,
            width: Map.COLS,
            height: Map.ROWS
        });

        // Create cells mini-board
        this.cellsBoard = new MiniBoard(
            scene,
            alignX, alignY,
            {
                grid,
                draggable: false
            }
        );

        // Create units miniboard
        this.unitsBoard = new MiniBoard(
            scene,
            alignX, alignY,
            {
                grid,
                draggable: false
            }
        );

        // Fill base grid
        this.board.forEachTileXY((tileXY, board) => {
            this.cellsBoard.addChess(
                new Cell(scene, 0, 0),
                tileXY.x, tileXY.y, 0
            );
        }, this);

        // Generate map
        this.generate_grid();

        const unit: Unit = new Unit(scene);
        this.unitsBoard
            // .setOrigin(0, 0)
            .addChess(
                unit,
                2, 1, 1
            )
            .setOrigin(0, 0)
            .putOnMainBoard(this.board)
            .alignToMainBoard(this.board)
        ;
        // this.board.gridAlign();
        // this.unitsBoard.pullOutFromMainBoard();

        const moveTo: MoveTo = new MoveTo(unit, {
            speed: 400,
            rotateToTarget: false,
            occupiedTest: false,
            blockerTest: false,
            sneak: true
        });

        // Listen events
        this.cellsBoard.setInteractive();

        this.cellsBoard.on('gameobjectup', (pointer : TouchEvent, cell: Cell) => {
            const {row, col, fieldType} = cell;

            console.log(FieldTypes[fieldType], row, col);

            // moveTo.moveTo(col, row);


            this.unitsBoard.pullOutFromMainBoard();

            const dirs: Array<number> = [0, 1, 2, 3];
            const cellsInRow: number = 3;

            dirs.forEach(dirIndex => {
                let chess = this.board.getNeighborChess(cell, dirIndex);

                if (chess) {
                    let _cell: Cell = (chess as Cell);
                    _cell.setHighlight(!_cell.isHighlighted());

                    for (let i = 0; i < cellsInRow - 1; i++) {
                        // @ts-ignore
                        chess = this.board.getNeighborChess(chess, dirIndex);

                        if (!chess) break;

                        _cell = (chess as Cell);
                        _cell.setHighlight(!_cell.isHighlighted());
                    }
                }
            });
            // const neighborChess = this.board.getNeighborChess(cell, [0, 1, 2, 3]);
            //
            // if (Array.isArray(neighborChess)) {
            //     neighborChess.forEach(chess => {
            //         const _cell: Cell = (chess as Cell);
            //         _cell.setHighlight(!_cell.isHighlighted());
            //     });
            // }else if (neighborChess) {
            //     const _cell: Cell = (neighborChess as Cell);
            //     _cell.setHighlight(!_cell.isHighlighted());
            // }

            // cell.setHighlight(!cell.isHighlighted());

            this.unitsBoard.putBack();
        });

        scene.input.keyboard.on('keyup-M', () => {
            this.generate_grid(true);
        });

        scene.input.keyboard.on('keyup-F', () => {
            this.flipBoard();
        });
    }

    generate_grid(resetCells: boolean = false) {
        this.cellsBoard
            .putOnMainBoard(this.board)
            .alignToMainBoard(this.board);

        const cellsList : Array<GameObject> = this.board.getAllChess();
        const cellsCount : number = cellsList.length;

        // Reset cells to Field state
        if(resetCells === true) {
            cellsList.forEach(cell => {
                if (cell) {
                    (cell as Cell).fieldType = FieldTypes.Field;
                }
            });
        }

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                let startRow : number = row * 6 // задаем стартовую ячейку в рядочке разделенных квадратов
                let startCol : number = col * 6 // задаем стартовую ячейку в столбике разделенных квадратов
                let finRow : number = startRow + 5 // задаем конечную ячейку в рядочке разделенных квадратов
                let finCol : number = startCol + 5 // задаем конечную ячейку в столбике разделенных квадратов
                let workCells : Array<Cell> = [] // создаем пустой массив
                let isVertical : boolean = Math.random() >= 0.5 // случайным образом определяем TRUE или FALSE
                let rand : number // создаем переменную с именем rand

                // --- Fill Swamp ---
                for (let i = 0; i < cellsCount; i++) {
                    const cell : Cell = cellsList[i] as Cell;

                    if (
                        cell.fieldType == FieldTypes.Field && // если ячейка является саваной
                        cell.row >= startRow + 1 && cell.row < finRow && // если ячейка в ходит в указанную область в рядочке
                        cell.col >= startCol + 1 && cell.col < finCol // если ячейка в ходит в указанную область в столбце
                    ) {
                        workCells.push(cell);
                    }                    
                }

                workCells[Phaser.Math.Between(0, workCells.length - 1)].fieldType = FieldTypes.Swamp; // создаем  массив, из пройденных условие, ячеек и добавляем им тип болото

                // --- Fill water ---
                // Find all available cells in range
                workCells = []; // сбрасываем массив пустых ячеек

                for (let i = 0; i < cellsCount; i++) {
                    const cell : Cell = cellsList[i] as Cell;

                    if (
                        cell.fieldType == FieldTypes.Field && // если ячейка является саваной
                        cell.row >= startRow + 1 && cell.row < finRow - (isVertical ? 1 : 0) && // если ячейка в ходит в указанную область в рядочке
                        cell.col >= startCol + 1 && cell.col < finCol - (!isVertical ? 1 : 0) // если ячейка в ходит в указанную область в столбце
                    ) {
                        const nextCell = this.board.tileXYZToChess(cell.col + (!isVertical ? 1 : 0), cell.row + (isVertical ? 1 : 0), 0);

                        if (nextCell && (nextCell as Cell).fieldType === FieldTypes.Field) {
                            workCells.push(cell);
                        }
                    }
                }

                rand = Phaser.Math.Between(0, workCells.length - 1);
                workCells[rand].fieldType = FieldTypes.Water;

                (this.board.tileXYZToChess(
                    workCells[rand].col + (!isVertical ? 1 : 0),
                    workCells[rand].row + (isVertical ? 1 : 0),
                    0
                ) as Cell).fieldType = FieldTypes.Water;

                // --- Mounts ---
                workCells = [];

                for (let i = 0; i < cellsCount; i++) {
                    const cell : Cell = cellsList[i] as Cell;

                    if (
                        cell.fieldType == FieldTypes.Field && // если ячейка является саваной
                        cell.row >= startRow && cell.row <= finRow - 1 && // если ячейка в ходит в указанную область в рядочке
                        cell.col >= startCol && cell.col <= finCol - 1 // если ячейка в ходит в указанную область в столбце
                    ) {
                        const cellsArea : Array<GameObject | null> = this.getCellsInArea(cell) // получаем список ячеек в области
                        let areaIsOk : boolean = true // проверочный флаг

                        cellsArea.forEach(areaCell => {
                            if(areaCell == null || (areaCell as Cell).fieldType !== FieldTypes.Field) {
                                areaIsOk = false;
                            }
                        });

                        if (areaIsOk) {
                            workCells.push(cell);
                        }
                    }
                }

                rand = Phaser.Math.Between(0, workCells.length - 1);
                this.getCellsInArea(workCells[rand]).forEach(cell => {
                    (cell as Cell).fieldType = FieldTypes.Mount;
                });

                // --- Forest ---
                workCells = [];

                for (let i = 0; i < cellsCount; i++) {
                    const cell : Cell = cellsList[i] as Cell;

                    if (
                        cell.fieldType == FieldTypes.Field && // если ячейка является саваной
                        cell.row >= startRow && cell.row <= finRow - 1 && // если ячейка в ходит в указанную область в рядочке
                        cell.col >= startCol && cell.col <= finCol - 1 // если ячейка в ходит в указанную область в столбце
                    ) {
                        const cellsArea : Array<GameObject | null> = this.getCellsInArea(cell) // получаем список ячеек в области
                        let areaIsOk : boolean = true // проверочный флаг

                        cellsArea.forEach(areaCell => {
                            if(areaCell == null || (areaCell as Cell).fieldType !== FieldTypes.Field) {
                                areaIsOk = false;
                            }
                        });

                        if (areaIsOk) {
                            workCells.push(cell);
                        }
                    }
                }

                rand = Phaser.Math.Between(0, workCells.length - 1);
                this.getCellsInArea(workCells[rand]).forEach(cell => {
                    (cell as Cell).fieldType = FieldTypes.Forest;
                });
            }
        }

        this.board.gridAlign();
        // this.cellsBoard.pullOutFromMainBoard();
    }

    getCellsInArea(startCell : Cell, cellsInRow : number = 2, cellsInCol : number = 2) : Array<GameObject | null> {
        const result : Array<GameObject | null> = [];

        for (let row = 0; row < cellsInRow; row++) {
            for (let col = 0; col < cellsInCol; col++) {
                result.push(this.board.tileXYZToChess(
                    startCell.col + col,
                    startCell.row + row,
                    0
                ));
            }
        }

        return result;
    }

    flipBoard() {
        this.unitsBoard.pullOutFromMainBoard();

        const cellsList: Array<GameObject> = this.board.getAllChess();
        const cellsCount: number = cellsList.length;
        const initPositions: Array<TileXYType> = [];

        for (let i = 0; i < cellsCount; i++) {
            const cell: Cell = cellsList[i] as Cell;

            initPositions.push({
                x: cell.col,
                y: cell.row,
                z: 0
            });
        }

        cellsList
            .reverse()
            .forEach((cell, index) => {
            const pos: TileXYType = initPositions[index];

            this.board.moveChess(cell, pos.x, pos.y, 0, true);
        });

        this.unitsBoard.putBack();
    }
}
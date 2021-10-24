import {Cell, FieldTypes} from "./Cell";
import IRexScene from "../interfaces/IRexScene";
import ContainerLite from 'phaser3-rex-plugins/plugins/containerlite.js';


export default class Board extends ContainerLite {
    static readonly TOTAL_ROWS: number = 12;
    static readonly TOTAL_COLS: number = 12;
    static cellSize: number;
    private grid: Array<Array<Cell>> = [];

    constructor(scene: IRexScene) {
        super(scene, 0, 0);

        Board.cellSize = Math.floor(scene.rexUI.viewport.height / Board.TOTAL_ROWS);
        this.width = Board.TOTAL_COLS * Board.cellSize;
        this.height = Board.TOTAL_ROWS * Board.cellSize;

        const startX: number = this.width / 2 * -1;
        const startY: number = this.height / 2 * -1;
        const halfOfCellSize: number = Board.cellSize / 2;

        // Fill grid with cells
        for (let row = 0; row < Board.TOTAL_ROWS; row++) {
            const cells: Array<Cell> = [];

            for (let col = 0; col < Board.TOTAL_COLS; col++) {
                const cell: Cell = new Cell(
                    scene,
                    col, row,
                    startX + halfOfCellSize + col * Board.cellSize,
                    startY + halfOfCellSize + row * Board.cellSize
                );

                cells.push(cell);
                this.add(cell);
            }

            this.grid.push(cells);
        }

        // Generate grid
        this.generateGrid();
    }

    generateGrid(resetCells: boolean = false) {
        const grid = this.grid;

        if (resetCells) {
            grid.forEach(rowList => {
                rowList.forEach(cell => {
                   cell.fieldType = FieldTypes.Field;
                });
            })
        }

        const fillSwamp = (cells: Array<Cell>) => {
            const workCells : Array<Cell> = [];
            const listLength: number = cells.length;

            for (let i = 0; i < listLength; i++) {
                const cell: Cell = cells[i];

                if (cell.fieldType !== FieldTypes.Field) continue;

                workCells.push(cell);
            }
            workCells[Phaser.Math.Between(0, workCells.length - 1)].fieldType = FieldTypes.Swamp;
        };
        const fillWater = (cells: Array<Cell>) => {
            const list: Array<Cell> = this.getCellsInArea(cells[0], 4, 4);
            const listLength: number = list.length;
            const workCells: Array<Cell> = [];
            const isVertical: boolean = Math.random() >= 0.5;

            for (let i = 0; i < listLength; i++) {
                const cell: Cell = cells[i];

                if (cell.fieldType !== FieldTypes.Field) continue;

                const nextCell: Cell | null = this.getCell(
                    cell.row + (isVertical ? 1 : 0),
                    cell.col + (!isVertical ? 1 : 0)
                );

                if (nextCell && nextCell.fieldType === FieldTypes.Field) {
                    workCells.push(cell);
                }
            }

            const rand = Phaser.Math.Between(0, workCells.length - 1);
            const nextCell: Cell | null = this.getCell(
                workCells[rand].row + (isVertical ? 1 : 0),
                workCells[rand].col + (!isVertical ? 1 : 0)
            );
            workCells[rand].fieldType = FieldTypes.Water;
            nextCell.fieldType = FieldTypes.Water;
        };
        const fillSquare = (cells: Array<Cell>, fieldType: FieldTypes) => {
            const cellsInArea: Array<Cell> = this.getCellsInArea(cells[0], 5, 5);
            const workCells : Array<Cell> = [];
            const listLength: number = cells.length;

            for (let i = 0; i < listLength; i++) {
                const cell: Cell|null = cellsInArea[i];

                if (!cell || cell.fieldType !== FieldTypes.Field) continue;

                const area: Array<Cell> = this.getCellsInArea(cell, 2, 2);
                let areaIsFine: boolean = true;

                area.forEach(checkCell => {
                    if (checkCell && checkCell.fieldType !== FieldTypes.Field) {
                        areaIsFine = false;
                    }
                });

                if (areaIsFine) {
                    workCells.push(cell);
                }
            }

            const cell: Cell = workCells[Phaser.Math.Between(0, workCells.length - 1)];
            const area: Array<Cell> = this.getCellsInArea(cell, 2, 2);

            area.forEach(areaCell => {
                areaCell.fieldType = fieldType;
            });
        };

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const startRow : number = row * 6;
                const startCol : number = col * 6;
                const startCell: Cell = this.getCell(startRow, startCol);
                const list: Array<Cell> = this.getCellsInArea(startCell, 6, 6);
                const innerCells: Array<Cell | null> = this.getCellsInArea(
                    this.getCell(startRow + 1, startCol + 1),
                    4, 4
                );

                fillWater(innerCells);
                fillSquare(list, FieldTypes.Mount);
                fillSquare(list, FieldTypes.Forest);
                fillSwamp(innerCells);
            }
        }
    }

    getCellsInArea(startCell : Cell, cellsInRow : number = 2, cellsInCol : number = 2) : Array<Cell | null> {
        const result : Array<Cell | null> = [];

        for (let row = 0; row < cellsInRow; row++) {
            for (let col = 0; col < cellsInCol; col++) {
                const cell: Cell | null = this.getCell(
                    startCell.col + col,
                    startCell.row + row
                );
                result.push(cell);
            }
        }

        return result;
    }

    getCell(row: number, col: number): Cell | null {
        const grid = this.grid;

        if (
            grid.length > 0 &&
            row >= 0 && row < Board.TOTAL_ROWS &&
            col >= 0 && col < Board.TOTAL_COLS
        ) {
            return grid[row][col];
        }

        return null;
    }

    // constructor(scene: Phaser.Scene) {
    //     super(scene, {
    //         column: Board.TOTAL_COLS,
    //         row: Board.TOTAL_ROWS
    //     });
    //     scene.add.existing(this);
    //
    //     const screenHeight = scene.cameras.main.height;
    //
    //     Board.cellSize = screenHeight / Board.TOTAL_ROWS;
    //
    //     for(let row = 0; row < Board.TOTAL_ROWS; row++) {
    //         for (let col = 0; col < Board.TOTAL_COLS; col++) {
    //             const cell = new Cell(scene, row, col);
    //
    //             this.add(cell, col, row);
    //         }
    //     }
    //
    //     this.generateGrid();
    //
    //     // this.getCellsInArea(this.getCell(0, 0), 1, 12).forEach(cell => {
    //     //    if ( cell ){
    //     //       cell.setHighlight(true);
    //     //    }
    //     // });
    //
    //     // --- Events ---
    //     scene.input.keyboard.on('keyup-M', () => {
    //         this.generateGrid(true);
    //     });
    //
    //     scene.input.keyboard.on('keyup-F', () => {
    //         this.flipBoard();
    //     });
    //
    //     scene.game.registry.events.on('changedata-cell_size', (parent: any, cellSize: number) => {
    //         // @ts-ignore
    //         const cellsList: Array<Cell> = this.getElement('items');
    //
    //         cellsList.forEach((cell: Cell) => {
    //             cell.updateSize(cellSize);
    //         });
    //
    //         this.layout();
    //     });
    // }
    //
    // getCell(col: number, row: number): Cell|null {
    //     // @ts-ignore
    //     return this.getChildAt(col, row);
    // }
    //
    // getCellsInArea(startCell : Cell, cellsInRow : number = 2, cellsInCol : number = 2) : Array<Cell | null> {
    //     const result : Array<Cell | null> = [];
    //
    //     for (let row = 0; row < cellsInRow; row++) {
    //         for (let col = 0; col < cellsInCol; col++) {
    //             result.push(this.getCell(
    //                 startCell.col + col,
    //                 startCell.row + row
    //             ));
    //         }
    //     }
    //
    //     return result;
    // }
    //
    // generateGrid(resetCells: boolean = false) {
    //     // @ts-ignore
    //     const cellsList: Array<Cell> = this.getElement('items');
    //     const cellsCount : number = cellsList.length;
    //
    //     // Reset cells to Field state
    //     if( resetCells === true ) {
    //         cellsList.forEach(cell => {
    //             cell.fieldType = FieldTypes.Field;
    //         });
    //     }
    //
    //     for (let row = 0; row < 2; row++) {
    //         for (let col = 0; col < 2; col++) {
    //             let startRow : number = row * 6 // задаем стартовую ячейку в рядочке разделенных квадратов
    //             let startCol : number = col * 6 // задаем стартовую ячейку в столбике разделенных квадратов
    //             let finRow : number = startRow + 5 // задаем конечную ячейку в рядочке разделенных квадратов
    //             let finCol : number = startCol + 5 // задаем конечную ячейку в столбике разделенных квадратов
    //             let workCells : Array<Cell> = [] // создаем пустой массив
    //             let isVertical : boolean = Math.random() >= 0.5 // случайным образом определяем TRUE или FALSE
    //             let rand : number // создаем переменную с именем rand
    //
    //             // --- Fill Swamp ---
    //             for (let i = 0; i < cellsCount; i++) {
    //                 const cell : Cell = cellsList[i] as Cell;
    //
    //                 if (
    //                     cell.fieldType == FieldTypes.Field && // если ячейка является саваной
    //                     cell.row >= startRow + 1 && cell.row < finRow && // если ячейка в ходит в указанную область в рядочке
    //                     cell.col >= startCol + 1 && cell.col < finCol // если ячейка в ходит в указанную область в столбце
    //                 ) {
    //                     workCells.push(cell);
    //                 }
    //             }
    //
    //             workCells[Phaser.Math.Between(0, workCells.length - 1)].fieldType = FieldTypes.Swamp; // создаем  массив, из пройденных условие, ячеек и добавляем им тип болото
    //
    //             // --- Fill water ---
    //             // Find all available cells in range
    //             workCells = []; // сбрасываем массив пустых ячеек
    //
    //             for (let i = 0; i < cellsCount; i++) {
    //                 const cell : Cell = cellsList[i] as Cell;
    //
    //                 if (
    //                     cell.fieldType == FieldTypes.Field && // если ячейка является саваной
    //                     cell.row >= startRow + 1 && cell.row < finRow - (isVertical ? 1 : 0) && // если ячейка в ходит в указанную область в рядочке
    //                     cell.col >= startCol + 1 && cell.col < finCol - (!isVertical ? 1 : 0) // если ячейка в ходит в указанную область в столбце
    //                 ) {
    //                     const nextCell = this.getCell(
    //                         cell.col + (!isVertical ? 1 : 0),
    //                         cell.row + (isVertical ? 1 : 0)
    //                     );
    //
    //                     if (nextCell && (nextCell as Cell).fieldType === FieldTypes.Field) {
    //                         workCells.push(cell);
    //                     }
    //                 }
    //             }
    //
    //             rand = Phaser.Math.Between(0, workCells.length - 1);
    //             workCells[rand].fieldType = FieldTypes.Water;
    //
    //             this.getCell(
    //                 workCells[rand].col + (!isVertical ? 1 : 0),
    //                 workCells[rand].row + (isVertical ? 1 : 0)
    //             ).fieldType = FieldTypes.Water;
    //
    //             // --- Mounts ---
    //             workCells = [];
    //
    //             for (let i = 0; i < cellsCount; i++) {
    //                 const cell : Cell = cellsList[i] as Cell;
    //
    //                 if (
    //                     cell.fieldType == FieldTypes.Field && // если ячейка является саваной
    //                     cell.row >= startRow && cell.row <= finRow - 1 && // если ячейка в ходит в указанную область в рядочке
    //                     cell.col >= startCol && cell.col <= finCol - 1 // если ячейка в ходит в указанную область в столбце
    //                 ) {
    //                     const cellsArea : Array<Cell | null> = this.getCellsInArea(cell) // получаем список ячеек в области
    //                     let areaIsOk : boolean = true // проверочный флаг
    //
    //                     cellsArea.forEach(areaCell => {
    //                         if(areaCell == null || areaCell.fieldType !== FieldTypes.Field) {
    //                             areaIsOk = false;
    //                         }
    //                     });
    //
    //                     if (areaIsOk) {
    //                         workCells.push(cell);
    //                     }
    //                 }
    //             }
    //
    //             rand = Phaser.Math.Between(0, workCells.length - 1);
    //             this.getCellsInArea(workCells[rand]).forEach(cell => {
    //                 cell.fieldType = FieldTypes.Mount;
    //             });
    //
    //             // --- Forest ---
    //             workCells = [];
    //
    //             for (let i = 0; i < cellsCount; i++) {
    //                 const cell : Cell = cellsList[i] as Cell;
    //
    //                 if (
    //                     cell.fieldType == FieldTypes.Field && // если ячейка является саваной
    //                     cell.row >= startRow && cell.row <= finRow - 1 && // если ячейка в ходит в указанную область в рядочке
    //                     cell.col >= startCol && cell.col <= finCol - 1 // если ячейка в ходит в указанную область в столбце
    //                 ) {
    //                     const cellsArea : Array<Cell | null> = this.getCellsInArea(cell) // получаем список ячеек в области
    //                     let areaIsOk : boolean = true // проверочный флаг
    //
    //                     cellsArea.forEach(areaCell => {
    //                         if(areaCell == null || areaCell.fieldType !== FieldTypes.Field) {
    //                             areaIsOk = false;
    //                         }
    //                     });
    //
    //                     if (areaIsOk) {
    //                         workCells.push(cell);
    //                     }
    //                 }
    //             }
    //
    //             rand = Phaser.Math.Between(0, workCells.length - 1);
    //             this.getCellsInArea(workCells[rand]).forEach(cell => {
    //                 cell.fieldType = FieldTypes.Forest;
    //             });
    //         }
    //     }
    //
    //     this.layout();
    // }
    //
    // flipBoard() {
    //     // @ts-ignore
    //     const cellsList: Array<Cell> = this.getElement('items');
    //
    //     cellsList.reverse();
    //     this.layout();
    // }
}
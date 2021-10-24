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

        const { width: screenWidth, height: screenHeight } = scene.rexUI.viewport;

        Board.cellSize = Math.floor(screenHeight / Board.TOTAL_ROWS);
        this.width = Board.TOTAL_COLS * Board.cellSize;
        this.height = Board.TOTAL_ROWS * Board.cellSize;

        const halfOfCellSize: number = Board.cellSize / 2;

        // Fill grid with cells
        for (let row = 0; row < Board.TOTAL_ROWS; row++) {
            const cells: Array<Cell> = [];

            for (let col = 0; col < Board.TOTAL_COLS; col++) {
                const cell: Cell = new Cell(
                    scene,
                    col, row,
                    screenWidth / 2 - (this.width / 2) + halfOfCellSize + col * Board.cellSize,
                    halfOfCellSize + row * Board.cellSize
                );

                cells.push(cell);
                this.add(cell);
            }

            this.grid.push(cells);
        }

        // Generate grid
        this.generateGrid();

        scene.input.keyboard.on('keyup-M', () => {
            this.generateGrid(true);
        });

        scene.input.keyboard.on('keyup-R', () => {
            this.mirrorGrid();
        });
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

    mirrorGrid() {
        const { width: screenWidth, height: screenHeight } = (this.scene as IRexScene).rexUI.viewport;
        const halfOfCellSize: number = Board.cellSize / 2;

        this.grid = this.grid.map(row => row.reverse()).reverse();

        for (let row = 0; row < Board.TOTAL_ROWS; row++) {
            for (let col = 0; col < Board.TOTAL_COLS; col++) {
                const cell: Cell = this.grid[row][col];

                cell.row = row;
                cell.col = col;
                cell.x = screenWidth / 2 - (this.width / 2) + halfOfCellSize + col * Board.cellSize;
                cell.y = halfOfCellSize + row * Board.cellSize;
            }
        }
    }
}
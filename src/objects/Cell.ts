export enum Types {Field, Forest, Mount, Water, Swamp}

export interface ICell {
    type: Types,
    row?: integer,
    col?: integer
}

export default class Cell implements ICell {
    type: Types = Types.Field


}
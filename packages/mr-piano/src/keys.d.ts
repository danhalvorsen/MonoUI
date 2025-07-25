import { Point } from "./core/interfaces";
type KeyType = {
    name: string;
    baseVertices: readonly Point[];
    fillStyle: string;
};
export declare class PianoKey {
    name: string;
    vertices: readonly Point[];
    edges: readonly [number, number][];
    fillStyle: string;
    constructor(type: KeyType, dx: number, dy: number);
}
export {};

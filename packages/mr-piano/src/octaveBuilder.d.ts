import { IKey } from "./core/interfaces";
export declare class OctaveBuilder {
    whiteWidth: number;
    gap: number;
    buildOctave(startX?: number, startY?: number): IKey[];
}

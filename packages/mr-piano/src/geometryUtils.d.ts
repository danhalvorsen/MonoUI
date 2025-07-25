import { Point } from "./core/interfaces";
export declare function translate(vertices: readonly Point[], dx: number, dy: number): [number, number][];
export declare function buildEdges(vertices: readonly Point[]): [number, number][];

import { IVisualObject } from "mr-abstract-components";
export interface Vector2 {
    readonly x: number;
    readonly y: number;
}
export declare const add: (a: Vector2, b: Vector2) => Vector2;
export declare const mul: (v: Vector2, scalar: number) => Vector2;
export declare const magnitude: (v: Vector2) => number;
export declare const normalize: (v: Vector2) => Vector2;
export declare class Rectangle implements IVisualObject<CanvasRenderingContext2D> {
    width: number;
    height: number;
    color: string;
    position: Vector2;
    velocity: Vector2;
    constructor(width: number, height: number, color: string, x?: number, y?: number, velocity?: Vector2);
    update(dt: number): void;
    render(ctx: CanvasRenderingContext2D): void;
}

export interface Vector2 {
    readonly x: number;
    readonly y: number;
}
export declare const add: (a: Vector2, b: Vector2) => Vector2;
export declare const mul: (v: Vector2, s: number) => Vector2;
export declare const magnitude: (v: Vector2) => number;
export declare const normalize: (v: Vector2) => Vector2;
export interface IPhysicObject {
    readonly mass: number;
    readonly position: Vector2;
    readonly velocity: Vector2;
    readonly acceleration: Vector2;
    get direction(): Vector2;
    update(dt: number): void;
}
export type Rect = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
}>;
export declare const rectEdges: (r: Rect) => {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

import { IKeyTemplate, Point } from './interfaces';
export declare abstract class BaseKey implements IKeyTemplate {
    abstract readonly name: string;
    abstract readonly fillStyle: string;
    /** subclasses implement their local outline */
    protected abstract outline(): readonly Point[];
    makeVertices(): readonly Point[];
    makeEdges(): readonly [number, number][];
}

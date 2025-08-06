import { IVisualObjectConfiguration } from "../../abstractions/IVisualObjectConfiguration.js";
import { Vector2 } from "@my-graphics/math";

 
export interface GridConfiguration extends IVisualObjectConfiguration {
    cellSize: number;
    spacing?: number;
    origin: Vector2;
    visible: boolean;
    gridColor?: string;
    lineWidth?: number;
    opacity?: number;
    gridType?: 'square' | 'hexagonal' | 'triangular';
    snapTolerance?: number;
    bounds?: {
        min: Vector2;
        max: Vector2;
    };
}

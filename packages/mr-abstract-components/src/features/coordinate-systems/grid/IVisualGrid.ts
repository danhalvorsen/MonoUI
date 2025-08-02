import { Vector2 } from "@my-graphics/math";
 
import { GridConfiguration } from "./GridConfiguration.js";
import { IVisualObject } from "../../abstractions/IVisualObject.js";

export interface IGridFeature extends IVisualObject {
    configuration: GridConfiguration;
    /** Grid cell size in pixels */
    cellSize: number;
    
    /** Grid spacing (same as cellSize for square grids) */
    spacing?: number;
    
    /** Grid origin point */
    origin: Vector2;
    
    /** Grid visibility */
    visible: boolean;
    
    /** Grid color and styling */
    gridColor?: string;
    lineWidth?: number;
    opacity?: number;
    
    /** Grid type */
    gridType?: 'square' | 'hexagonal' | 'triangular';
    
    /** Snap tolerance for grid alignment */
    snapTolerance?: number;
    
    /** Grid bounds (optional - infinite grid if not specified) */
    bounds?: {
        min: Vector2;
        max: Vector2;
    };
    
    /** Snap a point to the nearest grid intersection */
    snapToGrid(point: Vector2): Vector2;
    
    /** Get the nearest grid point to a given position */
    getNearestGridPoint(position: Vector2): Vector2;
    
    /** Check if a point is close enough to snap to grid */
    isWithinSnapDistance(point: Vector2): boolean;
    
    /** Get all grid lines within a given viewport */
    getGridLinesInBounds(bounds: { minX: number; maxX: number; minY: number; maxY: number }): {
        horizontal: number[];
        vertical: number[];
    };
    
    /** Convert world coordinates to grid coordinates */
    worldToGrid(worldPos: Vector2): { row: number; col: number };
    
    /** Convert grid coordinates to world coordinates */
    gridToWorld(row: number, col: number): Vector2;
}


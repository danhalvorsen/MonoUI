import type { ICartesianCoordinateController, ICartesianCoordinateControllerConfiguration, IGridFeature, ISnapFeature, IVisualAxis, IVisualObject } from 'mr-abstract-components';
import { Vector2 } from '@my-graphics/math';
import { GridObject } from './grid/GridObject.js';
import { Axis } from './axis/Axis.js';
import { SnapObject } from './visual/SnapObject.js';

/**
 * CartesianCoordinateController provides a mathematical coordinate system with:
 * - X and Y axes with configurable ranges and labels
 * - Grid for visual reference and snapping
 * - Snap functionality for precise object placement
 * - Coordinate transformation between screen and Cartesian space
 */
export class CartesianCoordinateController implements ICartesianCoordinateController {
    id: string;
    position: Vector2;
    configuration: ICartesianCoordinateControllerConfiguration;
    xAxis: IVisualAxis;
    yAxis: IVisualAxis;
    visualObjects: IVisualObject[] = [];
    snapFeature: ISnapFeature;
    gridFeature: IGridFeature;
    
    // Canvas dimensions for coordinate transformation
    private canvasWidth: number;
    private canvasHeight: number;
    
    // Coordinate system bounds
    private xMin: number;
    private xMax: number;
    private yMin: number;
    private yMax: number;

    constructor(
        id: string = 'cartesian-system',
        canvasWidth: number = 800,
        canvasHeight: number = 600,
        intervalX: Vector2 = new Vector2(0, 0),
        intervalY: Vector2 = new Vector2(0, 0),
        gridSize: number = 20
    ) {
        this.id = id;
        this.position = new Vector2(0, 0);
        
        // Initialize canvas dimensions and bounds
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.xMin = intervalX.x;
        this.xMax = intervalX.y;
        this.yMin = intervalY.x;
        this.yMax = intervalY.y;
        
        // Initialize configuration
        this.configuration = {};
        
        // Create axes
        this.xAxis = new Axis(`${id}-x-axis`, intervalX.x, intervalX.y);
        this.yAxis = new Axis(`${id}-y-axis`, intervalY.x, intervalY.y);
        
        // Create grid
        this.gridFeature = new GridObject(`${id}-grid`, gridSize, '#e5e7eb', true, true);
        
        // Create snap feature
        this.snapFeature = new SnapObject();
        // Note: These properties may need to be added to ISnapFeature interface
        // this.snapFeature.snapRadius = gridSize / 2;
        // this.snapFeature.snapToGrid = true;
    }


    /**
     * Convert screen coordinates to Cartesian coordinates
     */
    screenToCartesian(screenX: number, screenY: number): Vector2 {
        // Convert screen coordinates (top-left origin, Y down) to Cartesian (center origin, Y up)
        const xRange = this.xMax - this.xMin;
        const yRange = this.yMax - this.yMin;
        
        const cartesianX = this.xMin + (screenX / this.canvasWidth) * xRange;
        const cartesianY = this.yMax - (screenY / this.canvasHeight) * yRange; // Flip Y axis
        
        return new Vector2(cartesianX, cartesianY);
    }

    /**
     * Convert Cartesian coordinates to screen coordinates
     */
    cartesianToScreen(cartesianX: number, cartesianY: number): Vector2 {
        const xRange = this.xMax - this.xMin;
        const yRange = this.yMax - this.yMin;
        
        const screenX = ((cartesianX - this.xMin) / xRange) * this.canvasWidth;
        const screenY = ((this.yMax - cartesianY) / yRange) * this.canvasHeight; // Flip Y axis
        
        return new Vector2(screenX, screenY);
    }

    /**
     * Snap a Cartesian point to the grid
     */
    snapToGrid(point: Vector2): Vector2 {
        if (!this.gridFeature.snapToGrid) return point;
        
        const gridSize = this.gridFeature.gridSize;
        const snappedX = Math.round(point.x / gridSize) * gridSize;
        const snappedY = Math.round(point.y / gridSize) * gridSize;
        
        return new Vector2(snappedX, snappedY);
    }

    /**
     * Update canvas dimensions (call when canvas is resized)
     */
    updateDimensions(width: number, height: number): void {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }

    /**
     * Update coordinate system bounds
     */
    setBounds(xMin: number, xMax: number, yMin: number, yMax: number): void {
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        
        // Update axes
        this.xAxis.min = xMin;
        this.xAxis.max = xMax;
        this.yAxis.min = yMin;
        this.yAxis.max = yMax;
    }

    /**
     * Update the coordinate system components
     */
    update(time: number, delta: number): void {
        this.gridFeature.update(delta);
        this.xAxis.update(delta);
        this.yAxis.update(delta);
        this.snapFeature.update(delta);
        
        // Update all managed visual objects
        this.visualObjects.forEach(obj => obj.update(delta));
    }

    /**
     * Render the coordinate system (grid, axes, etc.)
     */
    render(ctx: CanvasRenderingContext2D): void {
        // Render grid first (background)
        this.gridFeature.render(ctx);
        
        // Render axes
        const centerY = this.canvasHeight / 2;
        const centerX = this.canvasWidth / 2;
        
        this.xAxis.render(ctx);
        this.yAxis.render(ctx);
    }
}

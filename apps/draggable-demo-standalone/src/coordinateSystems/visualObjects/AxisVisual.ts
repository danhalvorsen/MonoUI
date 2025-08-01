import { ChangedProperties, IPhysicObject, IStyle, IVisualObject } from "mr-abstract-components";
import { IConnector } from "mr-abstract-components/dist/coordinate-systems/IConnector";
import { IAxis, AxisConfig } from "mr-abstract-components";
import { Vector2 } from "@my-graphics/math";

export class AxisVisual implements IAxis {
    id: string;
    config: AxisConfig;
    
    // IVisualObject properties
    selected?: boolean = false;
    enabled?: boolean = true;
    physicObject?: IPhysicObject;
    style?: IStyle;
    connectors?: IConnector[];
    isDraggable?: boolean = false;
    onDragStart?: (event: MouseEvent) => void;
    onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
    onDragEnd?: (event: MouseEvent) => void;

    constructor(id: string, config?: Partial<AxisConfig>) {
        this.id = id;
        this.config = {
            showXAxis: true,
            showYAxis: true,
            color: '#333333',
            lineWidth: 2,
            opacity: 1.0,
            showTicks: true,
            tickSize: 8,
            tickSpacing: 50,
            showLabels: true,
            labelFont: '12px Arial',
            labelColor: '#666666',
            showOrigin: true,
            originSize: 6,
            originColor: '#ff0000',
            // Grid properties
            showGrid: true,
            gridSize: 20,
            gridColor: '#e0e0e0',
            gridOpacity: 0.5,
            ...config
        };
    }

    setConfig(config: Partial<AxisConfig>): void {
        this.config = { ...this.config, ...config };
    }

    getConfig(): AxisConfig {
        return { ...this.config };
    }

    update(dt: number): void {
        // Axis typically doesn't need updates unless animated
        // This can be extended for animated axes in the future
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.enabled) return;
        
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        
        ctx.save();
        
        // Render grid first (behind axes)
        this.renderGrid(ctx, canvasWidth, canvasHeight);
        
        // Set opacity for axis components
        ctx.globalAlpha = this.config.opacity;
        
        // Render all axis components
        this.renderXAxis(ctx, canvasWidth, canvasHeight);
        this.renderYAxis(ctx, canvasWidth, canvasHeight);
        this.renderTicks(ctx, canvasWidth, canvasHeight);
        this.renderLabels(ctx, canvasWidth, canvasHeight);
        this.renderOrigin(ctx, canvasWidth, canvasHeight);
        
        ctx.restore();
    }

    /**
     * Renders the grid on the canvas using Cartesian coordinates
     * Grid is centered at origin (0,0) and extends in all directions
     */
    renderGrid(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        if (!this.config.showGrid) return;

        ctx.save();
        ctx.globalAlpha = this.config.gridOpacity;
        ctx.strokeStyle = this.config.gridColor;
        ctx.lineWidth = 1;

        // Calculate grid bounds in Cartesian coordinates
        const halfWidth = canvasWidth / 2;
        const halfHeight = canvasHeight / 2;
        
        // Draw vertical lines (parallel to Y-axis)
        for (let x = -halfWidth; x <= halfWidth; x += this.config.gridSize) {
            // Snap to grid to avoid floating point issues
            const gridX = Math.round(x / this.config.gridSize) * this.config.gridSize;
            
            ctx.beginPath();
            ctx.moveTo(gridX, -halfHeight);
            ctx.lineTo(gridX, halfHeight);
            ctx.stroke();
        }

        // Draw horizontal lines (parallel to X-axis)
        for (let y = -halfHeight; y <= halfHeight; y += this.config.gridSize) {
            // Snap to grid to avoid floating point issues
            const gridY = Math.round(y / this.config.gridSize) * this.config.gridSize;
            
            ctx.beginPath();
            ctx.moveTo(-halfWidth, gridY);
            ctx.lineTo(halfWidth, gridY);
            ctx.stroke();
        }

        ctx.restore();
    }

    renderXAxis(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        if (!this.config.showXAxis) return;
        
        const centerY = canvasHeight / 2;
        
        ctx.save();
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = this.config.lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvasWidth, centerY);
        ctx.stroke();
        
        ctx.restore();
    }

    renderYAxis(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        if (!this.config.showYAxis) return;
        
        const centerX = canvasWidth / 2;
        
        ctx.save();
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = this.config.lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvasHeight);
        ctx.stroke();
        
        ctx.restore();
    }

    renderTicks(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        if (!this.config.showTicks) return;
        
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const tickSize = this.config.tickSize;
        const spacing = this.config.tickSpacing;
        
        ctx.save();
        ctx.strokeStyle = this.config.color;
        ctx.lineWidth = 1;
        
        // X-axis ticks
        if (this.config.showXAxis) {
            for (let x = centerX; x < canvasWidth; x += spacing) {
                if (x !== centerX) { // Skip origin
                    ctx.beginPath();
                    ctx.moveTo(x, centerY - tickSize / 2);
                    ctx.lineTo(x, centerY + tickSize / 2);
                    ctx.stroke();
                }
            }
            for (let x = centerX - spacing; x > 0; x -= spacing) {
                ctx.beginPath();
                ctx.moveTo(x, centerY - tickSize / 2);
                ctx.lineTo(x, centerY + tickSize / 2);
                ctx.stroke();
            }
        }
        
        // Y-axis ticks
        if (this.config.showYAxis) {
            for (let y = centerY; y < canvasHeight; y += spacing) {
                if (y !== centerY) { // Skip origin
                    ctx.beginPath();
                    ctx.moveTo(centerX - tickSize / 2, y);
                    ctx.lineTo(centerX + tickSize / 2, y);
                    ctx.stroke();
                }
            }
            for (let y = centerY - spacing; y > 0; y -= spacing) {
                ctx.beginPath();
                ctx.moveTo(centerX - tickSize / 2, y);
                ctx.lineTo(centerX + tickSize / 2, y);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    renderLabels(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        if (!this.config.showLabels) return;
        
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const spacing = this.config.tickSpacing;
        
        ctx.save();
        ctx.fillStyle = this.config.labelColor;
        ctx.font = this.config.labelFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // X-axis labels
        if (this.config.showXAxis) {
            let labelValue = 0;
            for (let x = centerX; x < canvasWidth; x += spacing) {
                if (labelValue !== 0) {
                    ctx.fillText(labelValue.toString(), x, centerY + 20);
                }
                labelValue += spacing;
            }
            labelValue = -spacing;
            for (let x = centerX - spacing; x > 0; x -= spacing) {
                ctx.fillText(labelValue.toString(), x, centerY + 20);
                labelValue -= spacing;
            }
        }
        
        // Y-axis labels (inverted because screen Y is flipped)
        if (this.config.showYAxis) {
            let labelValue = 0;
            for (let y = centerY; y > 0; y -= spacing) {
                if (labelValue !== 0) {
                    ctx.fillText(labelValue.toString(), centerX - 25, y);
                }
                labelValue += spacing;
            }
            labelValue = -spacing;
            for (let y = centerY + spacing; y < canvasHeight; y += spacing) {
                ctx.fillText(labelValue.toString(), centerX - 25, y);
                labelValue -= spacing;
            }
        }
        
        ctx.restore();
    }

    renderOrigin(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
        if (!this.config.showOrigin) return;
        
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const size = this.config.originSize;
        
        ctx.save();
        ctx.fillStyle = this.config.originColor;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add origin label
        ctx.fillStyle = this.config.labelColor;
        ctx.font = this.config.labelFont;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('(0,0)', centerX + 10, centerY + 10);
        
        ctx.restore();
    }

    screenToAxis(screenPoint: Vector2, canvasWidth: number, canvasHeight: number): Vector2 {
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        // Convert screen coordinates to Cartesian coordinates
        // Screen: (0,0) top-left, +Y down
        // Cartesian: (0,0) center, +Y up
        return new Vector2(
            screenPoint.x - centerX,
            centerY - screenPoint.y  // Flip Y axis
        );
    }

    axisToScreen(axisPoint: Vector2, canvasWidth: number, canvasHeight: number): Vector2 {
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        // Convert Cartesian coordinates to screen coordinates
        return new Vector2(
            axisPoint.x + centerX,
            centerY - axisPoint.y  // Flip Y axis
        );
    }

    // Lifecycle methods (optional implementations)
    connectedCallback?(): void {
        // Called when axis is added to the scene
    }

    disconnectedCallback?(): void {
        // Called when axis is removed from the scene
    }

    shouldUpdate?(changedProperties: ChangedProperties): boolean {
        // Axis should update if configuration changes
        return changedProperties.has('config') || changedProperties.has('enabled');
    }

    willUpdate?(changedProperties: ChangedProperties): void {
        // Prepare for update if needed
    }

    firstUpdated?(changedProperties: ChangedProperties): void {
        // Called after first render
    }

    updated?(changedProperties: ChangedProperties): void {
        // Called after each update
    }
}
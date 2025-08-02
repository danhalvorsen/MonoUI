import { IVisualObject } from "mr-abstract-components";
import { VisualRectangle } from "mr-web-components";
import { Vector2, Rectangle } from "@my-graphics/math";

export interface DropZoneConfig {
  position: Vector2;
  width: number;
  height: number;
  acceptedTypes?: string[];
  highlightColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  label?: string;
}

export interface DropEvent {
  droppedObject: IVisualObject;
  dropZone: DropZone;
  position: Vector2;
}

export class DropZone {
    private _config: DropZoneConfig;
    private _isHighlighted: boolean = false;
    private _containedObjects: IVisualObject[] = [];
    private _bounds: Rectangle;
    
    // Event handlers
    onDrop?: (event: DropEvent) => void;
    onDragEnter?: (object: IVisualObject) => void;
    onDragLeave?: (object: IVisualObject) => void;
    onObjectRemoved?: (object: IVisualObject) => void;
    
    constructor(config: DropZoneConfig) {
        this._config = {
            highlightColor: '#4CAF50',
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            ...config
        };
        
        // Create bounds rectangle for hit detection
        const bottomLeft = new Vector2(
            this._config.position.x,
            this._config.position.y
        );
        const topRight = new Vector2(
            this._config.position.x + this._config.width,
            this._config.position.y + this._config.height
        );
        this._bounds = new Rectangle(bottomLeft, topRight);
    }

    // Getters
    get position(): Vector2 { return this._config.position; }
    get width(): number { return this._config.width; }
    get height(): number { return this._config.height; }
    get bounds(): Rectangle { return this._bounds; }
    get isHighlighted(): boolean { return this._isHighlighted; }
    get containedObjects(): readonly IVisualObject[] { return this._containedObjects; }
    get config(): DropZoneConfig { return { ...this._config }; }

    /**
     * Checks if a point is within the drop zone bounds
     */
    containsPoint(point: Vector2): boolean {
        return this._bounds.contains(point);
    }

    /**
     * Checks if a visual object overlaps with the drop zone
     */
    containsObject(obj: IVisualObject): boolean {
        if (!obj.physicObject) return false;
        
        const objPosition = obj.physicObject.position;
        const objWidth = obj.physicObject.Width || 0;
        const objHeight = obj.physicObject.Height || 0;
        
        // Check if object bounds intersect with drop zone bounds
        const objBottomLeft = new Vector2(objPosition.x, objPosition.y);
        const objTopRight = new Vector2(objPosition.x + objWidth, objPosition.y + objHeight);
        const objBounds = new Rectangle(objBottomLeft, objTopRight);
        
        return this._bounds.intersects(objBounds);
    }

    /**
     * Checks if an object type is accepted by this drop zone
     */
    acceptsObjectType(obj: IVisualObject): boolean {
        if (!this._config.acceptedTypes || this._config.acceptedTypes.length === 0) {
            return true; // Accept all types if none specified
        }
        
        // Check if object constructor name matches accepted types
        const objectType = obj.constructor.name;
        return this._config.acceptedTypes.includes(objectType);
    }

    /**
     * Handles when an object enters the drop zone during drag
     */
    handleDragEnter(obj: IVisualObject): void {
        if (!this.acceptsObjectType(obj)) return;
        
        this._isHighlighted = true;
        this.onDragEnter?.(obj);
    }

    /**
     * Handles when an object leaves the drop zone during drag
     */
    handleDragLeave(obj: IVisualObject): void {
        this._isHighlighted = false;
        this.onDragLeave?.(obj);
    }

    /**
     * Attempts to drop an object into the drop zone
     */
    tryDrop(obj: IVisualObject, dropPosition: Vector2): boolean {
        if (!this.containsPoint(dropPosition) || !this.acceptsObjectType(obj)) {
            return false;
        }

        // Add object to contained objects if not already present
        if (!this._containedObjects.includes(obj)) {
            this._containedObjects.push(obj);
        }

        // Reset highlight state
        this._isHighlighted = false;

        // Fire drop event
        const dropEvent: DropEvent = {
            droppedObject: obj,
            dropZone: this,
            position: dropPosition
        };
        this.onDrop?.(dropEvent);

        return true;
    }

    /**
     * Removes an object from the drop zone
     */
    removeObject(obj: IVisualObject): boolean {
        const index = this._containedObjects.indexOf(obj);
        if (index === -1) return false;

        this._containedObjects.splice(index, 1);
        this.onObjectRemoved?.(obj);
        return true;
    }

    /**
     * Clears all objects from the drop zone
     */
    clear(): void {
        const objectsToRemove = [...this._containedObjects];
        this._containedObjects.length = 0;
        
        objectsToRemove.forEach(obj => {
            this.onObjectRemoved?.(obj);
        });
    }

    /**
     * Updates the drop zone configuration
     */
    updateConfig(newConfig: Partial<DropZoneConfig>): void {
        this._config = { ...this._config, ...newConfig };
        
        // Rebuild bounds if position or size changed
        if (newConfig.position || newConfig.width || newConfig.height) {
            const bottomLeft = new Vector2(
                this._config.position.x,
                this._config.position.y
            );
            const topRight = new Vector2(
                this._config.position.x + this._config.width,
                this._config.position.y + this._config.height
            );
            this._bounds = new Rectangle(bottomLeft, topRight);
        }
    }

    /**
     * Renders the drop zone on the canvas
     */
    render(ctx: CanvasRenderingContext2D): void {
        const { position, width, height } = this._config;
        
        // Save context state
        ctx.save();
        
        // Draw background
        if (this._config.backgroundColor) {
            ctx.fillStyle = this._isHighlighted ? 
                this._config.highlightColor! : 
                this._config.backgroundColor;
            ctx.fillRect(position.x, position.y, width, height);
        }
        
        // Draw border
        if (this._config.borderColor) {
            ctx.strokeStyle = this._isHighlighted ? 
                this._config.highlightColor! : 
                this._config.borderColor;
            ctx.lineWidth = this._isHighlighted ? 3 : 2;
            ctx.setLineDash(this._isHighlighted ? [5, 5] : []);
            ctx.strokeRect(position.x, position.y, width, height);
        }
        
        // Draw label if provided
        if (this._config.label) {
            ctx.fillStyle = this._isHighlighted ? '#FFFFFF' : '#666666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const centerX = position.x + width / 2;
            const centerY = position.y + height / 2;
            ctx.fillText(this._config.label, centerX, centerY);
        }
        
        // Restore context state
        ctx.restore();
    }

    /**
     * Gets debug information about the drop zone
     */
    getDebugInfo(): object {
        return {
            position: this._config.position,
            size: { width: this._config.width, height: this._config.height },
            isHighlighted: this._isHighlighted,
            containedObjectCount: this._containedObjects.length,
            acceptedTypes: this._config.acceptedTypes,
            bounds: {
                bottomLeft: this._bounds.vertices[0],
                topRight: this._bounds.vertices[2]
            }
        };
    }
}
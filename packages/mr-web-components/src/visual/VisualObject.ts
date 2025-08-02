 import { Vector2, Rectangle } from "@my-graphics/math";
import type { IVisualObject, IConnector, IStyle, IPhysicObject } from "mr-abstract-components";
import { PhysicObject } from "../physics/PhysicObject.js";

export class VisualObject implements IVisualObject {
  id: string;
  selected?: boolean;
  enabled?: boolean;
  isDraggable?: boolean;
  private _isDragging?: boolean;
  public get isDragging(): boolean {
    return this._isDragging;
  }
  public set isDragging(value: boolean) {
    this._isDragging = value;
  }
  boundRectangle: Rectangle;
  
  // Composition: Use PhysicObject for physics data
  physicObject?: IPhysicObject;
  
  // Style properties
  style?: IStyle;
  
  // Connectors (0 to many anchor points)
  connectors?: IConnector[];

  onDragStart?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
  onDragEnd?: (event: MouseEvent) => void;

  constructor(
   
    position: Vector2 = new Vector2(0, 0),
    velocity: Vector2 = new Vector2(0, 0),
    acceleration: Vector2 = new Vector2(0, 0),
    width: number = 100,
    height: number = 100,
    name: string = 'VisualObject',
    selected: boolean = false,
    isDraggable: boolean = false,
    style?: IStyle
  ) {
    // Create physics object using composition
    this.physicObject = new PhysicObject(position.x, position.y, width, height);

    this.selected = selected;
    this.isDraggable = isDraggable;
    this.style = style;
    // Initialize boundRectangle using the updateBoundRectangle method for consistency
    this.updateBoundRectangle();
  }

  // Provide public access to the underlying position
  get position() {
    return this.physicObject?.position || new Vector2(0, 0);
  }
  
  // Update position and boundRectangle when position changes
  set position(newPosition: Vector2) {
    if (this.physicObject) {
      (this.physicObject as any)._position = newPosition;
      this.updateBoundRectangle();
      // Update all connectors to follow the new position
      if (this.connectors) {
        this.connectors.forEach(connector => {
          if ('updatePositionFromHost' in connector && typeof connector.updatePositionFromHost === 'function') {
            (connector as any).updatePositionFromHost();
          }
        });
      }
    }
  }
  
  // Width and height getters that delegate to physics object
  get width(): number {
    return this.physicObject?.Width || 0;
  }
  
  get height(): number {
    return this.physicObject?.Height || 0;
  }

  // Update the boundRectangle to match current position
  // Note: This creates boundRectangle in the same coordinate system as the object position
  // Hit testing coordinates must be converted to match this coordinate system
  private updateBoundRectangle(): void {
    const pos = this.position;
    const bottomLeft = new Vector2(pos.x - this.width / 2, pos.y - this.height / 2);
    const topRight = new Vector2(pos.x + this.width / 2, pos.y + this.height / 2);
    this.boundRectangle = new Rectangle(bottomLeft, topRight);
  }

  // Connector management methods
  addConnector(connector: IConnector): void {
    if (!this.connectors) {
      this.connectors = [];
    }
    this.connectors.push(connector);
    
    // Set this object as the host for the connector if it doesn't already have one
    if ('setHost' in connector && typeof connector.setHost === 'function') {
      const connectorWithHost = connector as any;
      if (!connectorWithHost.hostObject) {
        connectorWithHost.setHost(this, 0, 0); // Default to center position
      } else {
        // Update host but preserve relative position
        connectorWithHost.hostObject = this;
        connectorWithHost.updatePositionFromHost();
      }
    }
  }
  
  removeConnector(connector: IConnector): void {
    if (this.connectors) {
      const index = this.connectors.indexOf(connector);
      if (index > -1) {
        this.connectors.splice(index, 1);
      }
    }
  }
  
  // Update all connectors when this object updates
  updateConnectors(dt: number): void {
    if (this.connectors) {
      this.connectors.forEach(connector => {
        connector.update(dt);
      });
    }
  }
  
  // Render all connectors
  renderConnectors(ctx: CanvasRenderingContext2D): void {
    if (this.connectors) {
      this.connectors.forEach(connector => {
        connector.render(ctx);
      });
    }
  }

  // Implement required size property
  get size() {
    return { width: this.width, height: this.height };
  }

  update(dt: number): void {
    // Default no-op
  }

  render(ctx: unknown): void {
    // Default no-op
  }
}

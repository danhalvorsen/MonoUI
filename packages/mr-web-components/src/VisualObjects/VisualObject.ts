import {PhysicObject} from "mr-abstract-components";
import { Vector2, Rectangle } from "@my-graphics/math";
import type { IConnector, IStyle } from "mr-abstract-components";

export class VisualObject extends PhysicObject  {
  id!: string;
  selected?: boolean;
  isDraggable?: boolean;
  isDragging?: boolean;
  boundRectangle: Rectangle;
  
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
    id: string = 'VisualObject',
    selected: boolean = false,
    isDraggable: boolean = false,
    style?: IStyle
  ) {
    super(position, velocity, acceleration, width, height);
    this.id = id;
    this.selected = selected;
    this.isDraggable = isDraggable;
    this.style = style;
    // Initialize boundRectangle using the updateBoundRectangle method for consistency
    this.updateBoundRectangle();
  }

  // Provide public access to the underlying position
  get position() {
    return this._position;
  }
  
  // Update position and boundRectangle when position changes
  set position(newPosition: Vector2) {
    this._position = newPosition;
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
  
  // Update the boundRectangle to match current position
  // Note: This creates boundRectangle in the same coordinate system as the object position
  // Hit testing coordinates must be converted to match this coordinate system
  private updateBoundRectangle(): void {
    const bottomLeft = new Vector2(this._position.x - this.width / 2, this._position.y - this.height / 2);
    const topRight = new Vector2(this._position.x + this.width / 2, this._position.y + this.height / 2);
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

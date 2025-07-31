import { VisualObject } from './VisualObject.js';
import type { IRope, IConnector } from "mr-abstract-components";
import { Vector2 } from '@my-graphics/math';

/**
 * Rope class that connects two VisualObjects via their connectors
 * Demonstrates connector system and dynamic line rendering
 */
export class Rope extends VisualObject implements IRope {
  private startConnector?: IConnector;
  private endConnector?: IConnector;
  private lineWidth: number = 3;
  private lineColor: string = '#8b5cf6'; // Purple rope color
  private isDashed: boolean = false;
  
  // IRope interface properties
  public startObject: any; // Will be VisualObject that owns startConnector
  public endObject: any;   // Will be VisualObject that owns endConnector
  public state: 'default' | 'active' | 'selected' | 'disabled' = 'default';
  public lineVariant: 'thin' | 'medium' | 'thick' = 'medium';
  public lineStyle: 'solid' | 'dotted' | 'dashed' = 'solid';

  constructor(
    id: string,
    startConnector?: IConnector,
    endConnector?: IConnector,
    lineWidth: number = 3,
    lineColor: string = '#8b5cf6'
  ) {
    // Initialize with center position between connectors (if available)
    const centerPos = Rope.calculateCenterPosition(startConnector, endConnector);
    super(centerPos, new Vector2(0, 0), new Vector2(0, 0), 0, 0);
    
    this.id = id;
    this.startConnector = startConnector;
    this.endConnector = endConnector;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.isDraggable = false; // Rope itself is not draggable
    
    // Connect the connectors if provided
    if (this.startConnector && this.endConnector) {
      this.connectEndpoints();
    }
  }

  /**
   * Calculates center position between two connectors
   */
  private static calculateCenterPosition(start?: IConnector, end?: IConnector): Vector2 {
    if (!start || !end) {
      return new Vector2(0, 0);
    }
    
    return new Vector2(
      (start.position.x + end.position.x) / 2,
      (start.position.y + end.position.y) / 2
    );
  }

  /**
   * Sets the start connector for the rope
   */
  setStartConnector(connector: IConnector): void {
    this.startConnector = connector;
    if (connector && 'SetConnectedObject' in connector) {
      (connector as any).SetConnectedObject(this);
    }
    this.updatePosition();
  }

  /**
   * Sets the end connector for the rope
   */
  setEndConnector(connector: IConnector): void {
    this.endConnector = connector;
    if (connector && 'SetConnectedObject' in connector) {
      (connector as any).SetConnectedObject(this);
    }
    this.updatePosition();
  }

  /**
   * Connects both endpoints and establishes the connection
   */
  private connectEndpoints(): void {
    if (this.startConnector && 'SetConnectedObject' in this.startConnector) {
      (this.startConnector as any).SetConnectedObject(this);
    }
    if (this.endConnector && 'SetConnectedObject' in this.endConnector) {
      (this.endConnector as any).SetConnectedObject(this);
    }
  }

  /**
   * Updates rope position to center between connectors
   */
  private updatePosition(): void {
    if (this.startConnector && this.endConnector) {
      const centerPos = Rope.calculateCenterPosition(this.startConnector, this.endConnector);
      this._position = centerPos;
      // Note: Rope doesn't need bounding rectangle updates like regular VisualObjects
    }
  }

  /**
   * Gets the start point of the rope
   */
  getStartPoint(): Vector2 {
    if (this.startConnector) {
      return new Vector2(this.startConnector.position.x, this.startConnector.position.y);
    }
    return new Vector2(0, 0);
  }

  /**
   * Gets the end point of the rope
   */
  getEndPoint(): Vector2 {
    if (this.endConnector) {
      return new Vector2(this.endConnector.position.x, this.endConnector.position.y);
    }
    return new Vector2(0, 0);
  }

  /**
   * Gets the length of the rope
   */
  getLength(): number {
    const start = this.getStartPoint();
    const end = this.getEndPoint();
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Sets rope visual properties using design tokens
   */
  setRopeStyle(
    lineVariant: 'thin' | 'medium' | 'thick' = 'medium',
    lineStyle: 'solid' | 'dotted' | 'dashed' = 'solid',
    state: 'default' | 'active' | 'selected' | 'disabled' = 'default'
  ): void {
    this.lineVariant = lineVariant;
    this.lineStyle = lineStyle;
    this.state = state;
  }

  /**
   * Update method called each frame
   */
  update(): void {
    // Update position to stay centered between connectors
    this.updatePosition();
  }

  /**
   * Renders the rope as a line between the two connectors
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.startConnector || !this.endConnector) {
      return; // Can't render without both endpoints
    }

    const start = this.getStartPoint();
    const end = this.getEndPoint();

    // Set line style
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round';

    // Set dash pattern if dashed
    if (this.isDashed) {
      ctx.setLineDash([10, 5]);
    } else {
      ctx.setLineDash([]);
    }

    // Draw the rope line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Reset line dash
    ctx.setLineDash([]);

    // Optional: Draw rope endpoints as small circles
    this.drawEndpoint(ctx, start, '#4c1d95');
    this.drawEndpoint(ctx, end, '#4c1d95');
  }

  /**
   * Draws a small circle at rope endpoints
   */
  private drawEndpoint(ctx: CanvasRenderingContext2D, point: Vector2, color: string): void {
    const radius = this.lineWidth / 2 + 1;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  /**
   * Checks if a point is near the rope line (for selection/interaction)
   */
  isPointNearRope(point: Vector2, tolerance: number = 5): boolean {
    const start = this.getStartPoint();
    const end = this.getEndPoint();
    
    // Calculate distance from point to line segment
    const A = point.x - start.x;
    const B = point.y - start.y;
    const C = end.x - start.x;
    const D = end.y - start.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return false; // Start and end are the same point
    
    let param = dot / lenSq;
    
    // Clamp to line segment
    if (param < 0) param = 0;
    if (param > 1) param = 1;
    
    const xx = start.x + param * C;
    const yy = start.y + param * D;
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance <= tolerance;
  }

  /**
   * Gets information about the rope connection
   */
  getConnectionInfo(): {
    isConnected: boolean;
    startObject: string;
    endObject: string;
    length: number;
  } {
    return {
      isConnected: !!(this.startConnector && this.endConnector),
      startObject: this.startObject?.id || 'unknown',
      endObject: this.endObject?.id || 'unknown',
      length: this.getLength()
    };
  }
}

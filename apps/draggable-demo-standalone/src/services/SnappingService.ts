import { Vector2 } from '@my-graphics/math';
import type { IVisualObject } from 'mr-abstract-components';
import { GridService } from './GridService.js';

export interface SnappingConfig {
  snapToGrid: boolean;
  snapToObjects: boolean;
  snapDistance: number;
  showSnapGuides: boolean;
}

/**
 * Service responsible for snapping functionality
 * Follows Single Responsibility Principle - only handles snapping logic
 */
export class SnappingService {
  private config: SnappingConfig;
  private gridService: GridService;

  constructor(
    gridService: GridService,
    config: SnappingConfig = {
      snapToGrid: true,
      snapToObjects: true,
      snapDistance: 10,
      showSnapGuides: true
    }
  ) {
    this.gridService = gridService;
    this.config = config;
  }

  /**
   * Snaps a position based on current snapping configuration
   */
  snapPosition(
    position: Vector2,
    draggedObject: IVisualObject,
    allObjects: IVisualObject[]
  ): Vector2 {
    let snappedPosition = position;

    // Snap to grid first
    if (this.config.snapToGrid && this.gridService.isEnabled()) {
      snappedPosition = this.gridService.snapToGrid(snappedPosition);
    }

    // Snap to other objects
    if (this.config.snapToObjects) {
      snappedPosition = this.snapToObjects(snappedPosition, draggedObject, allObjects);
    }

    return snappedPosition;
  }

  /**
   * Snaps position to nearby objects
   */
  private snapToObjects(
    position: Vector2,
    draggedObject: IVisualObject,
    allObjects: IVisualObject[]
  ): Vector2 {
    let bestSnap = position;
    let minDistance = this.config.snapDistance;

    for (const obj of allObjects) {
      if (obj === draggedObject) continue;

      // Snap to object edges (left, right, top, bottom)
      const snapCandidates = [
        // Align left edges
        new Vector2(obj.position.x, position.y),
        // Align right edges
        new Vector2(obj.position.x + obj.size.width - draggedObject.size.width, position.y),
        // Align top edges
        new Vector2(position.x, obj.position.y),
        // Align bottom edges
        new Vector2(position.x, obj.position.y + obj.size.height - draggedObject.size.height),
        // Align centers horizontally
        new Vector2(
          obj.position.x + obj.size.width / 2 - draggedObject.size.width / 2,
          position.y
        ),
        // Align centers vertically
        new Vector2(
          position.x,
          obj.position.y + obj.size.height / 2 - draggedObject.size.height / 2
        )
      ];

      for (const candidate of snapCandidates) {
        const distance = this.calculateDistance(position, candidate);
        if (distance < minDistance) {
          minDistance = distance;
          bestSnap = candidate;
        }
      }
    }

    return bestSnap;
  }

  /**
   * Calculates distance between two positions
   */
  private calculateDistance(pos1: Vector2, pos2: Vector2): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Renders snap guides on the canvas
   */
  renderSnapGuides(
    ctx: CanvasRenderingContext2D,
    draggedObject: IVisualObject,
    allObjects: IVisualObject[],
    canvasWidth: number,
    canvasHeight: number
  ): void {
    if (!this.config.showSnapGuides) return;

    ctx.save();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.7;

    for (const obj of allObjects) {
      if (obj === draggedObject) continue;

      // Draw horizontal alignment guides
      if (this.isHorizontallyAligned(draggedObject, obj)) {
        const y = obj.position.y + obj.size.height / 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }

      // Draw vertical alignment guides
      if (this.isVerticallyAligned(draggedObject, obj)) {
        const x = obj.position.x + obj.size.width / 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /**
   * Checks if two objects are horizontally aligned
   */
  private isHorizontallyAligned(obj1: IVisualObject, obj2: IVisualObject): boolean {
    const tolerance = this.config.snapDistance;
    const center1 = obj1.position.y + obj1.size.height / 2;
    const center2 = obj2.position.y + obj2.size.height / 2;
    return Math.abs(center1 - center2) < tolerance;
  }

  /**
   * Checks if two objects are vertically aligned
   */
  private isVerticallyAligned(obj1: IVisualObject, obj2: IVisualObject): boolean {
    const tolerance = this.config.snapDistance;
    const center1 = obj1.position.x + obj1.size.width / 2;
    const center2 = obj2.position.x + obj2.size.width / 2;
    return Math.abs(center1 - center2) < tolerance;
  }

  /**
   * Updates the snapping configuration
   */
  updateConfig(newConfig: Partial<SnappingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Toggles grid snapping
   */
  toggleGridSnapping(): void {
    this.config.snapToGrid = !this.config.snapToGrid;
  }

  /**
   * Toggles object snapping
   */
  toggleObjectSnapping(): void {
    this.config.snapToObjects = !this.config.snapToObjects;
  }

  /**
   * Gets the current snapping configuration
   */
  getConfig(): SnappingConfig {
    return { ...this.config };
  }
}

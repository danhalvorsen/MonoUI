import { Vector2 } from "@my-graphics/math";

export interface ISnapConfiguration {
  /** Whether snapping is enabled */
  enabled: boolean;
  
  /** Whether to snap to grid points */
  snapToGrid: boolean;
  
  /** Snap radius in pixels - objects within this distance will snap */
  snapRadius: number;
  
  /** Whether to snap to other objects */
  snapToObjects: boolean;
  
  /** Whether to snap to axis lines */
  snapToAxis: boolean;
  
  /** Whether to show visual feedback when snapping */
  showSnapIndicators: boolean;
  
  /** Color of snap indicators */
  snapIndicatorColor: string;
  
  /** Size of snap indicators */
  snapIndicatorSize: number;
  
  /** Custom snap points (in addition to grid) */
  customSnapPoints: Vector2[];
  
  /** Whether to snap to custom points */
  snapToCustomPoints: boolean;
  
  /** Snap tolerance for different snap types */
  gridSnapTolerance: number;
  objectSnapTolerance: number;
  axisSnapTolerance: number;
  customPointSnapTolerance: number;
}

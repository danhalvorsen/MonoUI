import type { IVisualObject } from "mr-abstract-components";

 
export interface IGridObject extends IVisualObject {
  gridSize: number;           // Size of each grid cell
  gridColor?: string;         // Color of grid lines (optional)
  showGrid: boolean;          // Whether to show/hide the grid
  snapToGrid?: boolean;       // Whether objects should snap to grid (optional)
}


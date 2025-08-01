import { Vector2 } from "@my-graphics/math";

export interface IGridConfiguration {
  /** Whether to show the grid */
  visible: boolean;
  
  /** Size of each grid cell */
  cellSize: number;
  
  /** Color of grid lines */
  color: string;
  
  /** Width of grid lines */
  lineWidth: number;
  
  /** Opacity of grid lines (0-1) */
  opacity: number;
  
  /** Origin point of the grid */
  origin: Vector2;
  
  /** Whether to show major grid lines */
  showMajorLines: boolean;
  
  /** Spacing for major grid lines (every N cells) */
  majorLineSpacing: number;
  
  /** Color of major grid lines */
  majorLineColor: string;
  
  /** Width of major grid lines */
  majorLineWidth: number;
  
  /** Whether to show minor grid lines */
  showMinorLines: boolean;
  
  /** Color of minor grid lines */
  minorLineColor: string;
  
  /** Width of minor grid lines */
  minorLineWidth: number;
}

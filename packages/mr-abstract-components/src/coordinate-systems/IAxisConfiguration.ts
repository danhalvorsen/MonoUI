import { Vector2 } from "@my-graphics/math";

export interface IAxisConfiguration {
  /** Whether to show the axis line */
  showAxis: boolean;
  
  /** Color of the axis line */
  color: string;
  
  /** Width of the axis line */
  lineWidth: number;
  
  /** Opacity of the axis (0-1) */
  opacity: number;
  
  /** Whether to show tick marks on the axis */
  showTicks: boolean;
  
  /** Size of tick marks in pixels */
  tickSize: number;
  
  /** Spacing between tick marks */
  tickSpacing: number;
  
  /** Whether to show labels on tick marks */
  showLabels: boolean;
  
  /** Font for axis labels */
  labelFont: string;
  
  /** Color of axis labels */
  labelColor: string;
  
  /** Whether to show the origin point */
  showOrigin: boolean;
  
  /** Size of the origin marker in pixels */
  originSize: number;
  
  /** Color of the origin marker */
  originColor: string;
  
  /** Range of the axis (min, max) */
  range: Vector2;
}

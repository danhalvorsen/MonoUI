import type { IAxisConfiguration } from "./axis/IAxisConfiguration.js";
import type { IGridConfiguration } from "./grid/IGridConfiguration.js";
import type { ISnapConfiguration } from "./grid/ISnapConfiguration.js";
import type { IVisualObjectConfiguration } from "../canvas/IVisualObjectConfiguration.js";

export interface ICartesianCoordinateControllerConfiguration extends IVisualObjectConfiguration {
  /** Configuration for the X-axis */
  xAxisConfig: IAxisConfiguration;
  
  /** Configuration for the Y-axis */
  yAxisConfig: IAxisConfiguration;
  
  /** Configuration for the grid system */
  gridConfig: IGridConfiguration;
  
  /** Configuration for snap functionality */
  snapConfig: ISnapConfiguration;
  
  /** Canvas dimensions for coordinate transformations */
  canvasWidth: number;
  canvasHeight: number;
  
  /** Overall coordinate system bounds */
  bounds: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
}

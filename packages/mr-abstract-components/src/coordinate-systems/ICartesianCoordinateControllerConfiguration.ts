import { IVisualObjectConfiguration } from "./../abstractions/IVisualObjectConfiguration.js";
import { IAxisConfiguration } from "./axis/IAxisConfiguration.js";
import { IGridConfiguration } from "./grid/IGridConfiguration.js";

export interface ICartesianCoordinateControllerConfiguration extends IVisualObjectConfiguration {
  /** Configuration for the X-axis */
  xAxisConfig: IAxisConfiguration;
  
  /** Configuration for the Y-axis */
  yAxisConfig: IAxisConfiguration;
  
  /** Configuration for the grid system */
  gridConfig: IGridConfiguration;
  
  /** Configuration for snap functionality */
 
  
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

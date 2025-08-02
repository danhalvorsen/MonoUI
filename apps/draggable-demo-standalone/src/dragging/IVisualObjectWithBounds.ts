import { Rectangle } from '@my-graphics/math';
import type { IVisualObject } from 'mr-abstract-components';

// Type guard to check if an object has a boundRectangle property
export interface IVisualObjectWithBounds extends IVisualObject {
  boundRectangle: Rectangle;
}

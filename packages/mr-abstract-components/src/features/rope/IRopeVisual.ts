import { IVisualObject } from '../canvas/IVisualObject.js';
import { IVisualConnector } from '../connector/IVisualConnector.js';
import { Vector2 } from '@my-graphics/math';
import { IControllerConfiguration } from "../abstractions/IControllerConfiguration.js";

export interface IRopeVisual extends IVisualObject {
  /** Unique identifier for the rope */
  id: string;
  
  /** Start object that the rope connects from */
  startObject: IVisualConnector;
  
  /** End object that the rope connects to */
  endObject: IVisualConnector;
  
  /** Visual state of the rope */
  state: 'default' | 'active' | 'selected' | 'disabled';
  
  /** Line style variant */
  lineVariant: 'thin' | 'medium' | 'thick';
  
  /** Line dash pattern style */
  lineStyle: 'solid' | 'dotted' | 'dashed';
  
  /**
   * Gets the current length of the rope
   */
  getLength(): number;
  
  /**
   * Gets the start point coordinates
   */
  getStartPoint(): Vector2;
  
  /**
   * Gets the end point coordinates
   */
  getEndPoint(): Vector2;
  
  /**
   * Sets the visual style of the rope
   */
  setRopeStyle(
    lineVariant?: 'thin' | 'medium' | 'thick',
    lineStyle?: 'solid' | 'dotted' | 'dashed',
    state?: 'default' | 'active' | 'selected' | 'disabled'
  ): void;
  
  /**
   * Gets connection information
   */
  getConnectionInfo(): {
    isConnected: boolean;
    startObject: string;
    endObject: string;
    length: number;
  };
  
  /**
   * Updates the rope (called each frame)
   */
  update(): void;
  
  /**
   * Renders the rope to the canvas
   */
  render(ctx: CanvasRenderingContext2D): void;
}

import type { IVisualObject } from './IVisualObject.js';

/**
 * Interface for rope objects that connect two visual objects
 * Follows the abstract component pattern for type definitions
 */
export interface IRope {
  /** Unique identifier for the rope */
  id: string;
  
  /** Start object that the rope connects from */
  startObject: IVisualObject;
  
  /** End object that the rope connects to */
  endObject: IVisualObject;
  
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
  getStartPoint(): { x: number; y: number };
  
  /**
   * Gets the end point coordinates
   */
  getEndPoint(): { x: number; y: number };
  
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

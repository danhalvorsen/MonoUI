import { IVisualObject } from "./canvas/IVisualObject.js";
import { IPhysicObject } from "./objects/IPhysicObject.js";

// Re-export commonly used types for convenience
export type { IVisualStyle } from "./canvas/IVisualStyle.js";
export type { ChangedProperties } from "./canvas/IVisualObject.js";

/**
 * Interface for connector objects that can anchor and connect visual objects.
 * Connectors act as anchor points for visual connections between objects.
 */
export interface IConnector extends IVisualObject {
  /** Physical properties for physics integration */
  physical: IPhysicObject;
  
  /** 
   * Sets the connected object for this connector
   * @param obj The visual object to connect to this connector
   */
  SetConnectedObject(obj: IVisualObject): void;
  
  /** 
   * Gets the currently connected object
   * @returns The connected visual object, or undefined if not connected
   */
  GetConnectedObject(): IVisualObject | undefined;
  
  /** 
   * Removes the connected object from this connector
   */
  RemoveConnectedObject(): void;
  
  /** 
   * Checks if this connector has a connected object
   * @returns True if connected, false otherwise
   */
  IsConnected(): boolean;
}


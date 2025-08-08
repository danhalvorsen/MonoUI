 
/**
 * Interface for connector objects that can anchor and connect visual objects.
 * Connectors act as anchor points for visual connections between objects.
 */
import { IConfiguration, IVisualObject } from "src/index.js";

export interface IConnector extends IVisualObject {
  /** Physical properties for physics integration */
  physical: IConfiguration;

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

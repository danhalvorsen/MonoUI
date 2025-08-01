import { IVisualObject } from "./IVisualObject.js";
import type { IConnectorConfiguration } from "./IConnectorConfiguration.js";
import { Vector2 } from "@my-graphics/math";

export interface IVisualConnector extends IVisualObject {
  configuration: IConnectorConfiguration;
  id: string;
  isConnected: boolean;
  isActive?: boolean;
  relativeOffset?: Vector2;
  updatePositionFromHost(): void;
  canConnectTo(target: any): boolean;
  
  /** Connect to another object */
  connectTo(target: any): void;
  
  /** Disconnect from current object */
  disconnect(): void;
}

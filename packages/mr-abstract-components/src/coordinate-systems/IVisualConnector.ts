import { IVisualObject } from "../canvas/IVisualObject.js";
import { IPhysicObject } from "../objects/IPhysicObject.js";
import { Vector2 } from "@my-graphics/math";

 

// Local connector tokens type (until mr-style is built)
export type ConnectorTokens = {
  sizeDefault?: number;
  fillDefault?: string;
  fillActive?: string;
  fillConnected?: string;
  borderDefault?: string;
  borderActive?: string;
  borderConnected?: string;
  borderWidth?: number;
  borderWidthActive?: number;
  borderRadius?: number;
};


export interface IVisualConnector extends IVisualObject {
  /** The visual object this connector is attached to */
  hostObject?: IVisualObject;
  
  /** Relative position offset from the host object */
  relativeOffset?: Vector2;
  
  /** The object this connector is connected to (if any) */
  connectedObject?: IVisualObject;
  
  /** Visual state of the connector */
  isConnected: boolean;
  isActive?: boolean;
  
  /** Connector-specific styling tokens */
  tokens?: {
      size?: 'small' | 'medium' | 'large';
      variant?: 'default' | 'active' | 'connected' | 'disabled';
  };
  
  /** Update position based on host object */
  updatePositionFromHost(): void;
  
  /** Connect to another object */
  connectTo(target: IVisualObject): void;
  
  /** Disconnect from current object */
  disconnect(): void;
  
  /** Check if this connector can connect to a target */
  canConnectTo(target: IVisualObject): boolean;
}



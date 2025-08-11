import { Vector2 } from "@my-graphics/math";
import { IVisualObject } from "../../../core/IVisualObject.js";

export interface IVisualConnector extends IVisualObject {
  hostObject?: IVisualObject;
  relativeOffset?: Vector2;
  connectedObject?: IVisualObject;
  isConnected: boolean;
  isActive?: boolean;
  tokens?: { size?: 'small' | 'medium' | 'large'; variant?: 'default' | 'active' | 'connected' | 'disabled'; };
  updatePositionFromHost(): void;
  connectTo(target: IVisualObject): void;
  disconnect(): void;
  canConnectTo(target: IVisualObject): boolean;
}

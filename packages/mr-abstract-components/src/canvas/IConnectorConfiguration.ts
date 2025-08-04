 
import { Vector2 } from "@my-graphics/math";
import { IVisualObjectConfiguration } from "src/index.js";

export interface IConnectorConfiguration extends IVisualObjectConfiguration {
  isConnected: boolean;
  isActive?: boolean;
  relativeOffset?: Vector2;
  connectorType?: 'input' | 'output' | 'bidirectional';
  maxConnections?: number;
  connectionRadius?: number;
  snapDistance?: number;
  allowSelfConnection?: boolean;
  connectionFilters?: string[];
}

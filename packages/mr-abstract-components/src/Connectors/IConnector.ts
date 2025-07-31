import { IPhysicObject, IVisualObject } from "../interfaces.js";

// Local connector tokens type (until mr-style is built)
type ConnectorTokens = {
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

export interface IConnector extends IVisualObject {
    physical: IPhysicObject;
    
    // Style tokens for mr-design system
    tokens?: Partial<ConnectorTokens>;
    
    // Connector-specific methods
    SetConnectedObject(obj: IVisualObject): void;
    GetConnectedObject(): IVisualObject;
    RemoveConnectedObject(): void;
    IsConnected(): boolean;
}

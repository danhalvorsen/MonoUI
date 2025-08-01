import type { IVisualObject } from "mr-abstract-components";

export interface IVisualConnector extends IVisualObject {
    /** The visual object this connector is attached to */
    hostObject?: IVisualObject;
    
    /** Relative position offset from the host object */
    relativeOffset?: { x: number; y: number };
    
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

import type { ChangedProperties, IConnector, IPhysicObject, IStyle, IVisualObject } from "mr-abstract-components";
import { Vector2 } from '@my-graphics/math';
import { ConnectorTokenService } from 'mr-style';

export class Connector implements IConnector {
    private connectedObject?: IVisualObject;
    private hostObject?: IVisualObject;
    private relativePosition: Vector2; // Position relative to host

    physical: IPhysicObject;
    id: string;
    selected?: boolean;
    isActive?: boolean;
   
    
    isDraggable?: boolean;
    
    // Style tokens for mr-design system
    private tokenService: ConnectorTokenService;
    
    constructor(
        id: string,
        hostObject?: IVisualObject,
        relativeX: number = 0,
        relativeY: number = 0,
        tokenService?: ConnectorTokenService
    ) {
        this.id = id;
        this.hostObject = hostObject;
        this.relativePosition = new Vector2(relativeX, relativeY);
        this.physical.Posistionosition = new Vector2(0, 0);
        this.physical.size = { width: 12, height: 12 }; // Default connector size
        this.isDraggable = false; // Connectors should not be draggable
        this.physical = {} as IPhysicObject; // TODO: Implement proper physics object
        this.tokenService = tokenService || new ConnectorTokenService();
        
        // Update initial position based on host
        this.updatePositionFromHost();
    }
    isConnected: boolean;
    relativeOffset?: { x: number; y: number; };
    canConnectTo(target: any): boolean {
        throw new Error("Method not implemented.");
    }
    connectTo(target: any): void {
        throw new Error("Method not implemented.");
    }
    disconnect(): void {
        throw new Error("Method not implemented.");
    }
    enabled?: boolean;
    physicObject?: IPhysicObject;
    position: Vector2;
    style?: IStyle;
    connectors?: IConnector[];
    onDragStart?: (event: MouseEvent) => void;
    onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
    onDragEnd?: (event: MouseEvent) => void;
    update(dt: number): void {
        // Update connector position based on host object
        this.updatePositionFromHost();
        
        // Update selection state to match host
        if (this.hostObject) {
            this.selected = this.hostObject.selected;
        }
        
        // TODO: Add any connector-specific update logic here
    }
    
    public updatePositionFromHost(): void {
        if (this.hostObject) {
            // Calculate absolute position based on host position + relative offset
            this.physical.position.x = this.hostObject.position.x + this.relativePosition.x;
            this.physical.position.y = this.hostObject.position.y + this.relativePosition.y;
        }
    }
    
    // Method to set or change the host object
    setHost(hostObject: IVisualObject, relativeX: number = 0, relativeY: number = 0): void {
        this.hostObject = hostObject;
        this.relativePosition = new Vector2(relativeX, relativeY);
        this.updatePositionFromHost();
    }
    
    // Method to get the host object
    getHost(): IVisualObject | undefined {
        return this.hostObject;
    }
    
    render(ctx: CanvasRenderingContext2D): void {
        // Default connector styling (can be overridden by tokens)
        const size = this.tokenService.sizeDefault || 12;
        const fillColor = this.IsConnected() 
            ? (this.tokenService.fillConnected || '#10b981')
            : (this.selected 
                ? (this.tokenService.fillActive || '#3b82f6')
                : (this.tokenService.fillDefault || '#6366f1'));
        const borderColor = this.IsConnected()
            ? this.tokenService.borderConnected
            : (this.selected
                ? this.tokenService.borderActive
                : this.tokenService.borderDefault);
        const borderWidth = this.selected 
            ? this.tokenService.borderWidthActive
            : this.tokenService.borderWidth;
        const borderRadius = this.tokenService.borderRadius;

        // Calculate square position (centered on connector position)
        const x = this.physical.position.x - size / 2;
        const y = this.physical.position.y - size / 2;

        // Draw filled square with rounded corners
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, borderRadius);
        ctx.fill();

        // Draw border
        if (borderWidth > 0) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.stroke();
        }

        // Draw connection indicator if connected
        if (this.IsConnected()) {
            const indicatorSize = size * 0.4;
            const indicatorX = this.physical.position.x - indicatorSize / 2;
            const indicatorY = this.physical.position.y - indicatorSize / 2;
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(indicatorX, indicatorY, indicatorSize, indicatorSize, 1);
            ctx.fill();
        }
    }
    connectedCallback?(): void {
        throw new Error("Method not implemented.");
    }
    disconnectedCallback?(): void {
        throw new Error("Method not implemented.");
    }
    shouldUpdate?(changedProperties: ChangedProperties): boolean {
        throw new Error("Method not implemented.");
    }
    willUpdate?(changedProperties: ChangedProperties): void {
        throw new Error("Method not implemented.");
    }
    firstUpdated?(changedProperties: ChangedProperties): void {
        throw new Error("Method not implemented.");
    }
    updated?(changedProperties: ChangedProperties): void {
        throw new Error("Method not implemented.");
    }

    // IConnector specific methods
    SetConnectedObject(obj: IVisualObject): void {
        this.connectedObject = obj;
    }

    GetConnectedObject(): IVisualObject {
        if (!this.connectedObject) {
            throw new Error("No object is connected to this connector.");
        }
        return this.connectedObject;
    }

    RemoveConnectedObject(): void {
        this.connectedObject = undefined;
    }

    IsConnected(): boolean {
        return this.connectedObject !== undefined;
    }
}
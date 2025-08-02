import type { Vector2 } from "@my-graphics/math";
import type { IPhysicObject, IStyle, IConnector, ChangedProperties, ISnapFeature } from "mr-abstract-components";
 


export class SnapObject implements ISnapFeature {
    position: Vector2;
    snapRadius: number;
    snapIndicatorColor?: string;
    showSnapIndicator: boolean;
    snapToGrid: boolean;
    snapToOrigin: boolean;
    snapToAxis: boolean;
    snapToCenter: boolean;
    snapToConnector: boolean;
    snapToSnapFeature: boolean;
    snapToObjects?: boolean;
    id: string;
    selected?: boolean;
    enabled?: boolean;
    physicObject?: IPhysicObject;
    style?: IStyle;
    connectors?: IConnector[];
    isDraggable?: boolean;
    onDragStart?: (event: MouseEvent) => void;
    onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
    onDragEnd?: (event: MouseEvent) => void;
    update(dt: number): void {
        throw new Error("Method not implemented.");
    }
    render(ctx: unknown): void {
        throw new Error("Method not implemented.");
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
    
}
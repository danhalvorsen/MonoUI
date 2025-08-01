import { ChangedProperties, IPhysicObject, IStyle, IVisualObject } from "mr-abstract-components";
import { IConnector } from "mr-abstract-components/dist/coordinate-systems/IConnector";

export class SnapVisual implements IVisualObject {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    selected?: boolean | undefined;
    enabled?: boolean | undefined;
    physicObject?: IPhysicObject | undefined;
    style?: IStyle | undefined;
    connectors?: IConnector[] | undefined;
    isDraggable?: boolean | undefined;
    onDragStart?: ((event: MouseEvent) => void) | undefined;
    onDrag?: ((event: MouseEvent, dx: number, dy: number) => void) | undefined;
    onDragEnd?: ((event: MouseEvent) => void) | undefined;
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


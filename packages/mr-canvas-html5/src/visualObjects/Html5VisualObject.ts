 
// packages/mr-canvas-html5/src/Html5VisualObject.ts
import { Vector2 } from '@my-graphics/math';
 ;

 
export class Html5VisualObject implements IVisualObject {
    id: string;
    position: Vector2;
    size: { width: number; height: number };
    draggable?: IDraggable;

    constructor(id: string, x: number, y: number, width: number, height: number) {
        this.id = id;
        this.position = new Vector2(x, y);
        this.size = { width, height };
    }
    configuration: IVisualObjectConfiguration;
    selected?: boolean;
    enabled?: boolean;
    connectors?: IVisualConnector[];
    metadata?: { [key: string]: any; };
    isDraggable?: boolean;
    onDragStart?: (event: MouseEvent) => void;
    onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
    onDragEnd?: (event: MouseEvent) => void;
    connectedCallback?(): void {
        throw new Error('Method not implemented.');
    }
    disconnectedCallback?(): void {
        throw new Error('Method not implemented.');
    }
    shouldUpdate?(changedProperties: ChangedProperties): boolean {
        throw new Error('Method not implemented.');
    }
    willUpdate?(changedProperties: ChangedProperties): void {
        throw new Error('Method not implemented.');
    }
    firstUpdated?(changedProperties: ChangedProperties): void {
        throw new Error('Method not implemented.');
    }
    updated?(changedProperties: ChangedProperties): void {
        throw new Error('Method not implemented.');
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#007acc';
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}

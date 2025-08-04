import type { IVisualObject } from "mr-abstract-components";

// Define or import ICanvas interface if not already available
interface ICanvas {
    addObject(obj: IVisualObject): void;
    removeObject(obj: IVisualObject): void;
    render(): void;
    screen?: IScreen;
    camera?: ICamera;
}

export class Html5Canvas implements ICanvas {
    private ctx: CanvasRenderingContext2D;
    private objects: IVisualObject[] = [];
    screen?: IScreen;
    camera?: ICamera;
    // ICanvas is now imported from mr-abstract-components
    constructor(private canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get 2D context');
        this.ctx = ctx;
    }

    addObject(obj: IVisualObject): void {
        this.objects.push(obj);
    }

    removeObject(obj: IVisualObject): void {
        this.objects = this.objects.filter(o => o !== obj);
    }

    render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const obj of this.objects) {
            obj.draw(this.ctx);
        }
    }
}

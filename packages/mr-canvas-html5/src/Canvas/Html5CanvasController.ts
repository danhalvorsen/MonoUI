// packages/mr-canvas-html5/src/Html5CanvasController.ts
import type { ICanvasController, IVisualObject } from 'mr-abstract-components';
 
import { Html5Canvas } from './Html5Canvas.js';
 
import { Html5DraggableService } from '../Html5DraggableService.js';

export class Html5CanvasController implements ICanvasController {
    readonly context: CanvasRenderingContext2D;
    store: IDatastore;

    private canvas: Html5Canvas;
    private mouseService: Html5MouseService;
    private draggableService?: Html5DraggableService;
    private animationFrame?: number;

    constructor(
        private readonly canvasElement: HTMLCanvasElement,
        store: IDatastore,
        enableDragging: boolean = false
    ) {
        const ctx = canvasElement.getContext('2d');
        if (!ctx) throw new Error('Failed to get 2D context');
        this.context = ctx;
        this.store = store;

        this.canvas = new Html5Canvas(canvasElement);
        this.mouseService = new Html5MouseService(canvasElement);

        if (enableDragging) {
            this.draggableService = new Html5DraggableService(this.mouseService);
        }
    }

    addObject(obj: IVisualObject): void {
        this.canvas.addObject(obj);
    }

    removeObject(obj: IVisualObject): void {
        this.canvas.removeObject(obj);
    }

    start(): void {
        const loop = () => {
            this.canvas.render();
            this.animationFrame = requestAnimationFrame(loop);
        };
        this.animationFrame = requestAnimationFrame(loop);
    }

    stop(): void {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }
}

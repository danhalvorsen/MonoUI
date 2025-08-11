import { Vector2 } from "@my-graphics/math";
// Import or define ReactiveControllerBase
import { ReactiveControllerBase } from "../../controllers/reactiveControllers/ReactiveControllerBaseHost.js";



export class NodeRender extends ReactiveControllerBase<NodeRender> {
    protected requestUpdate(): void {
        throw new Error("Method not implemented.");
    }
    protected performUpdate(): void {
        throw new Error("Method not implemented.");
    }
    private canvas: HTMLCanvasElement;
    private size: Vector2 = new Vector2(400, 200);

    constructor(canvas: HTMLCanvasElement) {
        super({} as any); // Replace {} as any with a proper IReactiveControllerHost<NodeRender> implementation if available
        this.canvas = canvas;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    setWidth(width: number): void {
        this.size.x = width;
    }

    setHeight(height: number): void {
        this.size.y = height;
    }
}

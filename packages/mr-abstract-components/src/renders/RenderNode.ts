import { IVisualNode } from "../core/index.js";
import { IRenderContext } from "../core/IRenderContext.js";

 
export abstract class AbstractRenderNode implements IRenderContext {
    initialize(): void {
        throw new Error("Method not implemented.");
    }
    clear(): void {
        throw new Error("Method not implemented.");
    }
    renderObject(obj: IVisualNode): void {
        throw new Error("Method not implemented.");
    }
    onResize(width: number, height: number): void {
        throw new Error("Method not implemented.");
    }
    getObjectAt?(x: number, y: number): IVisualNode | undefined {
        throw new Error("Method not implemented.");
    }
}
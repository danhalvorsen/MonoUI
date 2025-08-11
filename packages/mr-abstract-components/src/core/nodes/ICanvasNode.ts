import { IRenderContext } from "../IRenderContext.js";
import { INode } from "./INode.js";
export interface ICanvasNode extends INode {
    getRenderContext(): IRenderContext;
 
    onResize(): void;
    setWidth(width: number): void;
    setHeight(height: number): void;
}

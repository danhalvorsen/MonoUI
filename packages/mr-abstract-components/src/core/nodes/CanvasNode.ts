// packages/mr-abstract-components/src/core/nodes/CanvasNode.ts
import { Vector2 } from "@my-graphics/math";
 
import { NodeBase } from "./node/NodeBase.js";
import type { ICanvasNode } from "./ICanvasNode.js";
import type { INode } from "./INode.js";
import type { INodeRelations } from "../INodeReleations/INodeRelations.js";
import { IRenderContext } from "../IRenderContext.js";
 

export class CanvasNode extends NodeBase implements ICanvasNode {
  getRenderContext(): IRenderContext {
    throw new Error("Method not implemented.");
  }
  onResize(): void {
    throw new Error("Method not implemented.");
  }
  setWidth(width: number): void {
    throw new Error("Method not implemented.");
  }
  setHeight(height: number): void {
    throw new Error("Method not implemented.");
  }
  
}

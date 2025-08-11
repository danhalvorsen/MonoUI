 import { NodeBase } from "../../core/nodes/NodeBase.js"
import { IConfiguration } from "../IConfiguration.js";
import type { IRenderContext } from '../IRenderContext.js';
import type { INode } from "./INode.js";
 
export interface IVisualNode extends INode {
  GetSize(): unknown;
  configuration: IConfiguration;

  draw(render: IRenderContext): void;
}


// Use a class with a virtual draw()
export class VisualNode<THost> extends NodeBase {
  // override in concrete visuals
  draw(_render: IRenderContext): void {}
}
 


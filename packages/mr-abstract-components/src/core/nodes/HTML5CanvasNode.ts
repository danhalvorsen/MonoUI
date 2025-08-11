// src/core/nodes/HTML5CanvasNode.ts
import type { Vector2 } from "@my-graphics/math";
 
import type { IVisualNode } from "./IVisualNode.js";
import { NodeBase } from "./node/NodeBase.js";
import { HTML5CanvasRenderContext } from "../../core/HTML5CanvasRenderContext.js";
import { IRenderContext } from "../IRenderContext.js";
 
import { INode } from "./INode.js";
import { IReactiveControllerHost } from "../../controllers/ReactiveControllerHost.js";
import { INodeRelations } from "../INodeReleations/INodeRelations.js";
import { IReactiveController } from "../../controllers/IReactiveController.js";
import { INodeVisitor } from "./node/INodeVisitor.js";
import { ICanvas } from "../../canvas/ICanvas.js";

export class HTML5CanvasNode extends NodeBase implements ICanvas {
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  children: never[] = [];

  constructor(id: string) {
    super(id);
    this.element = document.createElement("canvas");
    this.context = this.element.getContext("2d")!;
  }


}

import { ReactiveControllerBase } from "../reactiveControllers/ReactiveControllerBase.js";
import { IVisualConnector } from "../../connector/IVisualConnector.js";
import { IVisualObjectConfiguration } from "./configuration/IVisualObjectConfiguration.js";
import { Vector2 } from "@my-graphics/math";
import { IVisualObject } from "./IVisualObject.js";
import { IChangedProperties } from "../ChangedProperties/IChangedProperties.js";
import { IRenderType } from "../world/IRenderType.js";
import { INodeVisitor } from "../sceneGraph/node/INodeVisitor.js";
 
export class VisualObject
  extends ReactiveControllerBase
  implements IVisualObject
{
  id: string;
  name?: string;
  parentId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  children: IVisualObject[] = [];

  position: Vector2 = new Vector2(0, 0);
  size: Vector2 = new Vector2(100, 100);  
  isVisible = true;

  configuration: IVisualObjectConfiguration;
  selected = false;
  enabled = true;
  connectors: IVisualConnector[] = [];
  isDraggable = false;

  constructor(
    id: string,
    configuration: IVisualObjectConfiguration,
    controllers: any[] = []
  ) {
    super(controllers);
    this.id = id;
    this.configuration = configuration;
  }
    onDragStart?: ((event: MouseEvent) => void) | undefined;
    onDrag?: ((event: MouseEvent, dx: number, dy: number) => void) | undefined;
    onDragEnd?: ((event: MouseEvent) => void) | undefined;
    render(ctx: unknown): void {
        throw new Error("Method not implemented.");
    }

  // Child management
  addChild(child: IVisualObject): void {
    child.parentId = this.id;
    this.children.push(child);
    child.onAdded?.();
  }
  removeChild(child: IVisualObject): void {
    this.children = this.children.filter((c) => c !== child);
    child.parentId = undefined;
    child.onRemoved?.();
  }

  // Visitor
  accept(visitor: INodeVisitor): void {
    visitor.visit(this);
    this.children.forEach((c) => c.accept(visitor));
  }

  // Lifecycle (no-ops by default)
  connectedCallback?(): void {}
  disconnectedCallback?(): void {}
  shouldUpdate?(changedProperties: IChangedProperties): boolean {
    return true;
  }
  willUpdate?(changedProperties: IChangedProperties): void {}
  firstUpdated?(changedProperties: IChangedProperties): void {}
  updated?(changedProperties: IChangedProperties): void {}
  onAdded?(): void {}
  onRemoved?(): void {}

  // Rendering
  draw?(render: IRenderType): void {
    // Example: backend decides how to draw
    //render.drawRect(this.position, this.size);
  }

  update(dt: number): void {}

  protected performUpdate(): void {
    this.update(0);
  }
}


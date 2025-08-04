import { ReactiveControllerBase } from "./ReactiveControllerBase.js";
import type {
  ChangedProperties,
  INodeVisitor,
  IRenderType,
  IVisualConnector,
  IVisualObject,
  IVisualObjectConfiguration,
} from "src/index.js";
import { Vector2 } from "@my-graphics/math";

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
  size = { width: 100, height: 100 };
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
  shouldUpdate?(changedProperties: ChangedProperties): boolean {
    return true;
  }
  willUpdate?(changedProperties: ChangedProperties): void {}
  firstUpdated?(changedProperties: ChangedProperties): void {}
  updated?(changedProperties: ChangedProperties): void {}
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

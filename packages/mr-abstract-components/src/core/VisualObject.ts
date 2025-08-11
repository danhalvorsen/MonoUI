// packages/mr-abstract-components/src/world/visualObjects/VisualObject.ts
import { Vector2 } from "@my-graphics/math";
 
import type { IObject } from "./IObject.js";
import type { IVisualObject } from "./IVisualObject.js";
import type { IVisualObjectConfiguration } from "../world/visualObjects/IVisualObjectConfiguration.js";
import type { IConfiguration } from "../IConfiguration.js";
import type { IVisualConnector } from "../world/visualObjects/connector/IVisualConnector.js";
import type { IChangedProperties } from "../events/PropertyChange/ChangedProperties.js";
import { BaseController } from "../controllers/reactiveControllers/BaseController.js";
import { IRenderContext } from "./IRenderContext.js";

type VisualConfig = IVisualObjectConfiguration & IConfiguration;

export class VisualObject extends BaseController implements IVisualObject {
  // identity
  id: string;
  name?: string;
  parentId?: string;

  // metadata & tags
  tags?: string[];
  metadata: Record<string, unknown> = {};

  // hierarchy
  readonly children: Set<IObject> = new Set();

  // geometry
  position: Vector2 = new Vector2(0, 0);
  size: Vector2 = new Vector2(100, 100);
  isVisible = true;

  // behavior/config
  configuration: IConfiguration[];
  selected = false;
  enabled = true;
  isDraggable = false;
 
  connectors: IVisualConnector[] = [];

 
  private readonly _events = new EventTarget();
  static readonly EVT_CHILD_ADDED = "child:added";
  static readonly EVT_CHILD_REMOVED = "child:removed";

  constructor(id: string, configuration: IConfiguration[]) {
    super();
    this.id = id;
    this.configuration = configuration;
  }
  GetId(): string {
    throw new Error("Method not implemented.");
  }
  SetId(id: string): void {
    throw new Error("Method not implemented.");
  }
  GetName(): string {
    throw new Error("Method not implemented.");
  }
  SetName(name: string): void {
    throw new Error("Method not implemented.");
  }
  GetDirection(): Vector2 {
    throw new Error("Method not implemented.");
  }
  SetDirection(direction: Vector2): void {
    throw new Error("Method not implemented.");
  }
  GetPosition(): Vector2 {
    throw new Error("Method not implemented.");
  }
  SetPosition(position: Vector2): void {
    throw new Error("Method not implemented.");
  }
  GetSize(): Vector2 {
    throw new Error("Method not implemented.");
  }
  SetSize(size: Vector2): void {
    throw new Error("Method not implemented.");
  }
  hostUpdate?(): void {
    throw new Error("Method not implemented.");
  }
  hostUpdated?(): void {
    throw new Error("Method not implemented.");
  }

  // ---- hierarchy ----
  addChild(child: IObject): void {
    if (!this.children.has(child)) {
      this.children.add(child);
      this.dispatch(new CustomEvent(VisualObject.EVT_CHILD_ADDED, { detail: { child } }));
    }
  }

  removeChild(child: IObject): void {
    if (this.children.delete(child)) {
      this.dispatch(new CustomEvent(VisualObject.EVT_CHILD_REMOVED, { detail: { child } }));
      (child as any).onRemoved?.();
    }
  }

  // ---- local event helpers ----
  addEventListener<T = unknown>(type: string, listener: (e: CustomEvent<T>) => void): void {
    this._events.addEventListener(type, listener as EventListener);
  }
  removeEventListener<T = unknown>(type: string, listener: (e: CustomEvent<T>) => void): void {
    this._events.removeEventListener(type, listener as EventListener);
  }
  dispatch(event: Event): boolean {
    return this._events.dispatchEvent(event);
  }

  // ---- lifecycle hooks (optional on IVisualObject) ----
  connectedCallback?(): void {}
  disconnectedCallback?(): void {}
  shouldUpdate?(changed: IChangedProperties): boolean { return true; }
  willUpdate?(changed: IChangedProperties): void {}
  firstUpdated?(changed: IChangedProperties): void {}
  updated?(changed: IChangedProperties): void {}
  onAdded?(): void {}
  onRemoved(): void {}

  // ---- rendering contract ----
  draw(_render: IRenderContext): void {
    // base visual does nothing; override in concrete visuals
  }

  // ---- tick/update ----
  update(_dt: number): void {
    // override if the visual has per-frame behavior
  }
}

import type {
  ChangedProperties,
  INodeVisitor,
  IRenderType,
  IVisualConnector,
  IVisualNode,
  IVisualObjectConfiguration,
} from "src/index.js";
import { Vector2 } from "@my-graphics/math";

export abstract class BaseVisualNode implements IVisualNode {
  id: string;
  name?: string;
  parentId?: string;
  private static idCounter = 0;
  tags?: string[];
  metadata?: Record<string, any>;
  children: IVisualNode[] = [];

  /** Position & size */
  position: Vector2 = new Vector2(0, 0);
  size = { width: 0, height: 0 };
  isDraggable = false;

  /** Visual configuration */
  configuration: IVisualObjectConfiguration;

  /** State & connectors */
  selected = false;
  enabled = true;
  connectors: IVisualConnector[] = [];

  /** Dragging hooks */
  onDragStart?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
  onDragEnd?: (event: MouseEvent) => void;

  constructor(name?: string, configuration?: Partial<IVisualObjectConfiguration>) {
    this.id = `node-${++BaseVisualNode.idCounter}`;
    this.name = name;
    this.configuration = BaseVisualNode.mergeWithDefaults(this.id, configuration);
  }

  static resetIds(): void {
    BaseVisualNode.idCounter = 0;
  }

  /** Factory for default configuration */
  protected static createDefaultVisualConfig(id: string): IVisualObjectConfiguration {
    return {
      id,
      visual: {
        visible: true,
        opacity: 1,
        zIndex: 0,
        style: {
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 1,
        },
      },
      interaction: {
        draggable : false,
        selected: false,
      },
      connectors: [],
    };
  }

  /** Merge defaults with user overrides */
  private static mergeWithDefaults(
    id: string,
    overrides?: Partial<IVisualObjectConfiguration>
  ): IVisualObjectConfiguration {
    const defaults = this.createDefaultVisualConfig(id);
    return {
      ...defaults,
      ...overrides,
      visual: {
        ...defaults.visual,
        ...(overrides?.visual ?? {}),
        style: {
          ...defaults.visual.style,
          ...(overrides?.visual?.style ?? {}),
        },
      },
      interaction: {
        ...defaults.interaction,
        ...(overrides?.interaction ?? {}),
      },
      connectors: overrides?.connectors ?? defaults.connectors,
    };
  }

  /** Add/remove children */
  addChild(child: IVisualNode): void {
    child.parentId = this.id;
    this.children.push(child);
    child.onAdded?.();
  }
  removeChild(child: IVisualNode): void {
    this.children = this.children.filter((c) => c !== child);
    child.parentId = undefined;
    child.onRemoved?.();
  }

  /** Visitor */
  accept(visitor: INodeVisitor): void {
    visitor.visit(this);
    this.children.forEach((child) => child.accept(visitor));
  }

  /** Lifecycle hooks */
  onAdded?(): void {}
  onRemoved?(): void {}
  connectedCallback?(): void {}
  disconnectedCallback?(): void {}
  shouldUpdate?(changedProperties: ChangedProperties): boolean {
    return true;
  }
  willUpdate?(changedProperties: ChangedProperties): void {}
  firstUpdated?(changedProperties: ChangedProperties): void {}
  updated?(changedProperties: ChangedProperties): void {}

  /** Update & rendering */
  update(dt: number): void {}
  draw(render: IRenderType): void {}
  render(render: IRenderType): void {
    this.draw(render);
  }
}

import { Vector2 } from "@my-graphics/math";
import { IVisualObject } from "./IVisualObject.js";
import { IVisualObjectConfiguration } from "./configuration/IVisualObjectConfiguration.js";
import { INodeVisitor } from "../world/INodeVisitor.js";
import { IRenderType } from "../world/IRenderType.js";
import { IChangedProperties } from "../ChangedProperties/IChangedProperties.js";
import { IVisualConnector } from "../../connector/IVisualConnector.js";

export abstract class BaseVisualObject implements IVisualObject {
    id: string;
    name?: string;
    parentId?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    children: IVisualObject[] = [];

    position: Vector2 = new Vector2(0, 0);
    size: Vector2 = new Vector2(100, 100);
    isDraggable = false;
    configuration: IVisualObjectConfiguration;

    selected = false;
    enabled = true;
    connectors: IVisualConnector[] = [];

    constructor(id: string, configuration: IVisualObjectConfiguration) {
        this.id = id;
        this.configuration = configuration;
    }

    // ---- Lifecycle hooks ----
    onAdded?(): void {}
    onRemoved?(): void {}
    connectedCallback?(): void {}
    disconnectedCallback?(): void {}
    shouldUpdate?(changed: IChangedProperties): boolean { return true; }
    willUpdate?(changed: IChangedProperties): void {}
    firstUpdated?(changed: IChangedProperties): void {}
    updated?(changed: IChangedProperties): void {}

    // ---- Hierarchy ----
    addChild(child: IVisualObject): void {
        child.parentId = this.id;
        this.children.push(child);
        child.onAdded?.();
    }

    removeChild(child: IVisualObject): void {
        this.children = this.children.filter(c => c !== child);
        child.parentId = undefined;
        child.onRemoved?.();
    }

    // ---- Visitor pattern ----
    accept(visitor: INodeVisitor): void {
        visitor.visit(this);
        this.children.forEach(c => c.accept(visitor));
    }

    // ---- Update & Render ----
    update(dt: number): void {}

    abstract draw(render: IRenderType): void;

    render(render: IRenderType): void {
        this.willUpdate?.({});
        this.draw(render);
        this.updated?.({});
    }
}

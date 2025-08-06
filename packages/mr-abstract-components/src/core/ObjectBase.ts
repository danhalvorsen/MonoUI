// packages/mr-abstract-components/src/abstractions/world/ObjectBase.ts
import { Vector2, Matrix3 } from '@my-graphics/math';

import { IVisualObjectConfiguration } from "./configuration/IVisualObjectConfiguration.js";
import { NodeBase } from "../world/Nodes/NodeBase.js";
import { IVisualObject } from "./IVisualObject.js";
import { IChangedProperties } from "../ChangedProperties/IChangedProperties.js";
 
import { EmptyChangedProperties } from '../ChangedProperties/EmptyChangedProperties.js';
import { IVisualConnector } from '../sceneObjects/connector/IVisualConnector.js';
import { IRenderType } from 'src/render/rendering/IRenderType.js';

export abstract class ObjectBase extends NodeBase implements IVisualObject {
    position: Vector2 = new Vector2(0, 0);
    size:Vector2 = new Vector2(50,50);
    isDraggable?: boolean;
    selected?: boolean;
    enabled?: boolean;
    connectors?: IVisualConnector[];
    configuration!: IVisualObjectConfiguration;

    private hasRendered = false;

    connectedCallback?(): void;
    disconnectedCallback?(): void;
    shouldUpdate?(changedProperties: IChangedProperties): boolean;
    willUpdate?(changedProperties: IChangedProperties): void;
    firstUpdated?(changedProperties: IChangedProperties): void;
    updated?(changedProperties: IChangedProperties): void;

    constructor(id: string) {
        super(id);
    }

    /** Per-frame update hook */
    update(dt: number): void {
        // Default no-op
    }

    /** Must be implemented by subclasses */
    abstract draw(ctx: IRenderType): void;

    /** Render object + children */
    render(ctx: IRenderType): void {
        const emptyProps = EmptyChangedProperties.instance;

        if (this.shouldUpdate && !this.shouldUpdate(emptyProps)) return;

        this.willUpdate?.(emptyProps);
        this.draw(ctx);
        ctx.renderObject?.(this);

        if (!this.hasRendered) {
            this.firstUpdated?.(emptyProps);
            this.hasRendered = true;
        }

        this.children?.forEach(child => {
            if ('render' in child && typeof (child as any).render === 'function') {
                (child as ObjectBase).render(ctx);
            } else {
                child.draw?.(ctx as any);
                ctx.renderObject?.(child as any);
            }
        });

        this.updated?.(emptyProps);
    }
}

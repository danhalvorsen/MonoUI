// packages/mr-abstract-components/src/abstractions/world/ObjectBase.ts
import { Vector2, Matrix3 } from '@my-graphics/math';
import { 
    IRenderType, NodeBase, IVisualObject, ChangedProperties, 
    IVisualConnector, IVisualObjectConfiguration 
} from 'src/index.js';
 
export abstract class ObjectBase extends NodeBase implements IVisualObject {
    // --- Transform properties ---
    position: Vector2 = new Vector2(0, 0);
    rotation: number = 0;
    scale: Vector2 = new Vector2(1, 1);
    
    // --- Matrices ---
    localMatrix: Matrix3 = Matrix3.identity();
    worldMatrix: Matrix3 = Matrix3.identity();

    // --- Visual properties ---
    size = { width: 0, height: 0 };
    isDraggable?: boolean;
    selected?: boolean;
    enabled?: boolean;
    connectors?: IVisualConnector[];
    configuration!: IVisualObjectConfiguration;

    private hasRendered = false;

    connectedCallback?(): void;
    disconnectedCallback?(): void;
    shouldUpdate?(changedProperties: ChangedProperties): boolean;
    willUpdate?(changedProperties: ChangedProperties): void;
    firstUpdated?(changedProperties: ChangedProperties): void;
    updated?(changedProperties: ChangedProperties): void;

    constructor(id: string) {
        super(id);
    }

    /** --- Transform updates --- */
    updateLocalMatrix(): void {
        this.localMatrix = Matrix3.fromTransform(
            this.position.x,
            this.position.y,
            this.scale.x,
            this.scale.y,
            this.rotation
        );
    }

    updateWorldMatrix(force = false): void {
        this.updateLocalMatrix();
        if (this.parent && 'worldMatrix' in this.parent) {
            this.worldMatrix = (this.parent as ObjectBase).worldMatrix.multiply(this.localMatrix) as Matrix3;
        } else {
            this.worldMatrix = this.localMatrix.clone() as Matrix3;
        }
        this.children?.forEach(child => {
            if ('updateWorldMatrix' in child) {
                (child as ObjectBase).updateWorldMatrix(true);
            }
        });
    }

    /** Per-frame update hook */
    update(dt: number): void {
        // Default no-op
    }

    /** Must be implemented by subclasses */
    abstract draw(ctx: IRenderType): void;
// Inside ObjectBase
addChild(child: ObjectBase): void {
    if (!this.children) this.children = [];
    this.children.push(child);
    (child as any).parent = this;
    child.updateWorldMatrix(true);
}

removeChild(child: ObjectBase): void {
    if (!this.children) return;
    this.children = this.children.filter(c => c !== child);
    (child as any).parent = undefined;
}

    /** Render object + children */
    render(ctx: IRenderType): void {
        if (this.shouldUpdate && !this.shouldUpdate(new Map())) return;

        this.updateWorldMatrix();

        this.willUpdate?.(new Map());
        this.draw(ctx);
        ctx.renderObject?.(this);

        if (!this.hasRendered) {
            this.firstUpdated?.(new Map());
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

        this.updated?.(new Map());
    }
}

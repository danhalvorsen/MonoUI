// src/abstractions/world/TransformNode.ts
import { Vector3, Matrix3 } from '@my-graphics/math';
import { ITransformNode } from './ITransformNode.js';

export class TransformNode implements ITransformNode<TransformNode> {
    id: string;
    parent?: TransformNode;
    children: TransformNode[] = [];

    position = new Vector3(0, 0, 0);
    rotation = 0;
    scale = new Vector3(1, 1, 1);

    localMatrix: Matrix3 = Matrix3.identity();
    worldMatrix: Matrix3 = Matrix3.identity();

    // Event handlers
    onParentChanged?: (node: TransformNode) => void;
    onTransformChanged?: (node: TransformNode) => void;

    constructor(id: string) {
        this.id = id;
    }

    updateLocalMatrix(): void {
        this.localMatrix = Matrix3.fromTransform(
            this.position.x,
            this.position.y,
            this.scale.x,
            this.scale.y,
            this.rotation
        );
        this.onTransformChanged?.(this);
    }

    updateWorldMatrix(force = false): void {
        this.updateLocalMatrix();
        if (this.parent) {
            this.worldMatrix = this.parent.worldMatrix.multiply(this.localMatrix) as Matrix3;
        } else {
            this.worldMatrix = this.localMatrix.clone() as Matrix3;
        }
        this.onTransformChanged?.(this);

        for (const child of this.children) {
            child.updateWorldMatrix(true);
        }
    }

    addChild(child: TransformNode): void {
        if (child.parent) child.removeFromParent();
        this.children.push(child);
        child.parent = this;
        child.onParentChanged?.(child);
        child.updateWorldMatrix(true);
    }

    removeChild(child: TransformNode): void {
        this.children = this.children.filter(c => c !== child);
        child.parent = undefined;
        child.onParentChanged?.(child);
        child.updateWorldMatrix(true);
    }

    removeFromParent(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    findChildById(id: string): TransformNode | undefined {
        if (this.id === id) return this;
        for (const child of this.children) {
            const found = child.findChildById(id);
            if (found) return found;
        }
        return undefined;
    }
}

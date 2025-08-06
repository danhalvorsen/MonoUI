// src/abstractions/world/ITransformNode.ts
import { Matrix3, Vector3 } from '@my-graphics/math';

export type TransformNodeEventHandler<T extends ITransformNode<T>> = (node: T) => void;

export interface ITransformNode<T extends ITransformNode<T> = any> {
    id: string;
    parent?: T;
    children: T[];

    position: Vector3;
    rotation: number;
    scale: Vector3;

    localMatrix: Matrix3;
    worldMatrix: Matrix3;

    // Event hooks
    onParentChanged?: TransformNodeEventHandler<T>;
    onTransformChanged?: TransformNodeEventHandler<T>;

    updateLocalMatrix(): void;
    updateWorldMatrix(force?: boolean): void;

    addChild(child: T): void;
    removeChild(child: T): void;
    removeFromParent(): void;
    findChildById(id: string): T | undefined;
}

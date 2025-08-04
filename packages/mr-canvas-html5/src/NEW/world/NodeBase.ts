// packages/mr-abstract-components/src/world/NodeBase.ts
import { INode  } from 'mr-abstract-components';

export abstract class NodeBase implements INode {
    id: string;
    name?: string;
    parentId?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    children?: INode[] = [];

    constructor(id: string) {
        this.id = id;
    }

    draw?(ctx: CanvasRenderingContext2D | WebGLRenderingContext): void;

    accept(visitor: INodeVisitor): void {
        visitor.visit(this);
        this.children?.forEach(child => child.accept(visitor));
    }
}

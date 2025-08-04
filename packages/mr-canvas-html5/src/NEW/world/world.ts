// packages/mr-abstract-components/src/world/WorldBase.ts
import {INode, NodeBase} from 'mr-abstract-components';
 

export class WorldBase extends NodeBase implements IWorld {
    cameras: ICamera[] = [];
    screens: IScreen[] = [];
    activeCameraId?: string;

    findNodeById(id: string): INode | undefined {
        let found: INode | undefined;
        this.accept({
            visit(node: INode) {
                if (node.id === id) found = node;
            }
        });
        return found;
    }

    createIterator(): IIterator<INode> {
        return new NodeIterator(this);
    }
}

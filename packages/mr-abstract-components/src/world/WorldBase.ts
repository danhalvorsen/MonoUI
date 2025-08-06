// packages/mr-abstract-components/src/abstractions/world/WorldBase.ts

import { ICamera } from '../../CommonTypes/ICamera.js';
import { IScreen } from '../../CommonTypes/IScreen.js';
import { INode } from './INode.js';   
import { IWorld } from '../sceneGraph/IWorld.js';
import { NodeBase } from './Nodes/NodeBase.js';
 
let worldCounter = 0;

export class WorldBase extends NodeBase implements IWorld {
    cameras: ICamera[] = [];
    screens: IScreen[] = [];
    activeCameraId?: string;
   
    constructor(id: string = `world-${++worldCounter}`) {
        super(id);
    }

    findNodeById(id: string): INode | undefined {
        let found: INode | undefined;
        this.accept({
            visit(node: INode) {
                if (node.id === id) found = node;
            }
        });
        return found;
    }
}

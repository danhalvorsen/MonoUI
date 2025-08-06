// packages/mr-abstract-components/src/abstractions/world/IWorld.ts

import { ICamera } from '../../CommonTypes/ICamera.js';
import { IScreen } from '../../CommonTypes/IScreen.js';
import { INodeVisitor } from './INodeVisitor.js';
import { INode } from './INode.js';

export interface IWorld extends INode {
    /** All cameras in the world */
    cameras: ICamera[];

    /** Screens (viewports) that render parts of the world */
    screens: IScreen[];

    /** Active camera ID for primary rendering */
    activeCameraId?: string;

    /** Utility: find node by id */
    findNodeById(id: string): INode | undefined;

    /** Traverse with visitor */
    accept(visitor: INodeVisitor): void;
}

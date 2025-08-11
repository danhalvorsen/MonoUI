// packages/mr-abstract-components/src/abstractions/world/WorldBase.ts

 
import { BaseControllerHost } from "../controllers/reactiveControllers/BaseControllerHost.js";
import type { INode } from "../core/nodes/INode.js";
import type { ICamera } from "./sceneGraph/ICamera.js";
import type { IScreen } from "./sceneGraph/IScreen.js";
import { Vector2 } from "@my-graphics/math";

let worldCounter = 0;

export class WorldController extends BaseControllerHost<WorldController> {
  cameras: ICamera[] = [];
  screens: IScreen[] = [];

  position = new Vector2(0, 0);
  direction = new Vector2(0, 0);
  velocity = new Vector2(0, 0);
  accept: any;

  constructor(id: string = `world-${++worldCounter}`) {
    super(undefined as unknown as WorldController); // Temporary fix, replace with correct instance if available
  }

  // Lit-style lifecycle hooks (no-ops; override as needed)
  hostConnected(): void {}
  hostDisconnected(): void {}
  hostUpdate?(): void {}
  hostUpdated?(): void {}

  findNodeById(id: string): INode | undefined {
    let found: INode | undefined;
    this.accept({
      visit(node: INode) {
        if (node.id === id) {
          found = node;
        }
      },
    });
    return found;
  }
}

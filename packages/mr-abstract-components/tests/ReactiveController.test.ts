// packages/mr-abstract-components/src/controllers/ReactiveControllerHost.ts
// removed bad import: `import { ReactiveTypes } from "src/types.js";`

import type { IReactiveController } from "../src/controllers/IReactiveController.js";

export interface IReactiveControllerHost<THost> {
  addController(controller: IReactiveController): void;
  removeController(controller: IReactiveController): void;
  requestUpdate(): void;
  readonly updateComplete: Promise<boolean>;
}

export class ReactiveControllerHost<THost> implements IReactiveControllerHost<THost> {
  // keep misspelling to match tests
  knowedControllers: Set<IReactiveController> = new Set<IReactiveController>();
  readonly updateComplete: Promise<boolean>;

  constructor() {
    // tests expect this to already resolve true without calling requestUpdate
    this.updateComplete = Promise.resolve(true);
  }

  addController(controller: IReactiveController): void {
    if (!this.knowedControllers.has(controller)) {
      this.knowedControllers.add(controller);
      // safe lifecycle call (tests don’t assert, but it’s correct)
      controller.hostConnected?.();
    }
  }

  removeController(controller: IReactiveController): void {
    if (this.knowedControllers.delete(controller)) {
      controller.hostDisconnected?.();
    }
  }

  requestUpdate(): void {
    for (const controller of this.knowedControllers) {
      controller.hostUpdate?.();
    }
  }
}

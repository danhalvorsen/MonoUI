

import { IReactiveController } from "../IReactiveController.js";
import { IReactiveControllerHost } from "../ReactiveControllerHost.js";

export abstract class ReactiveControllerBase<THost> {
  private controllers: IReactiveController[] = [];
  protected host: IReactiveControllerHost<THost>; 

  constructor(
    host: IReactiveControllerHost<THost>, 
    initialControllers: IReactiveController[] = []) {
    this.host = host;
    this.controllers = initialControllers;
  }

  addController(controller: IReactiveController): void {
    this.controllers.push(controller);
    controller.hostConnected?.();
  }

  removeController(controller: IReactiveController): void {
    this.controllers = this.controllers.filter(c => c !== controller);
    controller.hostDisconnected?.();
  }

  protected getControllers(): ReadonlyArray<IReactiveController> {
    return this.controllers;
  }

  /** NEW: Get a single controller by its class type */
  protected getController<T extends IReactiveController>(type: new (...args: any[]) => T): T | undefined {
    return this.controllers.find(c => c instanceof type) as T | undefined;
  }

  protected abstract  requestUpdate(): void;

  protected abstract performUpdate(): void;
}

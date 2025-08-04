import { IReactiveController } from "src/index.js";

export abstract class ReactiveControllerBase {
  private controllers: IReactiveController[] = [];

  constructor(initialControllers: IReactiveController[] = []) {
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

  protected requestUpdate(): void {
    for (const controller of this.controllers) controller.hostUpdate?.();
    this.performUpdate();
    for (const controller of this.controllers) controller.hostUpdated?.();
  }

  protected abstract performUpdate(): void;
}

import { IReactiveController } from "./IReactiveController.js";
import { IReactiveControllerHost } from "./ReactiveControllerHost.js";
import { BaseController } from "./reactiveControllers/BaseController.js";

export abstract class LifeCycleController extends BaseController {
  private host: IReactiveControllerHost<LifeCycleController>;
  constructor(host: IReactiveControllerHost<LifeCycleController>) {
    super();
    this.host = host;
  }
  hostConnected(): void {
    // Handle host connected
  }
  hostDisconnected(): void {
    // Handle host disconnected
  }
  hostUpdate?(): void {
    // Handle host update
  }
  hostUpdated?(): void {
    // Handle host updated
  }
}

import { ReactiveControllerHost } from "./ReactiveControllerHost.js";
import { IReactiveController } from "./IReactiveController.js";


export class ReactiveController implements IReactiveController {
  hostConnected(): void {
  }
  hostDisconnected(): void {
  }
  hostUpdate?(): void {
  }
  hostUpdated?(): void {
  }
  private host?: ReactiveControllerHost;
}

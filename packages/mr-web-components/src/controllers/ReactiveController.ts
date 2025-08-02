import type { IReactiveControllerHost, IReactiveController } from "mr-abstract-components";

export class ReactiveController implements IReactiveController {
  hostConnected(): void {
  }
  hostDisconnected(): void {
  }
  hostUpdate?(): void {
  }
  hostUpdated?(): void {
  }
  private host?: IReactiveControllerHost;

}

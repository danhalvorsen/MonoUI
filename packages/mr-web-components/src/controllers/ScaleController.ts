import { ReactiveController, ReactiveControllerHost } from 'lit';

export class ScaleController implements ReactiveController {
  private host?: ReactiveControllerHost;
  constructor(host?: ReactiveControllerHost) {
    if (host) this.setHost(host);
  }
  setHost(host: ReactiveControllerHost) { this.host = host; }
  hostConnected() {{}}
  hostDisconnected() {{}}
}

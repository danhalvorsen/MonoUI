import { ReactiveController, ReactiveControllerHost } from 'lit';
import { injectable } from 'tsyringe';

@injectable()
export class MouseController implements ReactiveController {
  public x = 0;
  public y = 0;
  private host!: ReactiveControllerHost & HTMLElement;

  setHost(host: ReactiveControllerHost & HTMLElement) {
    this.host = host;
  }

  hostConnected() {
    this.host.addEventListener('pointermove', this.onMove);
  }

  hostDisconnected() {
    this.host.removeEventListener('pointermove', this.onMove);
  }

  private onMove = (e: PointerEvent) => {
    this.x = e.clientX;
    this.y = e.clientY;
    this.host.requestUpdate();
  };
}

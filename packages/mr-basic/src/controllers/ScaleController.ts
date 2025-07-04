import { ReactiveController, ReactiveControllerHost } from 'lit';
import { injectable } from 'tsyringe';

@injectable()
export class ScaleController implements ReactiveController {
  private host!: ReactiveControllerHost & HTMLElement;
  public scale = 1;

  setHost(host: ReactiveControllerHost & HTMLElement) {
    this.host = host;
  }

  hostConnected() {
    this.host.addEventListener('wheel', this.onWheel);
    this.applyScale();
  }

  hostDisconnected() {
    this.host.removeEventListener('wheel', this.onWheel);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.scale += e.deltaY > 0 ? -0.1 : 0.1;
    if (this.scale < 0.1) this.scale = 0.1;
    this.applyScale();
    this.host.requestUpdate();
  };

  private applyScale() {
    this.host.style.transform = `scale(${this.scale})`;
    this.host.style.transformOrigin = 'top left';
  }
}

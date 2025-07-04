import { ReactiveController, ReactiveControllerHost } from 'lit';
import { injectable, inject } from 'tsyringe';
import { MouseController } from './MouseController';

@injectable()
export class DragController implements ReactiveController {
  private host!: ReactiveControllerHost & HTMLElement;
  private dragging = false;
  private startX = 0;
  private startY = 0;

  constructor(@inject(MouseController) private mouse: MouseController) {}

  setHost(host: ReactiveControllerHost & HTMLElement) {
    this.host = host;
  }

  hostConnected() {
    this.host.style.position = 'absolute';
    this.host.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointermove', this.onMove);
  }

  hostDisconnected() {
    this.host.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointermove', this.onMove);
  }

  private onDown = (e: PointerEvent) => {
    this.dragging = true;
    this.startX = e.clientX - this.host.offsetLeft;
    this.startY = e.clientY - this.host.offsetTop;
  };

  private onUp = () => {
    this.dragging = false;
  };

  private onMove = () => {
    if (!this.dragging) return;
    const x = this.mouse.x - this.startX;
    const y = this.mouse.y - this.startY;
    this.host.style.left = `${x}px`;
    this.host.style.top = `${y}px`;
  };
}

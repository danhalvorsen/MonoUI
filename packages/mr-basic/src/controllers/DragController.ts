// File: packages/mr-basic/src/controllers/DragController.ts
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
    if (!(host instanceof HTMLElement)) {
      throw new Error('DragController host must be an HTMLElement');
    }
    this.host = host;
  }

  hostConnected() {
    if (!this.host.style.position || this.host.style.position === 'static') {
      this.host.style.position = 'absolute';
    }
    this.host.addEventListener('pointerdown', this.onDown, { passive: false });
    window.addEventListener('pointerup', this.onUp, { passive: true });
    window.addEventListener('pointermove', this.onMove, { passive: true });
  }

  hostDisconnected() {
    this.host.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointermove', this.onMove);
  }

  private onDown = (e: PointerEvent) => {
    e.preventDefault(); // prevent text selection
    this.dragging = true;
    this.startX = e.clientX - this.host.offsetLeft;
    this.startY = e.clientY - this.host.offsetTop;
  };

  private onUp = () => {
    this.dragging = false;
  };

  private onMove = () => {
    if (!this.dragging) return;
    if (this.mouse?.x == null || this.mouse?.y == null) return;

    const x = this.mouse.x - this.startX;
    const y = this.mouse.y - this.startY;
    this.host.style.left = `${x}px`;
    this.host.style.top = `${y}px`;
  };
}

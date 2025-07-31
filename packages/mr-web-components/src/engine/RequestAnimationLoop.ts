import type { IAnimationLoop } from 'mr-abstract-components';

export class RequestAnimationLoop implements IAnimationLoop {
  private running = false;
  private lastTime = 0;
  private callbacks: Array<(dt: number) => void> = [];
  private rafId = 0;

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const tick = (time: number) => {
      if (!this.running) return;
      const dt = time - this.lastTime;
      this.lastTime = time;
      for (const cb of this.callbacks) cb(dt);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  onTick(cb: (dt: number) => void): void {
    this.callbacks.push(cb);
  }
}

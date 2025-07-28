import { IAnimationLoop } from "./AnimationLoop.js";

export class RAFLoop implements IAnimationLoop {
  private last = 0;
  private running = false;
  private fns: ((dt: number) => void)[] = [];

  start() {
    if (this.running) return;
    this.running = true;
    const step = (t: number) => {
      const dt = (t - this.last) / 1000;
      this.last = t;
      this.fns.forEach(cb => cb(dt));
      if (this.running) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  stop() { this.running = false; }
  onTick(cb: (dt: number) => void) { this.fns.push(cb); }
}

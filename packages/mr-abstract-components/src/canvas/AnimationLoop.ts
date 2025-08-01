
export interface IAnimationLoop {
  start(): void;
  stop(): void;
  onTick(cb: (dt: number) => void): void;
}

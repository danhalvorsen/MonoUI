
export interface AnimationLoop {
  start(): void;
  stop(): void;
  onTick(cb: (dt: number) => void): void;
}

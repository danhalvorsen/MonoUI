import { AnimationLoop } from "mr-abstract-components";
/**
 * Simple requestAnimationFrame based animation loop.
 */
export declare class RequestAnimationLoop implements AnimationLoop {
    private running;
    private lastTime;
    private callbacks;
    private rafId;
    start(): void;
    stop(): void;
    onTick(cb: (dt: number) => void): void;
}

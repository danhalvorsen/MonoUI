import { AnimationLoop } from "./AnimationLoop.js";
export declare class RAFLoop implements AnimationLoop {
    private last;
    private running;
    private fns;
    start(): void;
    stop(): void;
    onTick(cb: (dt: number) => void): void;
}

import { ReactiveController, ReactiveControllerHost } from 'lit';
export declare class ScaleController implements ReactiveController {
    private host;
    scale: number;
    setHost(host: ReactiveControllerHost & HTMLElement): void;
    hostConnected(): void;
    hostDisconnected(): void;
    private onWheel;
    private applyScale;
}

import { ReactiveController, ReactiveControllerHost } from 'lit';
export declare class MouseController implements ReactiveController {
    x: number;
    y: number;
    private host;
    setHost(host: ReactiveControllerHost & HTMLElement): void;
    hostConnected(): void;
    hostDisconnected(): void;
    private onMove;
}

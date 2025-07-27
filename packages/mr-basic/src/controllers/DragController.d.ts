import { ReactiveController, ReactiveControllerHost } from 'lit';
import { MouseController } from './MouseController';
export declare class DragController implements ReactiveController {
    private mouse;
    private host;
    private dragging;
    private startX;
    private startY;
    constructor(mouse: MouseController);
    setHost(host: ReactiveControllerHost & HTMLElement): void;
    hostConnected(): void;
    hostDisconnected(): void;
    private onDown;
    private onUp;
    private onMove;
}

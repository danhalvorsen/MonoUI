import { ReactiveController, ReactiveControllerHost } from 'lit';
export declare class ScaleController implements ReactiveController {
    private host?;
    constructor(host?: ReactiveControllerHost);
    setHost(host: ReactiveControllerHost): void;
    hostConnected(): void;
    hostDisconnected(): void;
}

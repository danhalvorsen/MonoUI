import { ReactiveController, ReactiveControllerHost } from 'lit';
export declare class MouseController implements ReactiveController {
    private host?;
    constructor(host?: ReactiveControllerHost);
    setHost(host: ReactiveControllerHost): void;
    hostConnected(): void;
    hostDisconnected(): void;
}

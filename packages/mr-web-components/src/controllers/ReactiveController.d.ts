import type { IReactiveController } from "mr-abstract-components";
export declare class ReactiveController implements IReactiveController {
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdate?(): void;
    hostUpdated?(): void;
    private host?;
}

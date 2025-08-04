import { IReactiveController } from "src/index.js";

export interface IReactiveControllerHost {
    addController(controller: IReactiveController): void;
    removeController(controller: IReactiveController): void;
    requestUpdate(): void;
    readonly updateComplete: Promise<boolean>;
}
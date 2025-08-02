
import { IReactiveController } from "./IReactiveController.js";

export interface IReactiveControllerHost {
 
    addController(controller: IReactiveController): void;
    removeController(controller: IReactiveController): void;
    requestUpdate(): void;
    readonly updateComplete: Promise<boolean>;
}

;
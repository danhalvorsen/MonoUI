 
import { IReactiveController } from "./IReactiveController.js";

export interface IReactiveControllerHost<THost> {
    addController(controller: IReactiveController): void;
    removeController(controller: IReactiveController): void;
    requestUpdate(): void;
    readonly updateComplete: Promise<boolean>;
}

export class ReactiveControllerHost<THost> implements IReactiveControllerHost<THost> {
    knowedControllers: Set<IReactiveController> = new Set<IReactiveController>();
    readonly updateComplete: Promise<boolean>;

    constructor() {
        this.updateComplete = Promise.resolve(true);
    }

    addController(controller: IReactiveController): void {
        if (!this.knowedControllers.has(controller)) {
            this.knowedControllers.add(controller);
        }
    }

    removeController(controller: IReactiveController): void {
        this.knowedControllers.delete(controller);
    }

    requestUpdate(): void {
        // Notify all controllers to update
        for (const controller of this.knowedControllers) {
            if (typeof controller.hostUpdate === 'function') {
                controller.hostUpdate();
            }
        }
    }
}                                                       
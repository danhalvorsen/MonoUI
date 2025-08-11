import { IReactiveController } from "./IReactiveController.js";


export class ReactiveControllerRegistry<THost> {


    private static readonly controllers: Map<IReactiveController, number> = new Map();

    register(type: IReactiveController): void {
        const count = ReactiveControllerRegistry.controllers.get(type) || 0;
        ReactiveControllerRegistry.controllers.set(type, count + 1);
    }

    unregister(type: IReactiveController): void {
        const count = ReactiveControllerRegistry.controllers.get(type);
        if (count !== undefined) {
            (count > 1) ?
                ReactiveControllerRegistry.controllers.set(type, count - 1) :
                ReactiveControllerRegistry.controllers.delete(type);
        }
    }

    public static registerController<T extends IReactiveController>(controller: T): void {
        const count = this.controllers.get(controller) || 0;
        this.controllers.set(controller, count + 1);
    }

    public static getControllers(): Array<IReactiveController> {
        return Array.from(this.controllers.keys());
    }
    public static containsController<T extends IReactiveController>(controller: T): boolean {
        return this.controllers.has(controller);
    }
}

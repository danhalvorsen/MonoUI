import type { IRenderContext } from "../core/IRenderContext.js";
import type { IReactiveControllerHost } from "../controllers/ReactiveControllerHost.js";
import type { IReactiveController } from "../controllers/IReactiveController.js";


export class Canvas {
  constructor(private rc: IRenderContext) {}
  add(obj: IReactiveControllerHost<any> | IReactiveController): void {
    /* ... */
  }
  private isReactiveControllerHost(obj: any): obj is IReactiveControllerHost<any> {
    return obj && typeof obj.addController === "function";
  }
}
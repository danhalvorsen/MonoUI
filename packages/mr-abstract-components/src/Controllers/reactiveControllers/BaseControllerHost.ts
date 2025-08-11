import { IReactiveController } from "../IReactiveController.js";
import { IReactiveControllerHost } from "../ReactiveControllerHost.js";
export class BaseControllerHost<THost> implements IReactiveControllerHost<THost> {
  static register: Set<any> = new Set();
  private isUpdateRequested = false;
  private resolveUpdate!: (value: boolean) => void;

  constructor(type: THost) {
    BaseControllerHost.register.add(type);
    this.updateComplete = new Promise<boolean>((resolve) => {
      this.resolveUpdate = resolve;
    });
  }

  requestUpdate(): void {
    if (!this.isUpdateRequested) {
      this.isUpdateRequested = true;
      Promise.resolve().then(() => {
        this.isUpdateRequested = false;
        for (const ctrl of this.ctrls) {
          if (typeof ctrl.hostUpdate === 'function') {
            ctrl.hostUpdate();
          }
        }
        this.resolveUpdate(true);
        // Prepare for next update
        this.updateComplete = new Promise<boolean>((resolve) => {
          this.resolveUpdate = resolve;
        });
      });
    }
  }
  updateComplete: Promise<boolean>;
  private ctrls = new Set<IReactiveController>();

  addController(ctrl: IReactiveController): void {
    if (this.ctrls.has(ctrl)) return;
    this.ctrls.add(ctrl);
    ctrl.hostConnected();
  }

  removeController(ctrl: IReactiveController): void {
    if (!this.ctrls.delete(ctrl)) return;
    ctrl.hostDisconnected();
  }

  dispose(): void {
    for (const c of this.ctrls) c.hostDisconnected();
    this.ctrls.clear();
  }
}
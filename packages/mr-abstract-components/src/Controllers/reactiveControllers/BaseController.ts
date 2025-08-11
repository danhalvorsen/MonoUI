// reactive-controller.ts
 
import { fromEvent, Observable, Subscription, share } from 'rxjs';
import { IReactiveController } from '../IReactiveController.js';
 

export abstract class BaseController implements IReactiveController {

  private bag = new Subscription();
  static register: Set<IReactiveController> = new Set();

  protected connected = false;
  resolveUpdate: ((value: boolean | PromiseLike<boolean>) => void) | undefined;

  constructor() {
    BaseController.register.add(this);
    this.updateComplete = new Promise<boolean>((resolve) => {
      this.resolveUpdate = resolve;
    });       
  }
  addController(controller: IReactiveController): void {
    throw new Error('Method not implemented.');
  }
  removeController(controller: IReactiveController): void {
    throw new Error('Method not implemented.');
  }
  requestUpdate(): void {
    throw new Error('Method not implemented.');
  }
  declare updateComplete: Promise<boolean>;

  hostConnected(): void {
    if (this.connected) return;
    this.connected = true;
    this.onConnected();
  }

  hostDisconnected(): void {
    if (!this.connected) return;
    this.connected = false;
    this.onDisconnected();
    this.reset();
  }

  /** Hook points */
  protected onConnected(): void {}
  protected onDisconnected(): void {}

  /** Track any subscription so it auto-disposes on hostDisconnected */
  protected track<T extends Subscription>(s: T): T { this.bag.add(s); return s; }

  /** Subscribe to a source and auto-track */
  protected effect<T>(src: Observable<T>, next: (v: T) => void): Subscription {
    return this.track(src.subscribe(next));
  }

  /** Event helper (multicasted) */
  protected events<E extends Event>(target: EventTarget, type: string, options: AddEventListenerOptions = {}) {
    return fromEvent<E>(target, type, options).pipe(share());
  }

  /** Create a disposable sub-scope (great for per-object bindings) */
  protected scope() {
    const scopeBag = new Subscription();
    return {
      track<T extends Subscription>(s: T) { scopeBag.add(s); return s; },
      effect<T>(src: Observable<T>, next: (v: T) => void) { return scopeBag.add(src.subscribe(next)); },
      dispose() { scopeBag.unsubscribe(); }
    };
  }

  private reset() { this.bag.unsubscribe(); this.bag = new Subscription(); }
}

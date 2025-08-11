// packages/mr-abstract-components/src/events/RxEventDispatchStrategy.ts
import type { IEventDispatchStrategy } from "./IEventDispatchStrategy.js";
import type { IReactiveController } from "../controllers/IReactiveController.js";
import type { EventMap, EventEnvelope, IObservable, ISubscription } from "mr-event-base";
import { RxJSEventSystemBase } from "mr-event-rxjs";

type Listener = EventListenerOrEventListenerObject;

function toCustomEvent<T>(type: string, payload: T): CustomEvent<T> {
  return new CustomEvent<T>(type, { detail: payload });
}
function callListener(listener: Listener, ev: Event) {
  if (typeof listener === "function") (listener as EventListener)(ev);
  else (listener as EventListenerObject).handleEvent?.(ev);
}

export class RxEventDispatchStrategy<E extends EventMap = Record<string, unknown>>
  implements IEventDispatchStrategy, IReactiveController
{
  readonly bus: RxJSEventSystemBase<E>;
  private readonly bindings = new Map<string, Map<Listener, ISubscription>>();

  constructor(bus?: RxJSEventSystemBase<E>) {
    this.bus = bus ?? new RxJSEventSystemBase<E>();
  }

  // IReactiveController
  hostConnected(): void {}
  hostDisconnected(): void {
    for (const m of this.bindings.values()) {
      for (const sub of m.values()) sub.unsubscribe();
      m.clear();
    }
    this.bindings.clear();
    this.bus.complete();
  }
  hostUpdate?(): void {}
  hostUpdated?(): void {}

  // IEventDispatchStrategy (DOM-like)
  addEventListener(type: string, listener: Listener): void {
    let perType = this.bindings.get(type);
    if (!perType) { perType = new Map(); this.bindings.set(type, perType); }
    if (perType.has(listener)) return;
    const sub = this.bus.on(type as keyof E, (payload: any) => {
      callListener(listener, toCustomEvent(type, payload));
    });
    perType.set(listener, sub);
  }

  removeEventListener(type: string, listener: Listener): void {
    const perType = this.bindings.get(type);
    const sub = perType?.get(listener);
    if (sub) {
      sub.unsubscribe();
      perType!.delete(listener);
      if (perType!.size === 0) this.bindings.delete(type);
    }
  }

  dispatchEvent(event: Event): boolean {
    const type = event.type as keyof E & string;
    const payload = (event as CustomEvent<any>).detail;
    this.bus.emit(type as any, payload);
    return true;
  }

  // Nice-to-have typed helpers used by tests
  on<K extends keyof E & string>(type: K, h: (p: E[K]) => void): ISubscription {
    return this.bus.on(type, h as any);
  }
  once<K extends keyof E & string>(type: K, h: (p: E[K]) => void): ISubscription {
    return this.bus.once(type, h as any);
  }
  emit<K extends keyof E & string>(type: K, payload: E[K]): void {
    this.bus.emit(type, payload);
  }
  events$(): IObservable<EventEnvelope<E, keyof E>> {
    return this.bus.events$();
  }
}

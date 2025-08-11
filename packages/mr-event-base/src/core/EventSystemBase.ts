// packages/mr-event-base/src/core/EventSystemBase.ts
import type {
  EventEnvelope, EventMap, Handler, IObservable, ISubject, ISubscription
} from "./EventSystemTypes.js";
import type { IEventSystem } from "./IEventSystem.js";

function inertObservable<T>(): IObservable<T> {
  return {
    subscribe() {
      return { closed: true, unsubscribe() {} };
    },
  } as IObservable<T>;
}

export abstract class EventSystemBase<E extends EventMap> implements IEventSystem<E> {
  private _completed = false;

  protected abstract subjectOf<K extends keyof E>(event: K): ISubject<E[K]>;
  protected abstract envelopeBus(): ISubject<EventEnvelope<E, keyof E>>;
  protected abstract onComplete(): void;

  protected get isCompleted(): boolean {
    return this._completed;
  }

  observe<K extends keyof E>(event: K): IObservable<E[K]> {
    if (this._completed) return inertObservable<E[K]>();
    return this.subjectOf(event);
  }

  events$(): IObservable<EventEnvelope<E, keyof E>> {
    if (this._completed) return inertObservable<EventEnvelope<E, keyof E>>();
    return this.envelopeBus();
  }

  on<K extends keyof E>(event: K, handler: Handler<E, K>): ISubscription {
    return this.observe(event).subscribe(handler);
  }

  once<K extends keyof E>(event: K, handler: Handler<E, K>): ISubscription {
    if (this._completed) {
      return { closed: true, unsubscribe() {} };
    }
    let sub: ISubscription | undefined;
    sub = this.observe(event).subscribe((v) => {
      try { handler(v); } finally { sub?.unsubscribe(); }
    });
    return sub as ISubscription;
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    if (this._completed) return; // no-op after complete
    this.subjectOf(event).next(payload);
    this.envelopeBus().next({ type: event, payload } as EventEnvelope<E, keyof E>);
  }

  complete(): void {
    if (this._completed) return;
    this._completed = true;
    this.onComplete();
  }
}

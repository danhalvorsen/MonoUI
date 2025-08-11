// packages/mr-event-base/tests/_support/MiniSubject.ts
import type {
  IObserver, IObservable, ISubject, ISubscription
} from "../../src/core/EventSystemTypes.js";

class MiniSubscription implements ISubscription {
  private _closed = false;
  constructor(private teardown: () => void) {}
  get closed() { return this._closed; }
  unsubscribe(): void {
    if (!this._closed) {
      this._closed = true;
      this.teardown();
    }
  }
}

export class MiniSubject<T> implements ISubject<T> {
  private observers = new Set<IObserver<T>>();
  private _completed = false;

  subscribe(nextOrObserver: IObserver<T> | ((v: T) => void)): ISubscription {
    if (this._completed) return new MiniSubscription(() => {});
    const obs: IObserver<T> =
      typeof nextOrObserver === "function" ? { next: nextOrObserver } : nextOrObserver;
    this.observers.add(obs);
    return new MiniSubscription(() => this.observers.delete(obs));
  }

  next(value: T): void {
    if (this._completed) return;
    for (const o of Array.from(this.observers)) o.next(value);
  }

  complete(): void {
    if (this._completed) return;
    this._completed = true;
    for (const o of Array.from(this.observers)) o.complete?.();
    this.observers.clear();
  }
}
